// backend/server.js
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database("./db/database.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the SQLite database.");
});

const tableColumns = process.env.TABLE_COLUMNS.split(',').map(col => col.trim());
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS connections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ${tableColumns + ' TEXT'}, selected TEXT,
    UNIQUE(selected)
  )
`;

db.run(createTableQuery, (err) => {
  if (err) console.error(err);
});

app.get("/api/data", (req, res) => {
  db.all("SELECT * FROM connections", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Endpoint to add a new record
app.post('/api/data', (req, res) => {
  // Check if there are existing records
  db.get(`SELECT COUNT(*) AS count FROM connections`, [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const isFirstEntry = row.count === 0; // Check if it's the first entry
    const values = Object.values(req.body).map(value => `'${value}'`).join(', ');
    const selectedValue = isFirstEntry ? "'YES'" : "NULL"; // Set selected to YES for the first entry
    const insertQuery = `INSERT INTO connections (${tableColumns.join(', ')}, selected) VALUES (${values}, ${selectedValue})`;
    db.run(insertQuery, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    });
  });
});

// New route for deleting data by ID
app.delete("/api/data/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM connections WHERE id = ?", id, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(204).send(); // No Content
  });
});

app.put('/api/data/select/:id', (req, res) => {
  const id = req.params.id;

  db.serialize(() => {
    db.run(`UPDATE connections SET selected = NULL`, [], function (err) {
      if (err) return res.status(500).json({ error: err.message });
    });

    db.run(`UPDATE connections SET selected = 'YES' WHERE id = ?`, id, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.send();
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
