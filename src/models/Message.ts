import mongoose, { Schema, model, Document } from "mongoose";

export interface IMessage extends Document {
  text: string;
  sender: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  text: { type: String, required: true },
  sender: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Message || model<IMessage>("Message", messageSchema);
