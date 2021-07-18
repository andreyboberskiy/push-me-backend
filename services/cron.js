const CronJob = require("cron").CronJob;
const ApiError = require("/exceptions/api-error");

class CronService {
  constructor() {
    this._jobs = {};
  }
  add(id, time, fn) {
    const job = new CronJob(time, fn, null, true);
    this._jobs[id] = {
      id,
      cron: job,
    };
    job.start();
  }
  stop(id) {
    if (!this._jobs[id]) return;
    this._jobs[id].cron.stop();
    delete this._jobs[id];
  }

  stopAll() {
    for (let cron in this._jobs) {
      let activeCron = this._jobs[cron].cron.running;
      if (activeCron.running) {
        activeCron.stop();
      }
    }
  }
  list() {
    return this._jobs;
  }
  running(name) {
    return this._jobs[name].cron.running;
  }
  lastDate(name) {
    return this._jobs[name].cron.lastDate();
  }
  nextDates(name) {
    return this._jobs[name].cron.nextDates();
  }
  getTime(time) {
    try {
      if (time.s) {
        return `*/${time.s} * * * * *`;
      }
      if (time.m) {
        return `* ${time.m} * * * *`;
      }
      if (time.h) {
        return `* * ${time.m} * * *`;
      }
    } catch (e) {
      throw ApiError.BadRequest("Cant parse time for cron");
    }
  }
}

module.exports = new CronService();
