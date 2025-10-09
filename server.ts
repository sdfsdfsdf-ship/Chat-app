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
  const socketServer = res.socket?.server;
  if (!socketServer) {
    // socket is null, just end response
    return res.end();
  }

  if (!socketServer.io) {
    const io = new IOServer(socketServer as any, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "*",
        methods: ["GET", "POST"],
        credentials: true
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

    socketServer.io = io;
  }

  res.end();
};

export default SocketHandler;
