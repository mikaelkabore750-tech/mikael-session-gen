const { makeid } = require('./gen-id.cjs');          // ← corrigé
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const { default: makeWASocket, useMultiFileAuthState, delay, Browsers, makeCacheableSignalKeyStore, DisconnectReason, jidNormalizedUser, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');

const { upload } = require('./mega');                // ← on garde seulement celle-ci

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function MIKAEL_BOTS_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

        try {
            const items = ["Safari"];
            const randomItem = items[Math.floor(Math.random() * items.length)];

            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                generateHighQualityLinkPreview: true,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                syncFullHistory: false,
                browser: Browsers.macOS(randomItem)
            });

            if (!sock.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            sock.ev.on('creds.update', saveCreds);
            sock.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === "open") {
                    await delay(5000);
                    const rf = __dirname + `/temp/${id}/creds.json`;

                    const generateRandomText = () => {
                        const prefix = "3EB";
                        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        let text = prefix;
                        for (let i = prefix.length; i < 22; i++) {
                            text += characters.charAt(Math.floor(Math.random() * characters.length));
                        }
                        return text;
                    };

                    try {
                        const mega_url = await upload(fs.createReadStream(rf), `${sock.user.id}.json`);
                        const string_session = mega_url.replace('https://mega.nz/file/', '');
                        const md = "MIKAEL-BOT~" + string_session;

                        const codeMsg = await sock.sendMessage(sock.user.id, { text: md });

                        const desc = `*Hello there your mikaelbot User!*\n\n> Do not share your session id with your gf.\n\n*Thanks for using your mikaelbot*\n\n> Join WhatsApp Channel :\nhttps://whatsapp.com/channel/0029Vb6s5JpDzgT69NCS7i1a\n\nDont forget to fork the repo\nhttps://github.com/mikaelkabore750-tech/mikael-session-gen\n\n*© Powered BY Mikaeldev*`;

                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: "MikaelDev",
                                    thumbnailUrl: "https://files.catbox.moe/z6xhnh.jpegl",
                                    sourceUrl: "https://whatsapp.com/channel/0029Vb6s5JpDzgT69NCS7i1a",
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }
                            }
                        }, { quoted: codeMsg });

                    } catch (e) {
                        await sock.sendMessage(sock.user.id, { text: "Error uploading session: " + e.message });
                    }

                    await delay(1000);
                    await sock.ws.close();
                    await removeFile('./temp/' + id);
                    console.log(`Connected ${sock.user.id} ✅`);
                    process.exit(0);
                }

                if (connection === "close" && lastDisconnect?.error?.output?.statusCode !== 401) {
                    await delay(10000);
                    MIKAEL_BOTS_PAIR_CODE();
                }
            });

        } catch (err) {
            console.log("Service restarted due to error");
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                res.send({ code: "Service Unavailable" });
            }
        }
    }

    return await MIKAEL_BOTS_PAIR_CODE();
});

module.exports = router;
