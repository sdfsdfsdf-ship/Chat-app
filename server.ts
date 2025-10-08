import type { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";

// Extend Node.js Socket type to store io instance
declare module "net" {
  interface Socket {
    server: {
      io?: IOServer;
    };
  }
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  // Only initialize once
  if (!res.socket?.server.io) {
    const io = new IOServer(res.socket.server as any, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "*",
        methods: ["GET", "POST"],
      },
      path: "/api/socket/io",
    });

    io.on("connection", (socket) => {
      console.log("🟢 New client connected:", socket.id);

      socket.on("message", (msg: string) => {
        io.emit("message", msg);
      });

      socket.on("disconnect", () => {
        console.log("🔴 Client disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default SocketHandler;
