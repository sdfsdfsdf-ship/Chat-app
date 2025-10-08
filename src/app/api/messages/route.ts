import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message, { IMessage } from "@/models/Message";

// GET /api/messages
export async function GET() {
  await connectDB();

  const messages: IMessage[] = await Message.find().sort({ createdAt: 1 });
  return NextResponse.json(messages);
}

// POST /api/messages
export async function POST(req: Request) {
  await connectDB();

  // Define the expected body type
  type Body = {
    text: string;
    sender: string;
  };

  const body: Body = await req.json();

  // Optional: validate body
  if (!body.text || !body.sender) {
    return NextResponse.json({ error: "Missing text or sender" }, { status: 400 });
  }

  const newMsg: IMessage = await Message.create({
    text: body.text,
    sender: body.sender,
  });

  return NextResponse.json(newMsg, { status: 201 });
}
