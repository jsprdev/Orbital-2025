const express = require("express");
const cors = require("cors");
const middleware = require("./config/middleware");

const app = express();
const port = 3000;

app.use(cors());

app.use(middleware.handleRequest);

app.get("/api/task", (req, res) => {
  console.log(req.user);
  return res.json({
    task: [
      {
        name: "Task 1",
        description: "Description for Tool 1",
        url: "https://example.com/tool1",
      },
      {
        name: "Task 2",
        description: "Description for Tool 2",
        url: "https://example.com/tool2",
      },
    ],
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Export the app for testing purposes
module.exports = app;

// Export the port for testing purposes
module.exports.port = port;

// Export the express module for testing purposes
module.exports.express = express;
