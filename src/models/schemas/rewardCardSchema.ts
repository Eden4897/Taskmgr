import { Schema, Document } from 'mongoose';

export const rewardCardSchema = new Schema({
  name: String,
  description: String,
  cost: {
    type: Number,
    default: 1
  }
});

export class IRewardCard extends Document {
  name: string;
  description: string;
  cost: number;
}
