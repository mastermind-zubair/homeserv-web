import BaseApiService from "Services/BaseApiService";
import { notify } from "Services/ToastService";
import DefaultService from "./DefaultService";

const { getLookupDataSource } = require("Lib/ReactHelper");
class LookupService extends BaseApiService {
  static async getLookups(entities, fk) {
    //entities must be an array of strings
    const url = `/query-data`;
    const postData = entities;
    const { data, status, message } = await super.POST(url, postData);

    !status && notify(message);
    let list;
    entities.forEach((e, index) => {
      list[e] = getLookupDataSource(data[e], "name", "id", fk);
    });

    return list;
  }

  static async getLookup(data, labelField, idField, fk) {
    return getLookupDataSource(data, labelField, idField, fk);
  }

  static async getLookupByEntity(
    ENTITY_API_KEY,
    filter,
    labelField,
    valueField,
    fk
  ) {
    const { data, status } = await DefaultService.Entity_List(
      ENTITY_API_KEY,
      filter
    );

    if (status)
      return getLookupDataSource(
        data,
        labelField || "name",
        valueField || "id",
        fk
      );
  }

  static async getLookupByEntityQuery(
    ENTITY_API_KEY,
    filter,
    labelField,
    valueField,
    fk
  ) {
    const { data, status } = await DefaultService.Entity_Query(
      ENTITY_API_KEY,
      filter
    );

    if (status)
      return getLookupDataSource(
        data,
        labelField || "name",
        valueField || "id",
        fk
      );
  }

  static async getLookupByEntity_SingleVal(ENTITY_API_KEY, filter) {
    const { data, status } = await DefaultService.GetMarginMatrixTypes();

    if (status)
      return data.map((d) => {
        return { label: d, value: d };
      });
  }

  static async convertLookup(data, labelField, valueField) {
    let results = data.map((d) => {
      return { ...d, label: d[labelField], value: d[valueField] };
    });
    return results;
  }

  static async Organisations(filter) {
    // const { data, status } = await QuickSetupService.Organisation_List(filter);
    // if (status) return getLookupDataSource(data, "name", "id");
    return this.getLookupByEntity("QS_Organisation", filter);
  }

  static async Industries(filter) {
    // const { data, status } = await QuickSetupService.Industry_List(filter);
    // if (status) return getLookupDataSource(data, "name", "id");
    return this.getLookupByEntity("QS_Industry", filter);
  }

  static async JobTags(filter) {
    // const { data, status } = await QuickSetupService.JobTag_List(filter);
    // if (status) return getLookupDataSource(data, "name", "id");
    return this.getLookupByEntity("QS_Job_Tag", filter);
  }

  static async JobPriorities(filter) {
    // const { data, status } = await QuickSetupService.JobTag_List(filter);
    // if (status) return getLookupDataSource(data, "name", "id");
    return this.getLookupByEntity("QS_Job_Priority", filter);
  }

  static async ServiceTypes(filter) {
    // const { data, status } = await QuickSetupService.ServiceType_List(filter);
    // if (status) return getLookupDataSource(data, "name", "id");
    return this.getLookupByEntity("QS_Service_Type", filter);
  }

  static async LeadSources(filter) {
    return this.getLookupByEntity("QS_Lead_Source", filter);
  }

  static async DiscountTags(filter) {
    // const { data, status } = await QuickSetupService.DiscountTag_List(filter);
    // if (status) return getLookupDataSource(data, "name", "id");
    return this.getLookupByEntity("QS_Discount_Tag", filter);
  }

  static async CustomerTypes(filter) {
    return this.getLookupByEntity("QS_Customer_Type", filter);
  }

  static BookingPageSections(filter) {
    const BookingPageSections_Data = require("Data/BookingPageSections.json");
    let data = getLookupDataSource(BookingPageSections_Data, "name", "id");
    return data;
  }

  static async OfficeUserRoles(filter) {
    const { data } = await DefaultService.Entity_Query("Query_Data", [
      "office_user_roles",
    ]);
    const { office_user_roles } = data;

    return (
      office_user_roles &&
      office_user_roles.map((role) => {
        return {
          label: role.name,
          value: role.id,
        };
      })
    );
  }

  static async Currencies(filter) {
    // const { data, status } = await QuickSetupService.Currency_List();
    return getLookupDataSource(
      [
        { name: "USD", id: "1" },
        { name: "AUD", id: "2" },
        { name: "PKR", id: "3" },
      ],
      "name",
      "id"
    );
  }

  static async AccountingSoftware(filter) {
    // const { data, status } = await QuickSetupService.Currency_List();
    return getLookupDataSource(
      [
        { name: "MYOB", id: "myob" },
        { name: "XERO", id: "xero" },
      ],
      "name",
      "id"
    );
  }

  static async TechnicianRoles(filter) {
    // const { data, status } = await QuickSetupService.TechnicianRole_List();
    // if (status) return getLookupDataSource(data, "name", "id");
    return this.getLookupByEntity("QS_Technician_Role", filter);
  }

  static async Skills(filter) {
    // const { data, status } = await SettingsService.Skill_List();
    // if (status) return getLookupDataSource(data, "name", "id");
    return this.getLookupByEntity("Settings_Skill", filter);
  }

  static async WorkingAreas(filter) {
    // const { data, status } = await SettingsService.WorkingArea_List();
    // if (status) return getLookupDataSource(data, "name", "id");
    return this.getLookupByEntity("Settings_WorkingArea", filter);
  }

  static async SubContractors(filter) {
    // const { data, status } = await QuickSetupService.SubContractor_List();
    // if (status) return getLookupDataSource(data, "display_name", "id");
    return this.getLookupByEntity(
      "QS_Sub_Contractor",
      filter,
      "display_name",
      "id"
    );
  }

  static async FieldTechnicians(filter) {
    return this.getLookupByEntity(
      "QS_Field_Technician",
      filter,
      "display_name",
      "id"
    );
  }

  static async UnassignedFieldTechnicians(filter) {
    return this.getLookupByEntity(
      "QS_Field_Technician",
      filter,
      "display_name",
      "id"
    );
  }
}

export default LookupService;
