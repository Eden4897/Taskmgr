import { Client, Message, MessageEmbed } from 'discord.js';
import { Command, config } from '..';
import User, { IUser } from '../models/user';
import { xpToLevel } from '../util/user';

export default new Command({
  name: `profile`,
  description: `Sends you your profile.`,
  usage: `{p}profile`,
  example: `{p}profile`,
  async execute(
    bot: Client,
    msg: Message,
    args: Array<String>,
    help: MessageEmbed
  ) {
    const user = (await User.findOne({
      id: msg.author.id
    })) as IUser;
    if (!user) {
      return msg.channel.send(
        `Please use the \`${config.PREFIX}register\` command first.`
      );
    }
    const level = xpToLevel(user.xp);
  }
});
