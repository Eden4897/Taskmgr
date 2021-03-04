const raw: { [key: string]: string } = require(`../emojis.json`);

const emojis = JSON.parse(JSON.stringify(raw));

import { bot } from '..';

// Can be used in Message#react()
export function emojiReactable(key: string){
  return raw[key];
}
// Can be used in strings
export function emojiLiteral(key: string){
  return emojis[key];
}

bot.on('ready', async () => {
  await new Promise(_ => setTimeout(_, 1000))
  Object.keys(emojis).map((emojiKey) => {
    emojis[emojiKey] = getEmoji(emojis[emojiKey]);
  });
})

function getEmoji(emoji: string): string {
  return isNaN(+emoji)
    ? emoji
    : bot.emojis.cache.get(emoji).toString();
}
