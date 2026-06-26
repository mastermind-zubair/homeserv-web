import BaseApiService from "Services/BaseApiService";

class TechFleet extends BaseApiService {

  static async GetTechFleet(tech_id) {
    const url = `/truck/f_t/${tech_id}`;
    return await super.GET(url);
  }

  

}









export default TechFleet;
