// index.js → version ESM 2025

import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Pour remplacer __dirname et __path en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __path = __dirname;

const app = express();
const PORT = process.env.PORT || 8000;

// Import de tes routes
import server from './qr.js';
import code from './pair.js';

// Augmente la limite d'event listeners 
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 500;

// Middleware
app.use('/server', server);
app.use('/code', code);

app.use('/pair', async (req, res) => {
    res.sendFile(__path + '/pair.html');
});

app.use('/qr', async (req, res) => {
    res.sendFile(__path + '/qr.html');
});

app.use('/', async (req, res) => {
    res.sendFile(__path + '/main.html');
});

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Démarrage du serveur
app.listen(PORT, "0.0.0.0", () => {
    console.log("Mikael Session Generator démarré !");
    console.log(`Port utilisé : ${PORT}`);
    console.log(`Accès local  → http://localhost:${PORT}`);
    console.log(`Accès public → sera affiché dans le dashboard de Render/Koyeb/Railway`);
});

export default app; // garde ça au cas où 
