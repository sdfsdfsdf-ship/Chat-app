import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // ✅ Directly connect to server
export default socket;
