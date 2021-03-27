const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "issue_tracker",
  password: "postgres",
  port: 5432
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/issues", (req, res) => {
  const { label, status, priority } = req.body;

  pool.query(
    "INSERT INTO issues (label, status, priority) VALUES ($1, $2, $3)",
    [label, status, priority],
    (error, results) => {
      if (error) {
        throw error;
      }

      res.sendStatus(201);
    }
  );
});

app.get("/issues", (req, res) => {
  pool.query(
    "SELECT id, label, status, priority FROM issues",
    [],
    (error, results) => {
      if (error) {
        throw error;
      }

      res.status(200).json(results.rows);
    }
  );
});

app.get("/issues/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "SELECT id, label, status, priority FROM issues WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }

      res.status(200).json(results.rows);
    }
  );
});

app.put("/issues/:id", (req, res) => {
  const { id } = req.params;
  const { label, status, priority } = req.body;

  pool.query(
    "UPDATE issues SET label = $1, status = $2, priority = $3 WHERE id = $4",
    [label, status, priority, id],
    (error, results) => {
      if (error) {
        throw error;
      }

      res.sendStatus(200);
    }
  );
});

app.delete("/issues/:id", (req, res) => {
  const { id } = req.params;

  pool.query("DELETE FROM issues WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }

    res.sendStatus(200);
  });
});

app.listen(8000, () => {
  console.log(`Server is running.`);
});