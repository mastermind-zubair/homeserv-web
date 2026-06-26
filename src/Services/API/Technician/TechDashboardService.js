import BaseApiService from "Services/BaseApiService";

class TechDashboardService extends BaseApiService {

  static async GetTechStatistics(time_span) {
    const url = `/f_t/statistics/${time_span}`;
    return await super.GET(url);
  }
}

export default TechDashboardService;
