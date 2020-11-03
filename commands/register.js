require("dotenv").config();
const momenttz = require("moment-timezone");
const moment = () => momenttz().tz(process.env.TIME_ZONE);

module.exports.run = async (db, client, message, args) => {
  // modelo de mensagem
  // !r register d 9:40 #geral essa mensagem vai ser lembrada todo dia
  // !r register u 30/10/2020-9:40 #geral essa mensagem vai ser uma vez

  const [period, time, to, ...m] = args;
  const text = m.join(" ");

  if (!to.startsWith("<#")) {
    message.channel.send("Envia somente para canal de texto.");
    return;
  }

  const idChannel = to.replace(/[\D]/g, "");

  db.run(
    `INSERT INTO reminders VALUES (?, ?, ?, ?, ?, ?, ?)`,
    null,
    idChannel,
    period === "d" ? moment().format("DD/MM/YYYY") : time.split("-")[0],
    period === "d" ? time : time.split("-")[1],
    period,
    text,
    0
  );
  message.channel.send("Lembrete cadastrado com sucesso!");
};
