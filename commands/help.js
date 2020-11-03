bl = "\n";
bold = (t) => `**${t}**`;
singleLine = (t) => "`" + t + "`";
multipleLine = (t) => "```" + t + "```";
fix = (t) => multipleLine("fix" + bl + t);
diff = (t) => multipleLine("diff" + bl + t);

module.exports.run = async (db, client, message, args) => {
  message.channel.send(
    bold("O BOT RODA EM MINUTOS MULTIPLOS DE 5") +
      bl +
      diff(
        "- Lembretes cadastrados em minutos NÃO multiplos de 5, NÃO SERÃO ENVIADOS!"
      ) +
      bl +
      bl +
      bold("COMANDOS") +
      fix("!r help" + bl + "!r register" + bl + "!r list" + bl + "!r remove") +
      bl +
      bold("COMO USAR") +
      fix("register [periodicidade] [data-hora] [canal] [mensagem]") +
      "> Possui dois tipos de lembretes:" +
      diff(
        "+ Lembrete que será enviado apenas 1 vez na data e hora marcada" +
          bl +
          "+ Lembrete que será eviado todo dia na hora marcada"
      ) +
      diff(
        "- Lembrete Uníco" +
          bl +
          "!r register u 30/10/2020-9:40 #geral essa mensagem vai ser enviada uma vez" +
          bl +
          bl +
          "- Lembrete Diário" +
          bl +
          "!r register d 9:40 #geral essa mensagem vai ser enviada todo dia"
      ) +
      bl +
      fix("list") +
      "> Lista os lembretes cadastrados e ainda não enviados" +
      bl +
      bl +
      fix("remove [id]") +
      "> Apaga lembrete cadastrado"
  );
};
