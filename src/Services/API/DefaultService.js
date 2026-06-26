import _ from "lodash";
import BaseApiService from "Services/BaseApiService";
import ApiEntities from "./ApiEntities";

class DefaultService extends BaseApiService {
  static async Subscribe(email) {
    const url = `/subscribe`;
    const postData = { email };
    return await super.POST(url, postData);
  }

  static async GetInvoiceTemplateOptions() {
    const url = "/invoice_template_options";
    return await super.GET(url);
  }

  static async GetComplianceDocumentAnchors() {
    const url = "/compliance_template_achors";
    return await super.GET(url);
  }

  static async GetMarginMatrixTypes() {
    const url = "/margin_matrix_types";
    return await super.GET(url);
  }

  static async GetCountries() {
    const url = "/countries";
    return await super.GET(url);
  }

  static async GetStates(country_id) {
    const url = `/states/${country_id}`;
    return await super.GET(url);
  }

  static async GetCities(state_id) {
    const url = `/cities/${state_id}`;
    return await super.GET(url);
  }

  static async GetStatistics(organisation_id, time_span, start, end) {
    const url = `/statistics/${organisation_id}/${time_span}/${start}/${end}`;
    return await super.GET(url);
  }

  static async GetStatisticsAdmin(time_span) {
    const url = `/admin/statistics/${time_span}`;
    return await super.GET(url);
  }

  static async GetCountryStateCity(country, state, city) {
    const url = `/country_state_city_ids`;
    return await super.POST(url, { country, state, city });
  }

  static async GetPendingQuotes(filter, order) {
    const url = `/quote/pending`;
    const postData = {
      order: order || [["id", "ASC"]],
      condition: filter,
    };
    return await super.POST(url, postData);
  }
  //#region General API Calls (for ApiEntities)
  static async Entity_Query(entityName, componentArray, filter, order) {
    const url = `${_.find(ApiEntities, { name: entityName }).url}`;
    const postData = {
      components: componentArray,
      condition: filter,
      order: order,
    };
    return await super.POST(url, postData);
  }

  static async GetMyNotifications(filter, order) {
    const url = `/notification/my`;
    const postData = {
      order: order || [["id", "ASC"]],
      condition: filter,
    };
    return await super.POST(url, postData);
  }

  static async GetReeceConnect(id) {
    const url = `/inventory_integration/connect-reece/${id}`;
    return await super.GET(url);
  }

  static async GetReeceCustomerToken(id) {
    const url = `/inventory_integration/reece-customer-token/${id}`;
    return await super.GET(url);
  }

  static async UpdateReecePriceFile(id) {
    const url = `/inventory_integration/price-update-reece/${id}`;
    return await super.GET(url);
  }

  static async GetReeceDisconnect(id) {
    const url = `/inventory_integration/remove-reece/${id}`;
    return await super.DELETE(url);
  }

  static async GetReeceConfirm(id) {
    const url = `/inventory_integration/confirm-reece/${id}`;
    return await super.GET(url);
  }

  static async GetOneTime(type, filter, order) {
    const url = `/one_time/${type}`;
    const postData = {
      order: order,
      condition: filter,
    };
    return await super.POST(url, postData);
  }

  
  static async Entity_List(entityName, filter, order) {
    const url = `${_.find(ApiEntities, { name: entityName }).url}/list`;
    const postData = {
      order: order || [["id", "ASC"]],
      condition: filter,
    };
    return await super.POST(url, postData);
  }

  static async Entity_Get(entityName, id) {
    const url = `${_.find(ApiEntities, { name: entityName }).url}/${id}`;
    const postData = {
      order: [["id", "ASC"]],
      condition: { id: id },
    };
    return await super.GET(url, postData);
  }

  static async Entity_Add(entityName, entityData) {
    const url = `${_.find(ApiEntities, { name: entityName }).url}`;
    const postData = entityData;
    return await super.POST(url, postData);
  }

  static async Entity_Update(entityName, entityData) {
    const url = `${_.find(ApiEntities, { name: entityName }).url}/${
      entityData.id
    }`;
    const postData = entityData;
    return await super.PUT(url, postData);
  }

  static async Entity_Delete(entityName, id) {
    const url = `${_.find(ApiEntities, { name: entityName }).url}/${id}`;
    return await super.DELETE(url);
  }

  static async GetGeoLocation(
    line_1,
    line_2,
    city,
    state,
    country,
    postal_code
  ) {
    const url = "/geo_code";
    const postData = {
      line_1,
      line_2,
      city,
      state,
      country,
      postal_code,
    };
    return await super.POST(url, postData);
  }

  static async ThirdParty_ImportContacts(linkAccoutingSoftwareId) {
    const url = "/third_party/import_contacts";
    const postData = {
      linkAccoutingSoftwareId, //id of the link_accounting_software details can be obtained from endpoint "{{base_url}}v1/third_party/{id}"
    };
    return await super.POST(url, postData);
  }

  static async ThirdParty_GetXeroConnections(access_token) {
    const url = "/third_party/xero/connections";
    const postData = {
      access_token,
    };
    return await super.POST(url, postData);
  }

  static async ThirdParty_ExportTransactions(linkAccoutingSoftwareId) {
    const url = "/third_party/publish_invoices";
    const postData = {
      linkAccoutingSoftwareId, //id of the link_accounting_software details can be obtained from endpoint "{{base_url}}v1/third_party/{id}"
    };
    return await super.POST(url, postData);
  }

  static async LisenceLimitations() {
    const url = "/user/limits";
    const postData = {};
    return await super.POST(url, postData);
  }
  //#endregion General API Calls (for ApiEntities)
}

export default DefaultService;
