import { Client, Message, MessageEmbed } from 'discord.js';
import { Command } from '..';
import User, { IUser } from '../models/user';

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
      return msg.channel.send(
        `You have already registered!`
      );
    }

    const newUser = new User({
      id: msg.author.id,
      health: 50,
      maxHealth: 50,
      inventory: [],
      lists: {
        habits: [],
        regulars: [],
        todos: [],
        rewards: []
      },
      xp: 0,
      party: null
    } as IUser);

    await newUser.save();

    await msg.channel.send('Register completed!');
  },
});