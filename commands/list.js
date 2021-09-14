module.exports.run = async (db, client, message, args) => {
  db.all("SELECT * from reminders where sended = 0", (err, rows) => {
    if (rows.length > 0) {
      rows.forEach((x) => {
        message.channel.send(`
        > ID: ${x.id}
        > Mensagem: ${x.message}
        > Quando: ${
          x.period === "d"
            ? `Todo dia as ${x.time}`
            : x.period === "c"
            ? x.time
            : `${x.date} ${x.time}`
        }
        > Canal: <#${x.idChannel}>
      `);
      });
    } else {
      message.channel.send("Nenhum lembrete cadastrado.");
    }
  });
};
