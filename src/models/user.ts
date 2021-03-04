import { Schema, model, Document } from 'mongoose';
import { habitCardSchema, IHabitCard } from './schemas/habit-card';
import { IRegularCard, regularCardSchema } from './schemas/regular-card';
import { IRewardCard, rewardCardSchema } from './schemas/rewardCardSchema';
import { ITodoCard, todoCardSchema } from './schemas/todo-card';

const userSchema: Schema = new Schema(
  {
    id: Number,
    health: Number,
    maxHealth: Number,
    inventory: [
      {
        id: String,
        amount: Number,
      },
    ],
    lists: {
      habits: [habitCardSchema],
      regulars: [regularCardSchema],
      todos: [todoCardSchema],
      rewards: [rewardCardSchema],
    },
    xp: Number,
    party: String,
  },
  {
    timestamps: true,
  }
);

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

  createdAt: Date;
}

export default model(`User`, userSchema, `users`);
