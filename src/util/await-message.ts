import {
  Collection,
  DMChannel,
  Message,
  NewsChannel,
  TextChannel,
  User
} from 'discord.js';
import { ArgumentType, testArgument } from '..';

export default async function awaitMessage(
  channel: TextChannel | DMChannel | NewsChannel,
  user?: User,
  filter: (
    value: Message
  ) => boolean | ArgumentType | Promise<boolean | ArgumentType> = () => true,
  timeout: number = 300000
): Promise<Message> {
  try {
    const result: Collection<
      string,
      Message
    > = await channel.awaitMessages(async (m) =>
      user?.id == m.author.id && 
      (typeof filter == `function`
        ? ((await filter) as (value: Message) => boolean)(m)
        : testArgument(filter as ArgumentType, m.content)),
      { max: 1, time: timeout }
    );
    return result.first();
  } catch (e) {
    throw new Error(e);
  }
}