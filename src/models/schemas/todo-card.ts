import { Schema, Document } from 'mongoose';
import { CardDifficulty } from '../enums/card-difficulty';

export const todoCardSchema: Schema = new Schema({
  name: String,
  description: String,
  difficulty: {
    type: String,
    enum: Object.keys(CardDifficulty)
  },
  checklist: [
    {
      name: String,
      checked: Boolean
    }
  ],
  dueDate: Date,
  importance: {
    type: Number,
    default: 1
  },
  tags: [String]
});

export class ITodoCard extends Document {
  name: string;
  description: string;
  difficulty: CardDifficulty;
  checklist: Array<{
    name: string;
    checked: boolean;
  }>;
  dueDate: Date;
  importance: Number;
  tags: Array<string>;
}
