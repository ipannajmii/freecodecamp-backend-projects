import http from "http";
import fs from "fs";
import { WebSocket, WebSocketServer } from "ws";

const PORT = 3001;

const server = http.createServer((req, res) => {
  fs.readFile("./public/index.html", (error, data) => {
    if (error) {
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });

      res.end("Unable to load the chat application.");
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

function broadcast(payload) {
  const message = JSON.stringify(payload);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

wss.on("connection", (socket, req) => {
  const username = new URL(req.url, "http://localhost").searchParams.get(
    "username",
  );

  broadcast({
    type: "system",
    text: `${username} joined`,
  });

  socket.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());

      broadcast({
        type: "chat",
        username: message.username,
        text: message.text,
      });
    } catch (error) {
      console.error("Invalid chat message:", error.message);
    }
  });

  socket.on("close", () => {
    broadcast({
      type: "system",
      text: `${username} left`,
    });
  });
});

server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:3001`);
});