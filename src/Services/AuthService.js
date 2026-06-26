import { compareAsc } from "date-fns";

export function loginWithJwt(token, user, technician, officer, workspace) {
  let subscriptions = workspace && workspace.subscriptions;

  let license = (subscriptions &&
    subscriptions.length > 0 &&
    subscriptions[0].license) || {
    id: 0,
    name: "No active license",
  };

  setCurrentSubscription(subscriptions ? subscriptions[0] : null);
  setCurrentLicense(license);
  setToken(token);
  setCurrentUser(user);
  setCurrentTechnician(technician);
  setCurrentOfficer(officer);

  //http.SetTokenInAuthHeader(jwt);
}
const tokenKey = "token";
const mapParamsKey = "map_params";
const userKey = "user";
const technicianKey = "technician";
const officerKey = "officer";
const licenseKey = "license";
const subscriptionKey = "subscription";
const orgKey = "org";

export function setToken(token) {
  localStorage.setItem(tokenKey, JSON.stringify(token));
}
export function getToken() {
  return JSON.parse(localStorage.getItem(tokenKey));
}

export function setMapParams(map_params) {
  localStorage.setItem(mapParamsKey, JSON.stringify(map_params));
}
export function getMapParams() {
  return JSON.parse(localStorage.getItem(mapParamsKey));
}

export function getAuthToken() {
  let token_data = JSON.parse(localStorage.getItem(tokenKey));
  if (token_data) return token_data.auth_token;
}
export function setCurrentUser(user) {
  localStorage.setItem(userKey, JSON.stringify(user));
}
export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(userKey));
}

export function setCurrentTechnician(technician) {
  localStorage.setItem(technicianKey, JSON.stringify(technician));
}
export function getCurrentTechnician() {
  var technician_obj = localStorage.getItem(technicianKey);
  if (!technician_obj) return null;
  return JSON.parse(technician_obj);
}

export function setCurrentOfficer(officer) {
  localStorage.setItem(officerKey, JSON.stringify(officer));
}
export function getCurrentOfficer() {
  var officer_obj = localStorage.getItem(officerKey);
  if (!officer_obj) return null;
  return JSON.parse(officer_obj);
}

export function setCurrentLicense(license) {
  localStorage.setItem(licenseKey, JSON.stringify(license));
}
export function getCurrentLicense() {
  var license_obj = localStorage.getItem(licenseKey);
  if (!license_obj) return null;
  return JSON.parse(license_obj);
}

export function setCurrentSubscription(subscription) {
  localStorage.setItem(subscriptionKey, JSON.stringify(subscription));
}
export function getCurrentSubscription() {
  var subscription_obj = localStorage.getItem(subscriptionKey);
  if (!subscription_obj) return null;
  return JSON.parse(subscription_obj);
}

export function logout() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
  localStorage.removeItem(orgKey);
  localStorage.removeItem(technicianKey);
  localStorage.removeItem(officerKey);
  localStorage.removeItem(licenseKey);
  localStorage.removeItem(subscriptionKey);
  //http.RemoveTokenFromAuthHeader();
}

export function isLoggedIn() {
  try {
    const token = getToken();
    const user = getCurrentUser();
    let result = false;
    // console.log(token, user);
    if (token && user && user.role && token.user_id === user.id) {
      if (compareAsc(new Date(token.expiresAt), new Date()) === 1) {
        //if token Expiry time is greater than current datetime
        result = true;
      } else {
        result = false;
      }
    } else {
      result = false;
    }

    return result;
  } catch (ex) {
    return false;
  }
}

export function isAdmin() {
  try {
    const token = getToken();
    const user = getCurrentUser();
    if (token && user && user.role && user.role.toLowerCase() === "owner")
      return true;
    else return false;
  } catch (ex) {
    return false;
  }
}

export function isTechnician() {
  try {
    const token = getToken();
    const user = getCurrentUser();
    if (
      token &&
      user &&
      user.role &&
      user.role.toLowerCase() === "field_technician"
    )
      return true;
    else return false;
  } catch (ex) {
    return false;
  }
}

export function isManagement() {
  try {
    const token = getToken();
    const user = getCurrentUser();
    if (token && user && user.role && user.role.toLowerCase() === "super_admin") return true;
    else return false;
  } catch (ex) {
    return false;
  }
}

export function isOfficer() {
  try {
    const token = getToken();
    const user = getCurrentUser();
    const officer = getCurrentOfficer();
    if (token && officer && officer.id) return true;
    else return false;
  } catch (ex) {
    return false;
  }
}

export default {
  loginWithJwt,
  logout,
  setToken,
  getToken,
  setMapParams,
  getMapParams,
  getAuthToken,
  setCurrentUser,
  getCurrentUser,
  setCurrentTechnician,
  getCurrentTechnician,
  setCurrentOfficer,
  getCurrentOfficer,
  getCurrentLicense,
  getCurrentSubscription,
  isLoggedIn,
  isAdmin,
  isTechnician,
  isOfficer,
  isManagement,
};
