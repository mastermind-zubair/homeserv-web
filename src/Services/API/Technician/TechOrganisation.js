import BaseApiService from "Services/BaseApiService";
import DefaultService from "Services/API/DefaultService";
import { trackPromise } from "react-promise-tracker";

class TechOrganisation extends BaseApiService {

  static async GetTechOrganisation(Org_ID) {
    
    const { data } = await trackPromise(DefaultService.Entity_Get("QS_Organisation", Org_ID));
    return data
  }

  

}









export default TechOrganisation;
