const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the parent directory (where index.html is)
app.use(express.static(path.join(__dirname, '..')));

// --- API ROUTES ---

// 1. PASOS
app.get('/api/pasos', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM public.pasos ORDER BY created_at');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/pasos', async (req, res) => {
    const { id, name, type } = req.body;
    try {
        const { rows } = await db.query(
            'INSERT INTO public.pasos (id, name, type) VALUES ($1, $2, $3) RETURNING *',
            [id, name, type]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/pasos/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const { rows } = await db.query(
            'UPDATE public.pasos SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/pasos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM public.pasos WHERE id = $1', [id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. MEMBERS
app.get('/api/members', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM public.members');
        // Map snake_case to camelCase for frontend compatibility if needed
        // But better to keep DB raw and map in frontend, or map here.
        // Given current frontend maps it, we send raw DB rows.
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/members', async (req, res) => {
    const { id, paso_id, name, height, phone, position, dni, nickname, address, status, start_year, trabajadera } = req.body;
    try {
        const { rows } = await db.query(
            `INSERT INTO public.members 
            (id, paso_id, name, height, phone, position, dni, nickname, address, status, start_year, trabajadera) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [id, paso_id, name, height, phone, position, dni, nickname, address, status, start_year, trabajadera]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    const { name, height, phone, position, dni, nickname, address, status, start_year, trabajadera } = req.body;
    try {
        const { rows } = await db.query(
            `UPDATE public.members SET 
            name=$1, height=$2, phone=$3, position=$4, dni=$5, nickname=$6, address=$7, status=$8, start_year=$9, trabajadera=$10
            WHERE id = $11 RETURNING *`,
            [name, height, phone, position, dni, nickname, address, status, start_year, trabajadera, id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM public.members WHERE id = $1', [id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. IGUALA
app.get('/api/iguala', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM public.iguala');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/iguala', async (req, res) => {
    const { paso_id, config, assignments } = req.body;
    try {
        const { rows } = await db.query(
            `INSERT INTO public.iguala (paso_id, config, assignments) 
            VALUES ($1, $2, $3) 
            ON CONFLICT (paso_id) DO UPDATE SET 
            config = EXCLUDED.config, 
            assignments = EXCLUDED.assignments,
            updated_at = now()
            RETURNING *`,
            [paso_id, config, assignments]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/iguala/:paso_id', async (req, res) => {
    const { paso_id } = req.params;
    try {
        await db.query('DELETE FROM public.iguala WHERE paso_id = $1', [paso_id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. EVENTS
app.get('/api/events', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM public.events');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/events', async (req, res) => {
    const { id, paso_id, title, date, type } = req.body;
    try {
        const { rows } = await db.query(
            'INSERT INTO public.events (id, paso_id, title, date, type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id, paso_id, title, date, type]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM public.events WHERE id = $1', [id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
