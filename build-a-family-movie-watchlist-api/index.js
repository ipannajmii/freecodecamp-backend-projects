import express from "express";
import helmet from "helmet";

import authRoutes from "./routes/auth.js";
import watchlistRoutes from "./routes/watchlist.js";

const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Family Movie Watchlist API");
});

app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});

export default app;