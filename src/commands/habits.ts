import { Client, Message, MessageEmbed } from 'discord.js';
import { Command, config } from '..';
import { CardDifficulty } from '../models/enums/card-difficulty';
import { StreakResetInterval } from '../models/enums/streak-reset-interval';
import { IHabitCard } from '../models/schemas/habit-card';
import User, { IUser } from '../models/user';
import awaitMessage from '../util/await-message';
import { EmbedMenu, MenuPage } from '../util/embed-menu';
import { emojiLiteral, emojiReactable } from '../util/emojis';

export default new Command({
  name: `habits`,
  description: `List your habits`,
  usage: `{p}habits`,
  example: `{p}habits`,
  async execute(
    bot: Client,
    msg: Message,
    args: Array<string>,
    help: MessageEmbed
  ) {
    let user = (await User.findOne({
      id: msg.author.id
    })) as IUser;

    if (!user) {
      return msg.channel.send(
        `Please use the \`${config.PREFIX}register\` command first.`
      );
    }

    new EmbedMenu({
      cache: {
        selected: 0,
        embedIndex: 0
      },
      embedGenerator: async (listCache: {
        selected: number;
        embedIndex: number;
      }): Promise<MessageEmbed> => {
        const embeds: Array<MessageEmbed> = [];

        for (let i = 0; i < user.lists.habits.length; i += 10) {
          embeds.push(
            new MessageEmbed()
              .setTitle(`Habits`)
              .setDescription(
                user.lists.habits
                  .slice(i, i + 10)
                  .map((habitCard: IHabitCard, index: number) => {
                    const lines = [
                      /* Name */
                      `__**${habitCard.name}**__`,
                      /* Description */
                      `*${habitCard.description}*`,
                      /* Streak */
                      `Streak${emojiLiteral('streak')}: ${
                        habitCard.positive ? `+${habitCard.positiveStreak}` : ``
                      }${
                        habitCard.positiveStreak && habitCard.negativeStreak
                          ? ` | `
                          : ``
                      }${
                        habitCard.negative ? `-${habitCard.negativeStreak}` : ``
                      }`,
                      /* Difficulty */
                      `**Difficulty:** ${habitCard.difficulty}`
                    ].map((l) => (index == listCache.selected ? `> ` : ``) + l);

                    const _ = index == listCache.selected ? `> ` : ``;

                    return lines.join('\n');
                  })
                  .join('\n\n')
              )
              .setColor(
                ImportanceColours[
                  user.lists.habits[
                    listCache.embedIndex * 10 + listCache.selected
                  ].importance - 1
                ]
              )
          );
        }

        return embeds.length > 0
          ? embeds[listCache.embedIndex]
          : new MessageEmbed()
              .setTitle(`Habits`)
              .setDescription(`No habits yet! Click ➕ to add a new habit!`);
      },
      emojiHandlers: [
        {
          emoji: emojiReactable('navigateDown'),
          condition: () => user.lists.habits.length > 0,
          handler: (listCache) => {
            listCache.selected++;
            if (
              listCache.selected > 9 ||
              listCache.selected >= user.lists.habits.length
            ) {
              listCache.selected = 0;
              listCache.embedIndex++;
              if (
                listCache.embedIndex >=
                Math.floor(user.lists.habits.length / 10)
              ) {
                listCache.embedIndex = 0;
              }
            }
          }
        },
        {
          emoji: emojiReactable('navigateUp'),
          condition: () => user.lists.habits.length > 0,
          handler: (listCache) => {
            listCache.selected--;
            if (listCache.selected < 0) {
              listCache.selected = Math.min(9, user.lists.habits.length - 1);
              listCache.embedIndex--;
              if (listCache.embedIndex < 0) {
                listCache.embedIndex = Math.floor(
                  user.lists.habits.length / 10
                );
              }
            }
          }
        },
        {
          emoji: emojiReactable('add'),
          handler: async (listCache) => {
            await user.updateOne({
              $push: {
                'lists.habits': {
                  $each: [
                    {
                      name: 'New Habit Card',
                      description: 'Insert a description here!'
                    } as IHabitCard
                  ],
                  $position: listCache.selected + 1
                }
              }
            });
            user = (await User.findOne({
              id: msg.author.id
            })) as IUser;
          }
        },
        {
          emoji: emojiReactable('edit'),
          condition: () => user.lists.habits.length > 0,
          handler: (listCache, switchPage) => {
            let habitCard: IHabitCard = user.lists.habits[listCache.selected];
            switchPage({
              cache: {
                selected: 0
              },
              embedGenerator: (cardCache) => {
                const lines: Array<[key: string, value: string]> = [
                  [`**Name:**`, habitCard.name],
                  [`**Description:**`, habitCard.description],
                  [
                    `**Positive streak:**`,
                    habitCard.positive ? 'enabled' : 'disabled'
                  ],
                  [
                    `**Negative streak:**`,
                    habitCard.negative ? 'enabled' : 'disabled'
                  ],
                  [`**Difficulty:**`, habitCard.difficulty.toString()],
                  [`**Importance:**`, habitCard.importance.toString()],
                  [`**Tags:**`, habitCard.tags.join(' ')],
                  [
                    `**When to reset streak(s):**`,
                    StreakResetInterval[habitCard.streakReset]
                  ]
                ];
                lines[cardCache.selected][1] = `\`${
                  lines[cardCache.selected][1]
                }\``;
                return new MessageEmbed().setDescription(
                  lines.map((line) => line.join(' ')).join('\n')
                );
              },
              emojiHandlers: [
                {
                  emoji: emojiReactable('return'),
                  handler: (_1, _2, switchToPreviousPage) => {
                    switchToPreviousPage();
                  }
                },
                {
                  emoji: emojiReactable('navigateDown'),
                  handler: (cardCache) => {
                    cardCache.selected =
                      cardCache.selected == 7 ? 0 : cardCache.selected + 1;
                  }
                },
                {
                  emoji: emojiReactable('navigateUp'),
                  handler: (cardCache) => {
                    cardCache.selected =
                      cardCache.selected == 0 ? 7 : cardCache.selected - 1;
                  }
                },
                /* Edit name */
                {
                  emoji: emojiReactable('edit'),
                  condition: (cardCache) => cardCache.selected == 0,
                  handler: async (cardCache) => {
                    const query = await msg.channel.send('Enter the new name:');
                    try {
                      const responce = await awaitMessage(
                        msg.channel,
                        msg.author,
                        (m) => {
                          if (m.content.length > 64) {
                            msg.channel
                              .send(
                                `The limit for card names are 64. The name provided is ${m.content.length} characters.`
                              )
                              .then((m) => m.delete({ timeout: 2000 }));
                            m.delete({ timeout: 2000 }).catch(() => {});
                          }
                          return m.content.length <= 64;
                        }
                      );

                      await User.updateOne(
                        {
                          'lists.habits._id': habitCard._id
                        },
                        {
                          'lists.habits.$.name': responce.content
                        }
                      );
                      user = (await User.findOne({
                        id: msg.author.id
                      })) as IUser;
                      habitCard = user.lists.habits[listCache.selected];

                      await responce.delete().catch(() => {});
                      await query.delete();
                    } catch {
                      await query.delete();
                      return;
                    }
                  }
                },
                /* Edit description */
                {
                  emoji: emojiReactable('edit'),
                  condition: (cardCache) => cardCache.selected == 1,
                  handler: async (cardCache) => {
                    const query = await msg.channel.send(
                      'Enter the new description:'
                    );
                    try {
                      const responce = await awaitMessage(
                        msg.channel,
                        msg.author,
                        (m) => {
                          if (m.content.length > 256) {
                            msg.channel
                              .send(
                                `The limit for card descriptions are 256. The description provided is ${m.content.length} characters.`
                              )
                              .then((m) => m.delete({ timeout: 2000 }));
                            m.delete({ timeout: 2000 }).catch(() => {});
                          }
                          return m.content.length <= 256;
                        }
                      );

                      await User.updateOne(
                        {
                          'lists.habits._id': habitCard._id
                        },
                        {
                          'lists.habits.$.description': responce.content
                        }
                      );
                      user = (await User.findOne({
                        id: msg.author.id
                      })) as IUser;
                      habitCard = user.lists.habits[listCache.selected];

                      responce.delete().catch(() => {});
                      query.delete();
                    } catch {
                      query.delete();
                      return;
                    }
                  }
                },
                /* Toggle positive streak off */
                {
                  emoji: emojiReactable('positiveDisabled'),
                  condition: (cardCache) =>
                    cardCache.selected == 2 && habitCard.positive,
                  handler: async () => {
                    await User.updateOne(
                      {
                        'lists.habits._id': habitCard._id
                      },
                      {
                        'lists.habits.$.positive': false
                      }
                    );
                    user = (await User.findOne({
                      id: msg.author.id
                    })) as IUser;
                    habitCard = user.lists.habits[listCache.selected];
                  }
                },
                /* Toggle positive streak on */
                {
                  emoji: emojiReactable('positiveEnabled'),
                  condition: (cardCache) =>
                    cardCache.selected == 2 && !habitCard.positive,
                  handler: async () => {
                    await User.updateOne(
                      {
                        'lists.habits._id': habitCard._id
                      },
                      {
                        'lists.habits.$.positive': true
                      }
                    );
                    user = (await User.findOne({
                      id: msg.author.id
                    })) as IUser;
                    habitCard = user.lists.habits[listCache.selected];
                  }
                },
                /* Toggle negative streak off */
                {
                  emoji: emojiReactable('negativeDisabled'),
                  condition: (cardCache) =>
                    cardCache.selected == 3 && habitCard.negative,
                  handler: async () => {
                    await User.updateOne(
                      {
                        'lists.habits._id': habitCard._id
                      },
                      {
                        'lists.habits.$.negative': false
                      }
                    );
                    user = (await User.findOne({
                      id: msg.author.id
                    })) as IUser;
                    habitCard = user.lists.habits[listCache.selected];
                  }
                },
                /* Toggle negative streak on */
                {
                  emoji: emojiReactable('negativeEnabled'),
                  condition: (cardCache) =>
                    cardCache.selected == 3 && !habitCard.negative,
                  handler: async () => {
                    await User.updateOne(
                      {
                        'lists.habits._id': habitCard._id
                      },
                      {
                        'lists.habits.$.negative': true
                      }
                    );
                    user = (await User.findOne({
                      id: msg.author.id
                    })) as IUser;
                    habitCard = user.lists.habits[listCache.selected];
                  }
                },
                /* Increase Difficulty */
                {
                  emoji: emojiReactable('increaseDifficulty'),
                  condition: (cardCache) =>
                    cardCache.selected == 4 &&
                    Number(CardDifficulty[habitCard.difficulty]) < 4,
                  handler: async () => {
                    await User.updateOne(
                      {
                        'lists.habits._id': habitCard._id
                      },
                      {
                        'lists.habits.$.difficulty':
                          CardDifficulty[
                            Number(CardDifficulty[habitCard.difficulty]) + 1
                          ]
                      }
                    );
                    user = (await User.findOne({
                      id: msg.author.id
                    })) as IUser;
                    habitCard = user.lists.habits[listCache.selected];
                  }
                },
                /* Decrease Difficulty */
                {
                  emoji: emojiReactable('decreaseDifficulty'),
                  condition: (cardCache) =>
                    cardCache.selected == 4 &&
                    Number(CardDifficulty[habitCard.difficulty]) > 0,
                  handler: async () => {
                    await User.updateOne(
                      {
                        'lists.habits._id': habitCard._id
                      },
                      {
                        'lists.habits.$.difficulty':
                          CardDifficulty[
                            Number(CardDifficulty[habitCard.difficulty]) - 1
                          ]
                      }
                    );
                    user = (await User.findOne({
                      id: msg.author.id
                    })) as IUser;
                    habitCard = user.lists.habits[listCache.selected];
                  }
                },
                /* Increase Importance */
                {
                  emoji: emojiReactable('increaseImportance'),
                  condition: (cardCache) =>
                    cardCache.selected == 5 && habitCard.importance < 5,
                  handler: async () => {
                    await User.updateOne(
                      {
                        'lists.habits._id': habitCard._id
                      },
                      {
                        'lists.habits.$.importance': habitCard.importance + 1
                      }
                    );
                    user = (await User.findOne({
                      id: msg.author.id
                    })) as IUser;
                    habitCard = user.lists.habits[listCache.selected];
                  }
                },
                /* Decrease Importance */
                {
                  emoji: emojiReactable('decreaseImportance'),
                  condition: (cardCache) =>
                    cardCache.selected == 5 && habitCard.importance > 1,
                  handler: async () => {
                    await User.updateOne(
                      {
                        'lists.habits._id': habitCard._id
                      },
                      {
                        'lists.habits.$.importance': habitCard.importance - 1
                      }
                    );
                    user = (await User.findOne({
                      id: msg.author.id
                    })) as IUser;
                    habitCard = user.lists.habits[listCache.selected];
                  }
                }
              ]
            } as MenuPage<{
              selected: number;
            }>);
          }
        }
      ]
    } as MenuPage<{
      selected: number;
      embedIndex: number;
    }>).start(msg.channel, msg.author);
  }
});

/**
 * Constants
 */

const ImportanceColours = [
  '#eb6363',
  '#eb9b63',
  '#ebe263',
  '#aceb63',
  '#63eb90'
];
