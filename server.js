// ========================================
// Node.js Server - Anoud Saud Website
// Save as: server.js
// Run with: node server.js
// ========================================

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '.')));

// Initialize SQLite Database
const db = new sqlite3.Database('./website.db', (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database');
        createTables();
    }
});

// Create tables
function createTables() {
    // Posts table
    db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        likes INTEGER DEFAULT 0
    )`);
    
    // Messages table
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        message TEXT NOT NULL,
        date TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        likes INTEGER DEFAULT 0
    )`);
    
    // Likes table (to track who liked what)
    db.run(`CREATE TABLE IF NOT EXISTS likes (
        user_id TEXT NOT NULL,
        item_type TEXT NOT NULL,
        item_id INTEGER NOT NULL,
        PRIMARY KEY (user_id, item_type, item_id)
    )`);
}

// ========================================
// Posts API Routes
// ========================================

// Get all posts
app.get('/api/posts', (req, res) => {
    const query = `
        SELECT p.*, 
               (SELECT COUNT(*) FROM likes WHERE item_type = 'post' AND item_id = p.id AND user_id = ?) as user_liked
        FROM posts p
        ORDER BY p.timestamp DESC
    `;
    
    const userId = req.query.userId || 'anonymous';
    
    db.all(query, [userId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Add new post
app.post('/api/posts', (req, res) => {
    const { id, type, content, date, likes = 0 } = req.body;
    
    const query = `INSERT INTO posts (id, type, content, date, likes) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(query, [id, type, content, date, likes], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, id: this.lastID });
    });
});

// Delete post
app.delete('/api/posts/:id', (req, res) => {
    const query = `DELETE FROM posts WHERE id = ?`;
    
    db.run(query, [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, deleted: this.changes });
    });
});

// Like/Unlike post
app.post('/api/posts/:id/like', (req, res) => {
    const { userId, action } = req.body;
    const postId = req.params.id;
    
    if (action === 'like') {
        // Add like
        const checkQuery = `SELECT * FROM likes WHERE user_id = ? AND item_type = 'post' AND item_id = ?`;
        db.get(checkQuery, [userId, postId], (err, row) => {
            if (!row) {
                const insertLike = `INSERT INTO likes (user_id, item_type, item_id) VALUES (?, ?, ?)`;
                db.run(insertLike, [userId, 'post', postId], (err) => {
                    if (!err) {
                        const updatePost = `UPDATE posts SET likes = likes + 1 WHERE id = ?`;
                        db.run(updatePost, [postId]);
                    }
                });
            }
        });
    } else {
        // Remove like
        const deleteLike = `DELETE FROM likes WHERE user_id = ? AND item_type = 'post' AND item_id = ?`;
        db.run(deleteLike, [userId, 'post', postId], (err) => {
            if (!err) {
                const updatePost = `UPDATE posts SET likes = likes - 1 WHERE id = ?`;
                db.run(updatePost, [postId]);
            }
        });
    }
    
    res.json({ success: true });
});

// ========================================
// Messages API Routes
// ========================================

// Get all messages
app.get('/api/messages', (req, res) => {
    const query = `
        SELECT m.*,
               (SELECT COUNT(*) FROM likes WHERE item_type = 'message' AND item_id = m.id AND user_id = ?) as user_liked
        FROM messages m
        ORDER BY m.timestamp DESC
    `;
    
    const userId = req.query.userId || 'anonymous';
    
    db.all(query, [userId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Add new message
app.post('/api/messages', (req, res) => {
    const { id, name, message, date, likes = 0 } = req.body;
    
    const query = `INSERT INTO messages (id, name, message, date, likes) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(query, [id, name, message, date, likes], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, id: this.lastID });
    });
});

// Delete message
app.delete('/api/messages/:id', (req, res) => {
    const query = `DELETE FROM messages WHERE id = ?`;
    
    db.run(query, [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, deleted: this.changes });
    });
});

// Like/Unlike message
app.post('/api/messages/:id/like', (req, res) => {
    const { userId, action } = req.body;
    const messageId = req.params.id;
    
    if (action === 'like') {
        const checkQuery = `SELECT * FROM likes WHERE user_id = ? AND item_type = 'message' AND item_id = ?`;
        db.get(checkQuery, [userId, messageId], (err, row) => {
            if (!row) {
                const insertLike = `INSERT INTO likes (user_id, item_type, item_id) VALUES (?, ?, ?)`;
                db.run(insertLike, [userId, 'message', messageId], (err) => {
                    if (!err) {
                        const updateMessage = `UPDATE messages SET likes = likes + 1 WHERE id = ?`;
                        db.run(updateMessage, [messageId]);
                    }
                });
            }
        });
    } else {
        const deleteLike = `DELETE FROM likes WHERE user_id = ? AND item_type = 'message' AND item_id = ?`;
        db.run(deleteLike, [userId, 'message', messageId], (err) => {
            if (!err) {
                const updateMessage = `UPDATE messages SET likes = likes - 1 WHERE id = ?`;
                db.run(updateMessage, [messageId]);
            }
        });
    }
    
    res.json({ success: true });
});

// ========================================
// Serve the main page
// ========================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop');
});

