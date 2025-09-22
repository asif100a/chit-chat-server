import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Create socket.io server
const io = new Server(server, {
  cors: {
    origin: "*", // allow any frontend origin for testing
    methods: ["GET", "POST"],
  },
});

// Store online users: userId -> socket.id
const users: Record<string, string> = {};
console.log("Users: ", users);

// Handle socket connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Register user with userId
  socket.on("register", (userId) => {
    users[userId] = socket.id;
    console.log(`User ${userId} registered with socket ${socket.id}`);
    // Optional: Notify others of online status
    socket.broadcast.emit("userOnline", userId);
  });

  socket.on("privateMessage", ({ senderId, receiverId, text }) => {
    const receiverSocket = users[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit("privateMessage", {
        senderId,
        text,
        time: Date.now(),
      });
      console.log(`Private message from ${senderId} to ${receiverId}: ${text}`);
    } else {
      console.log(`Receiver ${receiverId} not online`);
    }
  });

  // Listen fo the private images
  socket.on("sendImage", ({ senderId, receiverId, image }) => {
    const receiverSocket = users[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit("receiverImage", {
        senderId,
        image,
        time: Date.now(),
      });
      console.log(`Private image sent from ${senderId} to ${receiverId}`);
    } else {
      console.log(`Receiver ${receiverId} not online for image`);
    }
  });

  // Legacy general chat (if needed)
  socket.on("chatMessage", (msg) => {
    console.log("Message received:", msg);

    // Broadcast message to everyone (including sender)
    io.emit("chatMessage", { id: socket.id, text: msg });
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const [userId, sId] of Object.entries(users)) {
      if (sId === socket.id) {
        delete users[userId];
        // Optional: Notify others
        socket.broadcast.emit("userOffline", userId);
        break;
      }
    }
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
