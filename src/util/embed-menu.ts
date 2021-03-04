import {
  Collection,
  DMChannel,
  MessageEmbed,
  MessageReaction,
  NewsChannel,
  ReactionCollector,
  TextChannel,
  User
} from 'discord.js';

export class EmbedMenu {
  currentPage: MenuPage<any>;
  stackTrace: MenuPage<any>[] = [];

  constructor(startingPage: MenuPage<any>) {
    this.currentPage = startingPage;
  }

  async start(
    channel: TextChannel | DMChannel | NewsChannel,
    user?: User,
    timeout: number = 300000
  ) {
    const _this = this;
    const msg = await channel.send(
      await _this.currentPage.embedGenerator(_this.currentPage.cache)
    );

    /* React with the emojis */
    _this.currentPage.emojiHandlers.map((emojiHandler) => {
      if (
        !emojiHandler.condition ||
        emojiHandler.condition(_this.currentPage.cache)
      ) {
        msg.react(emojiHandler.emoji);
      }
    });

    /* Create the reaction collector */
    const collector: ReactionCollector = msg.createReactionCollector(
      (r: MessageReaction, u: User) => !user || u.id == user.id,
      {
        time: timeout
      }
    );

    async function pageSetup(): Promise<void> {
      /* Remove reactions and replace with new reactions */
      msg.reactions.removeAll();
      _this.currentPage.emojiHandlers.map((emojiHandler) => {
        if (
          !emojiHandler.condition ||
          emojiHandler.condition(_this.currentPage.cache)
        ) {
          msg.react(emojiHandler.emoji);
        }
      });
    }

    collector.on('collect', async (r: MessageReaction, u: User) => {
      /* Find the corresponding function for this emoji*/
      const func = _this.currentPage.emojiHandlers.find((emojiHandler) =>
        [r.emoji.id, r.emoji.name].includes(emojiHandler.emoji)
      );

      /* Call the function and update cache */
      if (func) {
        const args: [
          any,
          (page: MenuPage<any>) => any,
          () => void,
          () => void
        ] = [
          _this.currentPage.cache,
          async function switchPage(newPage: MenuPage<any>) {
            /* Change stack trace */
            _this.stackTrace.push({
              cache: JSON.parse(JSON.stringify(_this.currentPage.cache)),
              ..._this.currentPage
            });
            _this.currentPage = newPage;
            pageSetup();
          },
          async function switchToPreviousPage() {
            _this.currentPage = _this.stackTrace.slice(-1)[0];
            /* Change stack trace */
            _this.stackTrace.pop();
            await pageSetup();
          },
          async function endCollector() {
            collector.stop();
          }
        ];
<<<<<<< HEAD
        await func.handler(...args);
=======
          ((func as ConditionalHandler<any>).condition
            ? await (func as ConditionalHandler<any>).handler(...args)
            : await (func as ReactionHandler<any>)(...args))
>>>>>>> d3cb77217d5cc53ce5fdafc172402f3edf125b9a

        _this.currentPage.allAction?.call(...args);
        msg.edit(
          await _this.currentPage.embedGenerator(_this.currentPage.cache)
        );
<<<<<<< HEAD
        const activeHandlers = _this.currentPage.emojiHandlers.filter(
          (emojiHandler) => {
            return (
              !emojiHandler.condition ||
              emojiHandler.condition(_this.currentPage.cache)
            );
=======
        /* React with the emojis */
        Object.keys(_this.currentPage.emojis).map((emoji) => {
          const condition = (_this.currentPage.emojis[emoji] as ConditionalHandler<any>).condition;
          if (!condition || condition(_this.currentPage.cache)) {
            if (!msg.reactions.cache.get(emoji)) {
              msg.react(emoji);
            }
          } else {
            msg.reactions.cache.get(emoji)?.remove();
>>>>>>> d3cb77217d5cc53ce5fdafc172402f3edf125b9a
          }
        );

        for(let activeHandler of activeHandlers){
          if (!msg.reactions.cache.get(activeHandler.emoji)) {
            msg.react(activeHandler.emoji);
          }
        }

        for (let reaction of msg.reactions.cache) {
          if (
            !activeHandlers.some(
              (activeHandler) => activeHandler.emoji == reaction[0]
            )
          ) {
            reaction[1].remove();
          }
        }
      }

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
    });

    collector.on('end', () => {
      _this.currentPage.endAction?.(_this.currentPage.cache);
      msg.reactions.removeAll();
    });
  }
}

export class MenuPage<T = void> {
  cache: T;
  embedGenerator: (data: T) => Promise<MessageEmbed> | MessageEmbed;
<<<<<<< HEAD
  emojiHandlers: EmojiHandler<T>[];
=======
  emojis: {
    [name: string]:
      ReactionHandler<T> | ConditionalHandler<T>;
  };
>>>>>>> d3cb77217d5cc53ce5fdafc172402f3edf125b9a
  allAction?: ReactionHandler<T>;
  endAction?: (data: T) => any;
}

type ReactionHandler<T> = (
  data: T,
  switchPage: (page: MenuPage<any>) => any,
  switchToPreviousPage: () => void,
  endMenu: () => void
) => Promise<void> | void;

<<<<<<< HEAD
type EmojiHandler<T> = {
  emoji: string;
  handler: ReactionHandler<T>;
  condition?: (cache: T) => boolean;
};
=======
export interface ConditionalHandler<T> {
  condition: (data: T) => boolean;
  handler: ReactionHandler<T>;
}
>>>>>>> d3cb77217d5cc53ce5fdafc172402f3edf125b9a
