import {
  DMChannel,
  Message,
  MessageEmbed,
  NewsChannel,
  TextChannel,
  User,
  Collection
} from 'discord.js';
import ReactionHandler from './reaction-handler';

export default class PageFlipper {
  embeds: Array<MessageEmbed>;
  constructor(embeds: Array<MessageEmbed>) {
    this.embeds = embeds;
  }
  async send(
    channel: TextChannel | DMChannel | NewsChannel,
    user: User = null,
    text: string = ``,
    timemout: number = 300000
  ): Promise<Message> {
    if (this.embeds.length < 1) return null;

    for (let i = 0; i < this.embeds.length; i++) {
      this.embeds[i].setFooter(`page ${i + 1}/${this.embeds.length}`);
    }
    if (this.embeds.length <= 1) return channel.send(this.embeds[0]);

    let index: number = 0;
    let msg: Message = await channel.send(text, this.embeds[0]);

    new ReactionHandler(
      {
        '▶': () => {
          index++;
          if (index >= this.embeds.length) index = 0;
        },
        '◀': () => {
          index--;
          if (index < 0) index = this.embeds.length - 1;
        },
        '❌': (endCollector: () => void) => {
          endCollector();
        },
        __end__: () => {
          msg.reactions.removeAll();
        }
      },
      () => {
        msg.edit(text, this.embeds[index]);
      }
    ).start(msg, user, timemout);

    return msg;
  }
}
