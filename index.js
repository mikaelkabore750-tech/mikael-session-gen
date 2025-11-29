const express = require('express');
const app = express();
__path = process.cwd()
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;
let server = require('./qr'),
    code = require('./pair');
require('events').EventEmitter.defaultMaxListeners = 500;
app.use('/server', server);
app.use('/code', code);
app.use('/pair',async (req, res, next) => {
res.sendFile(__path + '/pair.html')
})
app.use('/qr',async (req, res, next) => {
res.sendFile(__path + '/qr.html')
})
app.use('/',async (req, res, next) => {
res.sendFile(__path + '/main.html')
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(PORT, "0.0.0.0", () => {
    console.log("Mikael Session Generator démarré !");
    console.log(`Port utilisé : ${PORT}`);
    console.log(`Accès local  → http://localhost:${PORT}`);
    console.log(`Accès public → sera affiché dans le dashboard de Render/Koyeb/Railway`);
});

module.exports = app
                   
