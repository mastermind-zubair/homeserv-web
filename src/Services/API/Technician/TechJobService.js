import BaseApiService from "Services/BaseApiService";

class TechJobService extends BaseApiService {

  static async GetTechJob(job_id) {
    const url = `/job/${job_id}`;
    return await super.GET(url);
  }

  static async GetTechJobs(param_job) {
    const url = `/job/f_t/list`;
    return await super.POST(url, param_job);
  }

static async getJobUPloadedPic(params) {
    const url = `/job/media/list`;
    return await super.POST(url,params);
  }

static async uploadPicJobPicture(params) {
    const url = `/job/media`;
    return await super.POST(url,params);
  }
static async getPicPayment(params) {
    const url = `/payment/list`;
    return await super.POST(url,params);
  }

static async uploadPicPayment(params) {
    const url = `/payment`;
    return await super.POST(url,params);
  }

  static async getJobInvoice(job_id) {
    const url = `/invoice/job/${job_id}`;
    return await super.GET(url);
  }

}









export default TechJobService;
