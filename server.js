// server.js
// where your node app starts

// init project
require("dotenv").config();

const express = require("express");

const momenttz = require("moment-timezone");
const moment = () => momenttz().tz(process.env.TIME_ZONE);

const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const Discord = require("discord.js");
const cron = require("node-cron");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const client = new Discord.Client();
const config = require("./config.json");

client.login(process.env.DISCORD_TOKEN);

// init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(() => {
  if (!exists) {
    db.run(
      `CREATE TABLE reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        idChannel TEXT,
        date TEXT,
        time TEXT,
        period TEXT,
        message TEXT,
        sended INTEGER
      )`
    );
    console.log("New tables created!");
  } else {
    console.log("Database ready to go!");
  }
});

client.on("message", async (message) => {
  if (!message.content.startsWith(config.prefix)) return;
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (message.content.startsWith(`<@!${client.user.id}`)) return;
  if (message.content.startsWith(`<@${client.user.id}`)) return;

  try {
    const args = message.content.split(" ").slice(2);
    const command = message.content.split(" ")[1];

    const commandFile = require(`./commands/${command}.js`);
    commandFile.run(db, client, message, args);
  } catch (error) {
    const commandFile = require(`./commands/help.js`);
    commandFile.run(db, client, message, args);
    console.log(error);
  }
});

function sendMessages() {
  const date = moment().format("DD/MM/YYYY");
  const time = moment().format("HH:mm");
  //const time = '16:57'
  db.all(
    `SELECT * from reminders
         where
          (period = 'd' and time = '${time}') or
          (period = 'u' and time = '${time}' and date = '${date}' and sended = 0)
    `,
    (err, rows) => {
      rows.forEach((x) => {
        const channel = client.channels.cache.find((c) => c.id === x.idChannel);
        channel.send(x.message);
      });
      const uniqSends = rows.filter((x) => x.period === "u").map((x) => x.id);
      db.run(
        `UPDATE reminders set sended = 1 where id in (${uniqSends.join(",")})`
      );
    }
  );
}

app.get("/", (request, response) => {
  return response.send({ hello: "World" });
});

app.get("/send", (request, response) => {
  sendMessages();
});

cron.schedule("*/5 * * * *", () => {
  try {
    sendMessages();
    console.log(moment().format("DD-MM-YYYY HH.mm.ss"));
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${process.env.PORT}`);
});
