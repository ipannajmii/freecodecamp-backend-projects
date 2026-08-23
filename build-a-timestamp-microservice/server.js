import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const WEB_PORT = 3000;
const TEST_PORT = 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

function handleTimestampRequest(req, res) {
  const dateInput = req.params.date;

  let date;

  // An empty date parameter returns the current time.
  if (dateInput === undefined || dateInput === "") {
    date = new Date();
  }
  // A numeric parameter represents a Unix timestamp in milliseconds.
  else if (/^-?\d+$/.test(dateInput)) {
    date = new Date(Number(dateInput));
  }
  // Other values are parsed as date strings.
  else {
    date = new Date(dateInput);
  }

  // Reject invalid dates.
  if (Number.isNaN(date.getTime())) {
    return res.json({
      error: "Invalid Date",
    });
  }

  return res.json({
    unix: date.getTime(),
    utc: date.toUTCString(),
  });
}

/*
 * Express 5 does not support the old "/api/:date?" syntax.
 * Define the empty and parameter routes separately.
 */
app.get("/api", handleTimestampRequest);
app.get("/api/:date", handleTimestampRequest);

// Port 3000 is used for the web preview.
app.listen(WEB_PORT, () => {
  console.log(
    `Timestamp web running at http://localhost:${WEB_PORT}`,
  );
});

// The current freeCodeCamp tests connect to port 8000.
app.listen(TEST_PORT, () => {
  console.log(
    `Timestamp tests running at http://localhost:${TEST_PORT}`,
  );
});

export default app;