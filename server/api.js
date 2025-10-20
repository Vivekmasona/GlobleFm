import express from "express";
import path from "path";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Serve static client files
const rootDir = path.resolve(__dirname, "../client");
app.use(express.static(rootDir));
app.get("/", (req, res) => res.sendFile(path.join(rootDir, "listener.html")));
app.get("/control", (req, res) => res.sendFile(path.join(rootDir, "control.html")));

const clients = new Map();
// (Simplified) Keep track of broadcaster and listeners if needed
let broadcaster = null;

wss.on("connection", (ws) => {
  const id = crypto.randomUUID();
  clients.set(id, ws);
  console.log("Connected:", id);

  ws.on("message", (data) => {
    let msg;
    try {
      msg = JSON.parse(data);
    } catch (e) {
      console.error("Invalid JSON", e);
      return;
    }
    const { type, role, target, payload } = msg;

    if (type === "register") {
      if (role === "broadcaster") broadcaster = id;
      console.log(`${id} registered as ${role}`);
      return;
    }

    // Forward signalling messages
    if (["offer","answer","candidate"].includes(type) && target) {
      const tgt = clients.get(target);
      if (tgt && tgt.readyState === WebSocket.OPEN) {
        tgt.send(JSON.stringify({ type, from: id, payload }));
      }
    }
  });

  ws.on("close", () => {
    clients.delete(id);
    console.log("Disconnected:", id);
    if (id === broadcaster) broadcaster = null;
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
