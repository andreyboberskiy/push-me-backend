const CronJob = require("cron").CronJob;

// exceptions
const ApiError = require("/exceptions/api-error");

// models
const TemplateModel = require("/models/Template");
const UserModel = require("/models/User");

// services
const NotificationService = require("/services/notification");
const TemplateService = require("/services/template");

// DTO

const templateDTO = require("/dto/template");

class CronService {
  constructor() {
    this._jobs = {};
  }
  add(id, time, fn) {
    const job = new CronJob(time, fn, null, true);
    this._jobs[id] = job;
    job.start();
  }
  addForNotify(template) {
    const { id, parseTime } = template;
    this.add(id, this.getTime(parseTime), () =>
      TemplateService.checkUpdates(id)
    );
  }
  stop(id) {
    if (!this._jobs[id]) return;
    this._jobs[id]?.stop();
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

  getTime(time) {
    try {
      if (time.s) {
        return `*/${time.s} * * * * *`;
      }
      if (time.m) {
        return `*/${time.m} * * * *`;
      }
      if (time.h) {
        return `* * */${time.h} * * *`;
      }
    } catch (e) {
      throw ApiError.BadRequest("Cant parse time for cron");
    }
  }
  async startAll() {
    try {
      const templates = await TemplateModel.find({ enabled: true });
      for (let i = 0; i < templates.length; i++) {
        this.addForNotify(templateDTO.getTemplateAllData(templates[i]));
      }

      console.log("All jobs started. Jobs now: ", this._jobs);
    } catch (e) {
      throw ApiError.BadRequest("Cant start all jobs");
    }
  }
}

module.exports = new CronService();
