import mongoose, { Schema, model, models } from "mongoose";

const messageSchema = new Schema(
  {
    text: { type: String, required: true },
    sender: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Message = models.Message || model("Message", messageSchema);
export default Message;
