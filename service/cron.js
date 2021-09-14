const crons = [];

exports.save = function (id, task) {
  crons[id] = task;
};

exports.remove = function (id) {
  const cron = crons[id];
  if (!cron) return;
  cron.destroy();
  crons.splice(crons.indexOf(id), 1);
};

exports.getAll = function () {
  console.log(crons);
};
