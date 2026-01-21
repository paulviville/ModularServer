import { WebSocketServer } from "ws";

const PORT = 3000;

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("Received:", message.toString());

    // Echo back
    ws.send(`Server received: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);