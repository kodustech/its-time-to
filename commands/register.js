require("dotenv").config();
const momenttz = require("moment-timezone");
const moment = () => momenttz().tz(process.env.TIME_ZONE);
const cronService = require("../service/cron");
const cron = require("node-cron");

module.exports.run = async (db, client, message, args) => {
  // modelo de mensagem
  // !r register d 9:40 #geral essa mensagem vai ser lembrada todo dia
  // !r register u 30/10/2020-9:40 #geral essa mensagem vai ser uma vez
  // !r register c * * * * * * #geral mensagem cron

  let [period] = args;
  let time;
  let to;
  let text;

  if (period === "c") {
    let s, m, h, d, mo, dw;
    [period, s, m, h, d, mo, dw, to, ...text] = args;
    const tz = new Date().getTimezoneOffset() / 60;
    h = h + tz;
    if (h >= 24) h = Math.abs(h - 24);
    time = `${s} ${m} ${h} ${d} ${mo} ${dw}`;
  } else {
    [period, time, to, ...text] = args;
  }

  if (!to.startsWith("<#")) {
    message.channel.send("Envia somente para canal de texto.");
    return;
  }

  text = text.join(" ");

  const idChannel = to.replace(/[\D]/g, "");

  db.run(
    `INSERT INTO reminders VALUES (?, ?, ?, ?, ?, ?, ?)`,
    null,
    idChannel,
    period === "d"
      ? moment().format("DD/MM/YYYY")
      : period === "c"
      ? time
      : time.split("-")[0],
    period === "d" || period === "c" ? time : time.split("-")[1],
    period,
    text,
    0
  );

  if (period === "c") {
    db.all("select last_insert_rowid()", (err, rows) => {
      const id = rows[0]["last_insert_rowid()"];
      const t = cron.schedule(time, () => {
        try {
          const channel = client.channels.cache.find((c) => c.id === idChannel);
          channel.send(text);
        } catch (error) {
          console.log(error);
        }
      });
      cronService.save(id, t);
    });
  }

  message.channel.send("Lembrete cadastrado com sucesso!");
};
