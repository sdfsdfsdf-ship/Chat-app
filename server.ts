import { createServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import next from "next";

// Extend Node.js Socket type to store io instance
declare module "net" {
  interface Socket {
    server: {
      io?: SocketIOServer;
    };
  }
}

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Middleware for Vercel
const socketIOMiddleware = async (req: NextApiRequest, res: NextApiResponse) => {
  // Only initialize once
  if (!res.socket?.server.io) {
    const httpServer = createServer((req, res) => handle(req, res));
    const io = new SocketIOServer(httpServer, {
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

    if(res.socket) res.socket.server.io = io;
  }

  res.end();
};

// Dev-only server
if (dev) {
  app.prepare().then(() => {
    const httpServer = createServer((req, res) => handle(req, res));
    const io = new SocketIOServer(httpServer, {
      cors: { origin: "*" },
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

    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () =>
      console.log(`🚀 Dev server running on http://localhost:${PORT}`)
    );
  });
}

export default socketIOMiddleware;
