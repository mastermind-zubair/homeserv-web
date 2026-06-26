import { GetStorage, RemoveStorage, SetStorage } from "Lib/StorageHelper";

export default class OrganisationManager {
  static GetSelectedOrganisation() {
    return GetStorage("org");
  }

  static SelectOrganisation(org) {
    return SetStorage("org", org);
  }

  static RemoveSelectedOrganisation() {
    return RemoveStorage("org");
  }
}
