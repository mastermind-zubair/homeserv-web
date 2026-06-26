import BaseApiService from "Services/BaseApiService";

class TechTimesheetService extends BaseApiService {

  static async GetTechTimeSheet(time_span,params) {
    const url = `/time_sheet/f_t/${time_span}`;
    return await super.POST(url,params);
  }

static async GetTechClockInStatus(params) {
    const url = `/time_sheet/f_t/status`;
    return await super.POST(url,params);
  }

  static async updateTechClockInOut(type,params) {
    const url = `/time_sheet/f_t/${type}`;
    return await super.PUT(url,params);
  }
}

export default TechTimesheetService;
