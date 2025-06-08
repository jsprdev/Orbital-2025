const express = require("express");
const cors = require("cors");
const verifyToken = require("./config/middleware/verifyToken");
const { firestoreFunctions } = require("./config/firestoreFunctions");

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());


app.get("/api/task", verifyToken, async (req, res) => {
  try { 
    const tasks = await firestoreFunctions.getTasks(req.user.uid);
    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/api/task", verifyToken, async (req, res) => {
  try {
    const newTask = await firestoreFunctions.addTask(req.body, req.user.uid);
    res.status(201).json({ task: newTask });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete("/api/task/:id", verifyToken, async (req, res) => {
  try {
    await firestoreFunctions.deleteTask(req.params.id, req.user.uid);
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(403).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// CI/CD pipeline configuration
// Exporting the app, port and express for testing purposes
module.exports = { app, port, express };