import { Client, Message, MessageEmbed } from 'discord.js';
import { Command } from '..';
import User, { IUser } from '../models/user';
import awaitMessage from '../util/await-message';
import * as tz from '../tz.json';
import { findBestMatch } from 'string-similarity';

export default new Command({
  name: `register`,
  description: `Registers your profile`,
  usage: `{p}register`,
  example: `{p}register`,
  async execute(
    bot: Client,
    msg: Message,
    args: Array<string>,
    help: MessageEmbed
  ) {
    const user = (await User.findOne({
      id: msg.author.id
    })) as IUser;

    if (user) {
      return msg.channel.send(`You have already registered!`);
    }

    const newUser = new User({
      id: msg.author.id
    }) as IUser;

    await msg.channel.send('Please enter your full timezone name.');

    const userCountry = (
      await awaitMessage(msg.channel, msg.author, ({ content }) => {
        if (!tz.some((country) => country.name == content)) {
          msg.channel.send(
            `\`${content}\` is not a recognized timezone. Do you mean ${
              findBestMatch(
                content,
                tz.map((country) => country.name)
              ).bestMatch.target
            }? Please input again.`
          );
        }
        return tz.some((country) => country.name == content);
      })
    ).content;

    newUser.tzOffset = tz.find(
      async (country) => country.name == userCountry
    ).offset;

    await newUser.save();

    await msg.channel.send('Register completed!');
  }
});
