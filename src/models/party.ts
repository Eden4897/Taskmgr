import { Schema, model, Document } from 'mongoose';

export class IBoss {
  name: String;
  health: Number;
  maxHealth: Number;
  reward: {
    xp: Number;
    coins: Number;
  };
}

export class IMessage {
  message: string;
  author: string;
}

const partySchema: Schema = new Schema({
  id: String,
  members: [String],
  boss: IBoss,
  messages: [IMessage],
});

export interface IParty extends Document {
  id: string;
  members: Array<string>;
  boss?: IBoss;
  messages: Array<IMessage>;
}

export default model(`Party`, partySchema, `parties`);
