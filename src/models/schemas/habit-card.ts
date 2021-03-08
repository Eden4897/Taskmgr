import { Document, Schema } from 'mongoose';
import { enumKeys } from '../../util/enum';
import { CardDifficulty } from '../enums/card-difficulty';
import { StreakResetInterval } from '../enums/streak-reset-interval';

export const habitCardSchema: Schema = new Schema({
  name: String,
  description: String,
  difficulty: {
    type: String,
    enum: enumKeys(CardDifficulty),
    default: CardDifficulty[CardDifficulty.Easy]
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
    enum: enumKeys(StreakResetInterval),
    default: StreakResetInterval[StreakResetInterval.Daily]
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
