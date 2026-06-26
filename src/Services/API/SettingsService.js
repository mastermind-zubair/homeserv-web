// import BaseApiService from "Services/BaseApiService";

// class SettingsService extends BaseApiService {
//   //#region General

//   //#endregion

//   //#region Skills
//   static async Skill_Add(skill) {
//     const url = `/skill`;
//     const postData = skill;
//     return await super.POST(url, postData);
//   }

//   static async Skill_Update(skill) {
//     const url = `/skill/${skill.id}`;
//     const postData = skill;
//     return await super.PUT(url, postData);
//   }

//   static async Skill_Delete(id) {
//     const url = `/skill/${id}`;
//     return await super.DELETE(url);
//   }

//   static async Skill_List(filter) {
//     const url = `/skill/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: filter, // e.g: {id: 282} OR {active: true, name: "Code Booth"}
//     };
//     return await super.POST(url, postData);
//   }

//   static async Skill_Get(id) {
//     const url = `/skill/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: { id: id },
//     };
//     return await super.GET(url, postData);
//   }

//   //#endregion Skills

//   //#region WorkingAreas
//   static async WorkingArea_Add(working_area) {
//     const url = `/working_area`;
//     const postData = working_area;
//     return await super.POST(url, postData);
//   }

//   static async WorkingArea_Update(working_area) {
//     const url = `/working_area/${working_area.id}`;
//     const postData = working_area;
//     return await super.PUT(url, postData);
//   }

//   static async WorkingArea_Delete(id) {
//     const url = `/working_area/${id}`;
//     return await super.DELETE(url);
//   }

//   static async WorkingArea_List(filter) {
//     const url = `/working_area/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: filter, // e.g: {id: 282} OR {active: true, name: "Code Booth"}
//     };
//     return await super.POST(url, postData);
//   }

//   static async WorkingArea_Get(id) {
//     const url = `/working_area/list`;
//     const postData = {
//       order: [["id", "ASC"]],
//       condition: { id: id },
//     };
//     return await super.GET(url, postData);
//   }

//   //#endregion WorkingAreas
// }

// export default SettingsService;
