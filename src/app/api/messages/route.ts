import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";

export async function GET() {
  await connectDB();
  const messages = await Message.find().sort({ createdAt: 1 });
  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  await connectDB();
  const { text, sender } = await req.json();``
  const newMsg = await Message.create({ text, sender });
  return NextResponse.json(newMsg, { status: 201 });
}
