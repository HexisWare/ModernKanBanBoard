const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());

const dbPath = path.join(__dirname, '..', 'Database', 'projecttasking.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database at ' + dbPath);
});

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY, name TEXT, description TEXT, boardType TEXT DEFAULT \'project\', priority INTEGER DEFAULT 0, sortOrder INTEGER DEFAULT 0, ideas TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, name TEXT, description TEXT, points INTEGER, date TEXT, doneDate TEXT, priority INTEGER DEFAULT 0, projectId INTEGER, state TEXT, FOREIGN KEY(projectId) REFERENCES projects(id))');
    db.run('CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY, taskId INTEGER, text TEXT, createdAt TEXT, FOREIGN KEY(taskId) REFERENCES tasks(id) ON DELETE CASCADE)');

    // Migrate existing tables: add missing columns
    db.all("PRAGMA table_info(projects)", [], (err, rows) => {
      if (err) return;
      const cols = rows.map(r => r.name);
      if (!cols.includes('boardType')) {
        db.run("ALTER TABLE projects ADD COLUMN boardType TEXT DEFAULT 'project'");
      }
      if (!cols.includes('priority')) {
        db.run('ALTER TABLE projects ADD COLUMN priority INTEGER DEFAULT 0');
      }
      if (!cols.includes('sortOrder')) {
        db.run('ALTER TABLE projects ADD COLUMN sortOrder INTEGER DEFAULT 0');
      }
      if (!cols.includes('ideas')) {
        db.run('ALTER TABLE projects ADD COLUMN ideas TEXT');
      }
    });

    db.all("PRAGMA table_info(tasks)", [], (err, rows) => {
      if (err) return;
      const cols = rows.map(r => r.name);
      if (!cols.includes('doneDate')) {
        db.run('ALTER TABLE tasks ADD COLUMN doneDate TEXT');
      }
      if (!cols.includes('priority')) {
        db.run('ALTER TABLE tasks ADD COLUMN priority INTEGER DEFAULT 0');
      }
    });
  });

  app.get('/projects', (req, res) => {
    db.all('SELECT * FROM projects ORDER BY sortOrder ASC, priority DESC, id ASC', [], (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

  app.post('/projects', (req, res) => {
    const { name, description, boardType, priority } = req.body;
    const bType = boardType || 'project';
    const prio = priority || 0;
    db.get('SELECT MAX(sortOrder) as maxOrder FROM projects', [], (err, row) => {
      const nextOrder = (row && row.maxOrder != null) ? row.maxOrder + 1 : 0;
      db.run(
        `INSERT INTO projects (name, description, boardType, priority, sortOrder) VALUES (?, ?, ?, ?, ?)`,
        [name, description, bType, prio, nextOrder],
        function (err) {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.json({ id: this.lastID });
        }
      );
    });
  });

  app.patch('/projects/:id/priority', (req, res) => {
    const projectId = req.params.id;
    const newPriority = req.body.priority;
    db.run('UPDATE projects SET priority = ? WHERE id = ?', [newPriority, projectId], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Project not found' });
      res.json({ message: 'Priority updated', id: projectId, priority: newPriority });
    });
  });

  app.patch('/projects/reorder', (req, res) => {
    const orderedIds = req.body.orderedIds;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds array is required' });
    }
    const stmt = db.prepare('UPDATE projects SET sortOrder = ? WHERE id = ?');
    orderedIds.forEach((id, index) => {
      stmt.run(index, id);
    });
    stmt.finalize();
    res.json({ message: 'Order updated successfully' });
  });

  app.get('/projects/:id', (req, res) => {
    db.get('SELECT * FROM projects WHERE id = ?', [req.params.id], (err, row) => {
      if (err) return res.status(400).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Project not found' });
      res.json(row);
    });
  });

  app.patch('/projects/:id/ideas', (req, res) => {
    const projectId = req.params.id;
    const { ideas } = req.body;
    if (ideas === undefined || ideas === null) {
      return res.status(400).json({ error: 'ideas field is required' });
    }
    db.run('UPDATE projects SET ideas = ? WHERE id = ?', [ideas, projectId], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Project not found' });
      res.json({ message: 'Ideas updated', id: projectId, ideas });
    });
  });

  app.post('/projects/:projectId/tasks', (req, res) => {
    const { name, description, points, date, state, priority } = req.body;
    const projectId = req.params.projectId;
    let doneDate = null;
    if (state === 'done' || state === 'uploaded') {
      doneDate = new Date().toISOString().split('T')[0];
    }
  
    db.run(`INSERT INTO tasks (name, description, points, date, doneDate, priority, projectId, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [name, description, points, date, doneDate, priority || 0, projectId, state], function (err) {
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

  app.post('/projects/:projectId/tasks/bulk', (req, res) => {
    const projectId = req.params.projectId;
    const taskList = req.body.tasks;
    if (!Array.isArray(taskList)) {
      return res.status(400).json({ error: 'tasks array is required' });
    }

    let inserted = 0;
    let errors = [];
    let pending = taskList.length;

    if (pending === 0) {
      return res.json({ message: 'Bulk import complete', inserted: 0, errors: [] });
    }

    taskList.forEach((t, idx) => {
      const name = t.name || 'Untitled';
      const description = t.description || '';
      const points = t.points || 0;
      const date = t.date || new Date().toISOString().split('T')[0];
      const state = t.state || 'backlog';
      const priority = t.priority || 0;
      let doneDate = null;
      if (state === 'done' || state === 'uploaded') {
        doneDate = t.doneDate || new Date().toISOString().split('T')[0];
      }

      db.run(
        `INSERT INTO tasks (name, description, points, date, doneDate, priority, projectId, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, description, points, date, doneDate, priority, projectId, state],
        function (err) {
          if (err) {
            errors.push({ index: idx, error: err.message });
          } else {
            inserted++;
            const taskId = this.lastID;
            if (Array.isArray(t.comments) && t.comments.length > 0) {
              const commentStmt = db.prepare(`INSERT INTO comments (taskId, text, createdAt) VALUES (?, ?, ?)`);
              t.comments.forEach((c) => {
                const text = (typeof c === 'string') ? c : (c.text || '');
                const createdAt = (typeof c === 'object' && c.createdAt) ? c.createdAt : new Date().toISOString();
                if (text.trim()) {
                  commentStmt.run(taskId, text.trim(), createdAt);
                }
              });
              commentStmt.finalize();
            }
          }
          pending--;
          if (pending === 0) {
            res.json({ message: 'Bulk import complete', inserted, errors });
          }
        }
      );
    });
  });

  app.patch('/tasks/:taskId/state', (req, res) => {
    const taskId = req.params.taskId;
    const newState = req.body.state;

    if (!newState) {
        return res.status(400).json({ error: "New state is required" });
    }

    const doneStates = ['done', 'uploaded'];
    let doneDate = null;
    if (doneStates.includes(newState)) {
      doneDate = new Date().toISOString().split('T')[0];
    }

    const sql = doneDate !== null
      ? `UPDATE tasks SET state = ?, doneDate = ? WHERE id = ?`
      : `UPDATE tasks SET state = ?, doneDate = NULL WHERE id = ?`;

    const params = doneDate !== null ? [newState, doneDate, taskId] : [newState, taskId];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({ message: "Task state updated successfully", taskId: taskId, newState: newState, doneDate: doneDate });
    });
});

  app.patch('/tasks/:taskId/priority', (req, res) => {
    const taskId = req.params.taskId;
    const newPriority = req.body.priority;

    if (newPriority === undefined || newPriority === null) {
      return res.status(400).json({ error: 'Priority is required' });
    }

    db.run('UPDATE tasks SET priority = ? WHERE id = ?', [newPriority, taskId], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task priority updated', taskId: taskId, priority: newPriority });
    });
  });

  app.delete('/tasks/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    db.run('DELETE FROM comments WHERE taskId = ?', [taskId], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      db.run('DELETE FROM tasks WHERE id = ?', [taskId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted', taskId: taskId });
      });
    });
  });

  app.get('/tasks/:taskId/comments', (req, res) => {
    const taskId = req.params.taskId;
    db.all('SELECT * FROM comments WHERE taskId = ? ORDER BY createdAt ASC', [taskId], (err, rows) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(rows);
    });
  });

  app.post('/tasks/:taskId/comments', (req, res) => {
    const taskId = req.params.taskId;
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required' });
    }
    const createdAt = new Date().toISOString();
    db.run('INSERT INTO comments (taskId, text, createdAt) VALUES (?, ?, ?)', [taskId, text.trim(), createdAt], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ commentId: this.lastID, taskId, text: text.trim(), createdAt });
    });
  });

  app.delete('/comments/:commentId', (req, res) => {
    const commentId = req.params.commentId;
    db.run('DELETE FROM comments WHERE id = ?', [commentId], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Comment not found' });
      res.json({ message: 'Comment deleted', commentId });
    });
  });

// --- Report ---

  app.get('/report/:year', (req, res) => {
    const year = parseInt(req.params.year);
    const doneStates = ['done', 'uploaded'];
    const placeholders = doneStates.map(() => '?').join(',');
    const sql = `
      SELECT t.id as taskId, t.name as taskName, t.description, t.points, t.date, t.doneDate, t.state,
             p.id as projectId, p.name as projectName, p.boardType
      FROM tasks t
      JOIN projects p ON t.projectId = p.id
      WHERE t.state IN (${placeholders})
        AND t.doneDate IS NOT NULL
        AND substr(t.doneDate, 1, 4) = ?
      ORDER BY p.sortOrder ASC, p.priority DESC, p.id ASC, t.doneDate ASC
    `;
    db.all(sql, [...doneStates, String(year)], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      const byProject = {};
      rows.forEach(row => {
        if (!byProject[row.projectId]) {
          byProject[row.projectId] = {
            projectId: row.projectId,
            projectName: row.projectName,
            boardType: row.boardType,
            tasks: []
          };
        }
        byProject[row.projectId].tasks.push({
          id: row.taskId,
          name: row.taskName,
          description: row.description,
          points: row.points,
          date: row.date,
          doneDate: row.doneDate,
          state: row.state
        });
      });
      res.json(Object.values(byProject));
    });
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
