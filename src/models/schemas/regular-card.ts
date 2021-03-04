import { Document, Schema } from 'mongoose';
import { CardDifficulty } from '../enums/card-difficulty';
import { RegularRepeatInterval } from '../enums/regular-repeat-interval';

export const regularCardSchema = new Schema({
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
  repeatMode: {
    type: String,
    enum: Object.keys(RegularRepeatInterval)
  },
  repeatInterval: Number,
  repeatedDayOfWeeks: {
    Mon: Boolean,
    Tue: Boolean,
    Wed: Boolean,
    Thu: Boolean,
    Fri: Boolean,
    Sat: Boolean,
    Sun: Boolean
  },
  streak: {
    type: Number,
    default: 0
  },
  importance: {
    type: Number,
    default: 0
  },
  tags: {
    type: [String],
    default: []
  }
});

export class IRegularCard extends Document {
  name: string;
  description: string;
  difficulty: CardDifficulty;
  checklist: Array<{
    name: string;
    checked: Boolean;
  }>;
  repeatMode: RegularRepeatInterval;
  repeatInterval: number;
  repeatedDayOfWeeks: {
    Mon: boolean;
    Tue: boolean;
    Wed: boolean;
    Thu: boolean;
    Fri: boolean;
    Sat: boolean;
    Sun: boolean;
  } = {
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: true,
    Sun: true
  };
  streak: number;
  importance: number;
  tags: Array<string>;
}
