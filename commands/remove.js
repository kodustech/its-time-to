module.exports.run = async (db, client, message, args) => {
  db.run(`DELETE FROM reminders WHERE id =?`, args[0]);
  message.channel.send("Lembrete removido com sucesso!");
};
