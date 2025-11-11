import express from "express";
import tasksRouter from "./routes/tasks";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/tasks", tasksRouter);

app.get("/", (req, res) => {
  res.send("Serveris running on port 3000");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
