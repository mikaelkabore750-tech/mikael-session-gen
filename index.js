// index.js → version finale qui marche à 100% sur Render/Koyeb/Railway

import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __path = __dirname;

const app = express();
const PORT = process.env.PORT || 8000;

// Import dynamique des fichiers CommonJS (.cjs) → ça passe même avec "type": "module"
const server = await import('./qr.cjs');
const code = await import('./pair.cjs');

import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 500;

app.use('/server', server.default);
app.use('/code', code.default);

app.use('/pair', (req, res) => res.sendFile(__path + '/pair.html'));
app.use('/qr', (req, res) => res.sendFile(__path + '/qr.html'));
app.use('/', (req, res) => res.sendFile(__path + '/main.html'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, "0.0.0.0", () => {
    console.log("Mikael Session Generator démarré !");
    console.log(`Port utilisé : ${PORT}`);
    console.log(`Accès public → sera affiché dans le dashboard`);
});
