import { Schema, model, Document } from 'mongoose';
import { habitCardSchema, IHabitCard } from './schemas/habit-card';
import { IRegularCard, regularCardSchema } from './schemas/regular-card';
import { IRewardCard, rewardCardSchema } from './schemas/rewardCardSchema';
import { ITodoCard, todoCardSchema } from './schemas/todo-card';

const userSchema: Schema = new Schema({
  id: Number,
  health: {
    type: Number,
    default: 50
  },
  maxHealth: {
    type: Number,
    default: 50
  },
  inventory: {
    type: [
      {
        id: String,
        amount: Number
      }
    ],
    default: []
  },
  lists: {
    habits: {
      type: [habitCardSchema],
      default: []
    },
    regulars: {
      type: [regularCardSchema],
      default: []
    },
    todos: {
      type: [todoCardSchema],
      default: []
    },
    rewards: {
      type: [rewardCardSchema],
      default: []
    }
  },
  xp: {
    type: Number,
    default: null
  },
  party: {
    type: String,
    default: null
  },
  tzOffset: Number
});

export interface IUser extends Document {
  id: string;
  health: number;
  maxHealth: number;
  inventory: Array<{
    id: string;
    amount: number;
  }>;
  lists: {
    habits: Array<IHabitCard>;
    regulars: Array<IRegularCard>;
    todos: Array<ITodoCard>;
    rewards: Array<IRewardCard>;
  };
  xp: number;
  party?: string;
  tzOffset: number;
}

export default model(`User`, userSchema, `users`);
