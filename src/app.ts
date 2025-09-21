import express, { type Application, type Request, type Response } from "express";
import { Server } from "socket.io";
import http from "http";
import { User } from "./app/models/users.model";

const app: Application = express();
const server = http.createServer(app);

// app.post("/create-users", async (req, res) => {
//   const users = [
//     {
//       id: 1,
//       firstName: "John",
//       lastName: "Doe",
//       email: "john.doe@example.com",
//       age: 28,
//       city: "New York",
//       active: true,
//       lastLogin: "2025-09-20T14:30:00Z",
//     },
//     {
//       id: 2,
//       firstName: "Jane",
//       lastName: "Smith",
//       email: "jane.smith@example.com",
//       age: 34,
//       city: "Los Angeles",
//       active: false,
//       lastLogin: "2025-09-19T09:15:00Z",
//     },
//     {
//       id: 3,
//       firstName: "Michael",
//       lastName: "Chen",
//       email: "michael.chen@example.com",
//       age: 45,
//       city: "Chicago",
//       active: true,
//       lastLogin: "2025-09-21T08:45:00Z",
//     },
//     {
//       id: 4,
//       firstName: "Emily",
//       lastName: "Davis",
//       email: "emily.davis@example.com",
//       age: 19,
//       city: "Houston",
//       active: true,
//       lastLogin: "2025-09-18T17:20:00Z",
//     },
//   ];

//   try {
//     const result = await User.insertMany(users);

//     res.status(201).json({
//       message: "users created successfully",
//       users: result,
//     });
//   } catch (error) {
//     res.status(500).json({
//         message: "User creation failed",
//         data: error
//     });
//   }
// });

app.get('/users', async(req: Request, res: Response) => {
    try {
    const users = await User.find();

    res.status(200).json({
      message: "users retrieved successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
        message: "User retrieved failed",
        data: error
    });
  }
})

// Create socket.io server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Handle Socket connection
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Listen for messages
  socket.on("chatMessage", (msg) => {
    console.log("Message received: ", msg);

    // Broadcast message to everyone
    io.emit("chatMessage", { id: socket.id, text: msg });
  });

  // Disconnect message
  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

export default app;
