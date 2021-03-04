import { Collection, Message, MessageReaction, User } from 'discord.js';

export default class ReactionHandler {
  emojis: {
    [name: string]: (endCollector: () => void) => any
  };
  all: (endCollector: () => void) => any;
  constructor(
    emojis: {
      [name: string]: (endCollector: () => void) => any
    },
    all: (endCollector: () => void) => any = () => {}
  ) {
    this.emojis = emojis;
    this.all = all;
  }

  start(msg: Message, user?: User, timemout: number = 300000): void {
    const collector = msg.createReactionCollector(() => true, {
      time: timemout
    });

    collector.on('collect', async (r: MessageReaction, u: User) => {
      if (user && u.id != user.id) return;
      await (this.emojis[r.emoji.name] ?? this.emojis[r.emoji.id])?.call(null, () => collector.stop());

      /* Remove the reaction */
      const userReactions = msg.reactions.cache.filter((r) =>
        r.users.cache.some((u: User) => u.id != msg.client.user.id)
      );
      for (const reaction of userReactions.values()) {
        const users: Collection<string, User> = reaction.users.cache.filter(
          (u: User) => u.id != msg.client.user.id
        );
        users.forEach(async (user) => {
          reaction.users.remove(user.id).catch(() => {});
        });
      }

      await this.all.call(null, () => collector.stop());
    });

    collector.on('end', () => {
      this.emojis[`__end__`](() => collector.stop());
    });

    for (const emoji of Object.keys(this.emojis)) {
      msg.react(emoji).catch(() => {});
    }
  }
}
