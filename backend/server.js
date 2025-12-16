import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'server_profiles.json');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Helper to read data
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    try {
        const data = fs.readFileSync(DATA_FILE);
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading data:", error);
        return [];
    }
};

// Helper to write data
const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing data:", error);
    }
};

// GET all profiles
app.get('/api/profiles', (req, res) => {
    const profiles = readData();
    res.json(profiles);
});

// POST new profile
app.post('/api/profiles', (req, res) => {
    const newProfile = req.body;
    const profiles = readData();

    // Add new profile
    profiles.push(newProfile);

    writeData(profiles);
    res.status(201).json(newProfile);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Serve static files from the frontend dist directory
const FRONTEND_DIST = path.join(__dirname, '../frontend/dist');
app.use(express.static(FRONTEND_DIST));

// Handle client-side routing by returning index.html for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
});
