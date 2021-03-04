import { Document, Schema } from 'mongoose';
import { CardDifficulty } from '../enums/card-difficulty';
import { StreakResetInterval } from '../enums/streak-reset-interval';

export const habitCardSchema: Schema = new Schema({
  name: String,
  description: String,
  difficulty: {
    type: String,
    enum: Object.keys(CardDifficulty),
    default: CardDifficulty.Easy
  },
  positive: {
    type: Boolean,
    default: true
  },
  negative: {
    type: Boolean,
    default: false
  },
  importance: {
    type: Number,
    default: 3
  },
  positiveStreak: {
    type: Number,
    default: 0
  },
  negativeStreak: {
    type: Number,
    default: 0
  },
  streakReset: {
    type: String,
    enum: Object.keys(StreakResetInterval),
    default: StreakResetInterval.Daily
  },
  tags: {
    type: [String],
    default: []
  }
});

export class IHabitCard extends Document {
  name: string;
  description: string;
  difficulty: CardDifficulty;
  positive: boolean;
  negative: boolean;
  importance: number;
  positiveStreak: number;
  negativeStreak: number;
  streakReset: StreakResetInterval;
  tags: Array<string>;
}