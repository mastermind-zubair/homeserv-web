import BaseApiService from "Services/BaseApiService";
import QuickSetupService from "./QuickSetupService";

class UserService extends BaseApiService {
  static async Register(user) {
    const url = `/user/request`;
    const postData = user;
    return await super.POST(url, postData);
  }

  static async Verify(verification_token) {
    const url = `/user/verify/${verification_token}`;
    return await super.GET(url);
  }

  static async Login(user) {
    const url = `/user/login`;
    const postData = user;
    return await super.POST(url, postData);
  }

  static async ResetPasswrod(email) {
    const url = `/user/reset/`;
    const postData = { email };
    return await super.POST(url, postData);
  }

  static async ChangePassword(password) {
    const url = `/user/password`;
    const postData = { password };
    return await super.POST(url, postData);
  }

  static async GetUserOrganisations(uid) {
    return QuickSetupService.Organisation_List({ user_id: uid });
  }
}

export default UserService;
