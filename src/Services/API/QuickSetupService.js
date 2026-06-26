// import BaseApiService from "Services/BaseApiService";

// class QuickSetupService extends BaseApiService {
//   //#region General

//   static async OfficeUserRoles_List(filter) {
//     // const url = `/office_user/roles`;
//     // const postData = {
//     //   order: [["id", "ASC"]],
//     //   condition: filter, // e.g: {id: 282} OR {active: true, name: "Code Booth"}
//     // };
//     // return await super.GET(url, postData);
//     return {
//       data: [
//         { name: "Owner", id: "owner" },
//         { name: "User", id: "user" },
//       ],
//       status: true,
//     };
//   }

//   //#endregion

//   //#region Organisation
//   static async Organisation_Add(organization) {
//     const url = `/organisation`;
//     const postData = organization;
//     return await super.POST(url, postData);
//   }

//   static async Organisation_Update(organization) {
//     const url = `/organisation/${organization.id}`;
//     const postData = organization;
//     return await super.PUT(url, postData);
//   }

//   static async Organisation_Delete(id) {
//     const url = `/organisation/${id}`;
//     return await super.DELETE(url);
//   }

//   static async Organisation_List(filter) {
//     const url = `/organisation/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: filter, // e.g: {id: 282} OR {active: true, name: "Code Booth"}
//     };
//     return await super.POST(url, postData);
//   }

//   static async Organisation_Get(id) {
//     const url = `/organisation/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: { id: id },
//     };
//     return await super.GET(url, postData);
//   }

//   //#endregion Organisation

//   //#region Industries
//   static async Industry_Add(industry) {
//     const url = `/industry`;
//     const postData = industry;
//     return await super.POST(url, postData);
//   }

//   static async Industry_Update(industry) {
//     const url = `/industry/${industry.id}`;
//     const postData = industry;
//     return await super.PUT(url, postData);
//   }

//   static async Industry_Delete(id) {
//     const url = `/industry/${id}`;
//     return await super.DELETE(url);
//   }

//   static async Industry_List(filter) {
//     const url = `/industry/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: filter, // e.g: {id: 282} OR {active: true, name: "Code Booth"}
//     };
//     return await super.POST(url, postData);
//   }

//   static async Industry_Get(id) {
//     const url = `/industry/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: { id: id },
//     };
//     return await super.GET(url, postData);
//   }

//   //#endregion Industries

//   //#region JobTags
//   static async JobTag_Add(job_tag) {
//     const url = `/job_tag`;
//     const postData = job_tag;
//     return await super.POST(url, postData);
//   }

//   static async JobTag_Update(job_tag) {
//     const url = `/job_tag/${job_tag.id}`;
//     const postData = job_tag;
//     return await super.PUT(url, postData);
//   }

//   static async JobTag_Delete(id) {
//     const url = `/job_tag/${id}`;
//     return await super.DELETE(url);
//   }

//   static async JobTag_List(filter) {
//     const url = `/job_tag/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: filter, // e.g: {id: 282} OR {active: true, name: "Code Booth"}
//     };
//     return await super.POST(url, postData);
//   }

//   static async JobTag_Get(id) {
//     const url = `/job_tag/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: { id: id },
//     };
//     return await super.GET(url, postData);
//   }

//   //#endregion JobTags

//   //#region DiscountTag
//   static async DiscountTag_Add(discount_tag) {
//     const url = `/discount_tag`;
//     const postData = discount_tag;
//     return await super.POST(url, postData);
//   }

//   static async DiscountTag_Update(discount_tag) {
//     const url = `/discount_tag/${discount_tag.id}`;
//     const postData = discount_tag;
//     return await super.PUT(url, postData);
//   }

//   static async DiscountTag_Delete(id) {
//     const url = `/discount_tag/${id}`;
//     return await super.DELETE(url);
//   }

//   static async DiscountTag_List(filter) {
//     const url = `/discount_tag/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: filter, // e.g: {id: 282} OR {active: true, name: "Code Booth"}
//     };
//     return await super.POST(url, postData);
//   }

//   static async DiscountTag_Get(id) {
//     const url = `/discount_tag/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: { id: id },
//     };
//     return await super.GET(url, postData);
//   }
//   //#endregion DiscountTag

//   //#region ServiceType
//   static async ServiceType_Add(service_type) {
//     const url = `/service_type`;
//     const postData = service_type;
//     return await super.POST(url, postData);
//   }

//   static async ServiceType_Update(service_type) {
//     const url = `/service_type/${service_type.id}`;
//     const postData = service_type;
//     return await super.PUT(url, postData);
//   }

//   static async ServiceType_Delete(id) {
//     const url = `/service_type/${id}`;
//     return await super.DELETE(url);
//   }

//   static async ServiceType_List(filter) {
//     const url = `/service_type/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: filter, // e.g: {id: 282} OR {active: true, name: "Code Booth"}
//     };
//     return await super.POST(url, postData);
//   }

//   static async ServiceType_Get(id) {
//     const url = `/service_type/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: { id: id },
//     };
//     return await super.GET(url, postData);
//   }
//   //#endregion ServiceType

//   //#region JobPriority
//   static async JobPriority_Add(job_priority) {
//     const url = `/job_priority`;
//     const postData = job_priority;
//     return await super.POST(url, postData);
//   }

//   static async JobPriority_Update(job_priority) {
//     const url = `/job_priority/${job_priority.id}`;
//     const postData = job_priority;
//     return await super.PUT(url, postData);
//   }

//   static async JobPriority_Delete(id) {
//     const url = `/job_priority/${id}`;
//     return await super.DELETE(url);
//   }

//   static async JobPriority_List(filter) {
//     const url = `/job_priority/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: filter, // e.g: {id: 282} OR {active: true, name: "Code Booth"}
//     };
//     return await super.POST(url, postData);
//   }

//   static async JobPriority_Get(id) {
//     const url = `/job_priority/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: { id: id },
//     };
//     return await super.GET(url, postData);
//   }

//   //#endregion JobPriority

//   //#region CustomerType
//   static async CustomerType_Add(customer_type) {
//     const url = `/customer_type`;
//     const postData = customer_type;
//     return await super.POST(url, postData);
//   }

//   static async CustomerType_Update(customer_type) {
//     const url = `/customer_type/${customer_type.id}`;
//     const postData = customer_type;
//     return await super.PUT(url, postData);
//   }

//   static async CustomerType_Delete(id) {
//     const url = `/customer_type/${id}`;
//     return await super.DELETE(url);
//   }

//   static async CustomerType_List(filter) {
//     const url = `/customer_type/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: filter, // e.g: {id: 282} OR {active: true, name: "Code Booth"}
//     };
//     return await super.POST(url, postData);
//   }

//   static async CustomerType_Get(id) {
//     const url = `/customer_type/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: { id: id },
//     };
//     return await super.GET(url, postData);
//   }

//   //#endregion CustomerType

//   //#region TechnicianRole
//   static async TechnicianRole_Add(technician_role) {
//     const url = `/technician_role`;
//     const postData = technician_role;
//     return await super.POST(url, postData);
//   }

//   static async TechnicianRole_Update(technician_role) {
//     const url = `/technician_role/${technician_role.id}`;
//     const postData = technician_role;
//     return await super.PUT(url, postData);
//   }

//   static async TechnicianRole_Delete(id) {
//     const url = `/technician_role/${id}`;
//     return await super.DELETE(url);
//   }

//   static async TechnicianRole_List(filter) {
//     const url = `/technician_role/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: filter, // e.g: {id: 282} OR {active: true, name: "Code Booth"}
//     };
//     return await super.POST(url, postData);
//   }

//   static async TechnicianRole_Get(id) {
//     const url = `/technician_role/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: { id: id },
//     };
//     return await super.GET(url, postData);
//   }
//   //#endregion TechnicianRole

//   //#region Office User
//   static async OfficeUser_Add(office_user) {
//     const url = `/office_user`;
//     const postData = office_user;
//     return await super.POST(url, postData);
//   }

//   static async OfficeUser_Update(office_user) {
//     const url = `/office_user/${office_user.id}`;
//     const postData = office_user;
//     return await super.PUT(url, postData);
//   }

//   static async OfficeUser_Delete(id) {
//     const url = `/office_user/${id}`;
//     return await super.DELETE(url);
//   }

//   static async OfficeUser_List(filter) {
//     const url = `/office_user/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: filter, // e.g: {id: 282} OR {active: true, name: "Code Booth"}
//     };
//     return await super.POST(url, postData);
//   }

//   static async OfficeUser_Get(id) {
//     const url = `/office_user/${id}`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: { id: id },
//     };
//     return await super.GET(url, postData);
//   }
//   //#endregion OfficeUser

//   //#region SubContractor
//   static async SubContractor_Add(sub_contractor) {
//     const url = `/sub_contractor`;
//     const postData = sub_contractor;
//     return await super.POST(url, postData);
//   }

//   static async SubContractor_Update(sub_contractor) {
//     const url = `/sub_contractor/${sub_contractor.id}`;
//     const postData = sub_contractor;
//     return await super.PUT(url, postData);
//   }

//   static async SubContractor_Delete(id) {
//     const url = `/sub_contractor/${id}`;
//     return await super.DELETE(url);
//   }

//   static async SubContractor_List(filter) {
//     const url = `/sub_contractor/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: filter, // e.g: {id: 282} OR {active: true, name: "Code Booth"}
//     };
//     return await super.POST(url, postData);
//   }

//   static async SubContractor_Get(id) {
//     const url = `/sub_contractor/${id}`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: { id: id },
//     };
//     return await super.GET(url, postData);
//   }
//   //#endregion SubContractor

//   //#region FieldTechnician
//   static async FieldTechnician_Add(field_technician) {
//     const url = `/field_technician`;
//     const postData = field_technician;
//     return await super.POST(url, postData);
//   }

//   static async FieldTechnician_Update(field_technician) {
//     const url = `/field_technician/${field_technician.id}`;
//     const postData = field_technician;
//     return await super.PUT(url, postData);
//   }

//   static async FieldTechnician_Delete(id) {
//     const url = `/field_technician/${id}`;
//     return await super.DELETE(url);
//   }

//   static async FieldTechnician_List(filter) {
//     const url = `/field_technician/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: filter, // e.g: {id: 282} OR {active: true, name: "Code Booth"}
//     };
//     return await super.POST(url, postData);
//   }

//   static async FieldTechnician_Get(id) {
//     const url = `/field_technician/${id}`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: { id: id },
//     };
//     return await super.GET(url, postData);
//   }
//   //#endregion FieldTechnician

//   //#region ProjectTeam
//   static async ProjectTeam_Add(team) {
//     const url = `/team`;
//     const postData = team;
//     return await super.POST(url, postData);
//   }

//   static async ProjectTeam_Update(team) {
//     const url = `/team/${team.id}`;
//     const postData = team;
//     return await super.PUT(url, postData);
//   }

//   static async ProjectTeam_Delete(id) {
//     const url = `/team/${id}`;
//     return await super.DELETE(url);
//   }

//   static async ProjectTeam_List(filter) {
//     const url = `/team/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: filter, // e.g: {id: 282} OR {active: true, name: "Code Booth"}
//     };
//     return await super.POST(url, postData);
//   }

//   static async ProjectTeam_Get(id) {
//     const url = `/team/${id}`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: { id: id },
//     };
//     return await super.GET(url, postData);
//   }
//   //#endregion ProjectTeam
// }

// export default QuickSetupService;
