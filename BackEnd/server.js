const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQLite database.');
});

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY, name TEXT, description TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, name TEXT, description TEXT, points INTEGER, date TEXT, projectId INTEGER, state TEXT, FOREIGN KEY(projectId) REFERENCES projects(id))');

  
    // // Insert initial data (Optional)
    // const stmt = db.prepare('INSERT INTO projects (name, description) VALUES (?, ?)');
    // stmt.run('KanBan Board', 'Hexisware kanban board for tasking and tracking');
    // stmt.run('Placeholder', 'Placeholder');
    // stmt.finalize();
  });

  app.get('/projects', (req, res) => {
    db.all('SELECT * FROM projects', [], (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

  app.post('/projects', (req, res) => {
    const { name, description } = req.body;
    db.run(`INSERT INTO projects (name, description) VALUES (?, ?)`, [name, description], function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    });
  });

  app.post('/projects/:projectId/tasks', (req, res) => {
    const { name, description, points, date, state } = req.body;
    const projectId = req.params.projectId;
  
    db.run(`INSERT INTO tasks (name, description, points, date, projectId, state) VALUES (?, ?, ?, ?, ?, ?)`, [name, description, points, date, projectId, state], function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ taskId: this.lastID });
    });
  });

  app.get('/projects/:projectId/tasks', (req, res) => {
    const projectId = req.params.projectId;
  
    db.all('SELECT * FROM tasks WHERE projectId = ?', [projectId], (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });
  
  

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
