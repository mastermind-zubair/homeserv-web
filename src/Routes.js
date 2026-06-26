/// PUBLIC
import Registration from "./Pages/Public/Registration";
import Login from "./Pages/Public/Login";
import ForgotPassword from "./Pages/Public/ForgotPassword";
import VerifyUser from "./Pages/Public/VerifyUser";
import SessionExpired from "./Pages/Public/SessionExpired";
import LockScreen from "./Pages/Public/LockScreen";
import Error400 from "./Pages/Public/Error400";
import Error403 from "./Pages/Public/Error403";
import Error404 from "./Pages/Public/Error404";
import Error500 from "./Pages/Public/Error500";
import Error503 from "./Pages/Public/Error503";
import ContactSupport from "./Pages/Public/ContactSupport";

// /// Deshboard
import Dashboard from "./Pages/App/Dashboard/Dashboard";

// /// Book A Job
import BookAJob from "./Pages/App/BookAJob/BookAJob";
import Customers from "./Pages/App/BookAJob/Customers";

// /// Call Tracking
import CallTracking from "./Pages/App/CallTracking/CallTracking";

// /// Job Search
import JobSearch from "./Pages/App/JobSearch/JobSearch";
import AdvanceSearch from "./Pages/App/JobSearch/AdvanceSearch";

// /// Dispatching
import Dispatching from "./Pages/App/Dispatching/Dispatching";

// /// Price Book
import BillableHourlyRate from "./Pages/App/PriceBook/BillableHourlyRate";
import AllServices from "./Pages/App/PriceBook/AllServices";
import AllCategories from "./Pages/App/PriceBook/AllCategories";
import AllTasks from "./Pages/App/PriceBook/AllTasks";
import AllMaterials from "./Pages/App/PriceBook/AllMaterials";
import AllUtilities from "./Pages/App/PriceBook/AllUtilities";
import MaterialMarginMatrix from "./Pages/App/PriceBook/MaterialMarginMatrix";
import OptionTemplates from "./Pages/App/PriceBook/OptionTemplates";

// ///  Inventory
import Products from "./Pages/App/Inventory/Products";
import Categories from "./Pages/App/Inventory/Categories";
import Trucks from "./Pages/App/Inventory/Trucks";
import Suppliers from "./Pages/App/Inventory/Suppliers";
import Templates from "./Pages/App/Inventory/Templates";
import Reporting from "./Pages/App/Inventory/Reporting";

// /// Reports
import Jobs from "./Pages/App/Reports/Jobs";
import Sales from "./Pages/App/Reports/Sale";
import Quotes from "./Pages/App/Reports/Quotes";
import CSR from "./Pages/App/Reports/CSR";
import Marketing from "./Pages/App/Reports/Marketing";
import CustomerTypes from "./Pages/App/Reports/CustomerTypes";
import ServiceTypes from "./Pages/App/Reports/ServiceTypes";
import Timesheets_Daily from "./Pages/App/Reports/Timesheets_Daily";
import Timesheets_Approved from "./Pages/App/Reports/Timesheets_Approved";
import Timesheets_ConfirmedPayroll from "./Pages/App/Reports/Timesheets_ConfirmedPayroll";
import Invoices from "./Pages/App/Reports/Invoices";
import Timesheets_Report from "./Pages/App/Reports/Timesheets_Report";
import JobPriority from "./Pages/App/Reports/JobPriority";
import DiscountCoupons from "./Pages/App/Reports/DiscountCoupons";
import PurchaseOrders from "./Pages/App/Reports/PurchaseOrders";
import TechnicalPerformance from "./Pages/App/Reports/TechnicalPerformance";
import OutboundSMS from "Pages/App/Reports/OutboundSMS";
import CreateYourOwn from "./Pages/App/Reports/CreateYourOwn";

// /// Accounting
import Accounting_PurchaseOrders from "./Pages/App/Accounting/PurchaseOrders";
import Accounting_AccountsReceivable from "./Pages/App/Accounting/AccountsReceivable";

// /// Outbound
import Outbound_Quotes from "./Pages/App/Outbound/Quotes";
import Outbound_Marketing from "./Pages/App/Outbound/Marketing";
import Outbound_SMS_Marketing from './Pages/App/Outbound/SMSMarketing';
import Outbound_Credits from "./Pages/App/Outbound/Credits";

// /// Payments
import Payments from "./Pages/App/Payments/Payments";

// /// Settings
import Dicsount_AddPriceIncrease from "./Pages/App/Settings/Discount_AddPriceIncrease";
import LinkAccountingSoftware from "./Pages/App/Settings/LinkAccountingSoftware";
import LinkPaymentGateway from "./Pages/App/Settings/LinkPaymentGateway";
import LinkInventorySoftware from "./Pages/App/Settings/LinkInventorySoftware";
import InvoiceTemplate from "./Pages/App/Settings/InvoiceTemplate";
import CommissionParameters from "./Pages/App/Settings/CommissionParameters";
import Dicsount_Coupons from "./Pages/App/Settings/Discount_Coupons";
import Discount_EmergencyRate from "./Pages/App/Settings/Discount_EmergencyRate";
import Discount_SpecialRateDiscount from "./Pages/App/Settings/Discount_SpecialRateDiscount";
import Integration_Xero from "./Pages/App/Settings/Integration_Xero";
import Integration_MYOB from "./Pages/App/Settings/Integration_MYOB";
import Integration_Quickbooks from "./Pages/App/Settings/Integration_Quickbooks";
import Integration_WildJar from "./Pages/App/Settings/Integration_WildJar";
import Integration_Square from "./Pages/App/Settings/Integration_Square";
import Integration_Twillio from "./Pages/App/Settings/Integration_Twillio";
import ImportYourCustomerList from "./Pages/App/Settings/ImportYourCustomerList";
import ComplianceDocuments from "./Pages/App/Settings/ComplianceDocuments";
import ManageUsers_Field from "./Pages/App/Settings/ManageUsers_Field";
import ManageUsers_Office from "./Pages/App/Settings/ManageUsers_Office";
import ManageUsers_ProjectTeams from "./Pages/App/Settings/ManageUsers_ProjectTeams";
import FleetManagement_Vehicles from "./Pages/App/Settings/FleetManagement_Vehicles";
import FleetManagement_Plants from "./Pages/App/Settings/FleetManagement_Plants";

// /// Quick Setup
import Organisations from "./Pages/App/QuickSetup/Organisations";
import Industries from "./Pages/App/QuickSetup/Industries";
import JobTags from "./Pages/App/QuickSetup/JobTags";
import JobPriorities from "./Pages/App/QuickSetup/JobPriorities";
import DiscountTags from "./Pages/App/QuickSetup/DiscountTags";
import ServiceTypes_QS from "./Pages/App/QuickSetup/ServiceTypes";
import CustomerTypes_QS from "./Pages/App/QuickSetup/CustomerTypes";
import TechnicianRoles from "Pages/App/QuickSetup/TechnicianRoles";
import OfficeUsers from "./Pages/App/QuickSetup/OfficeUsers";
import SubContractors from "./Pages/App/QuickSetup/SubContractors";
import FieldTechnicians from "./Pages/App/QuickSetup/FieldTechnicians";
import ProjectTeams from "./Pages/App/QuickSetup/ProjectTeams";
import LeadSources from "./Pages/App/QuickSetup/LeadSources";

// /// USER ACCOUNT
import UserProfile from "./Pages/App/User/UserProfile";
import UserLanguages from "./Pages/App/User/UserLanguages";
import ChangePassword from "./Pages/App/User/ChangePassword";
import Accounts_Billing from "./Pages/App/User/Accounts_Billing";

// MANAGEMENT

import ManagementDashboard from "Pages/Management/Dashboard/Dashboard";

// /// TECHNICIAN
import TechnicianDashboard from "Pages/Technician/Dashboard/Dashboard";
import TechnicianJobs from "Pages/Technician/Jobs/Jobs";
import TechnicianFleet from "Pages/Technician/Fleet/Fleet";
import TechnicianTimesheet from "Pages/Technician/Timesheet/Timesheet";
import Job_View from "Pages/Technician/Jobs/Job-View";
import Job_Estimate_Present from "Pages/Technician/Jobs/Job-Estimate-Present";
import Job_Start_Travel from "Pages/Technician/Jobs/Job-Start-Travel";
import Job_Notes from "Pages/Technician/Jobs/Job-Notes";
import Job_Close_Notes from "Pages/Technician/Jobs/Job-Close-Notes";
import Job_Estimate_Start from "Pages/Technician/Jobs/Job-Estimate-Start";
import Job_Estimate_Main from "Pages/Technician/Jobs/Job-Estimate-Main";
import Job_Start_Work from "Pages/Technician/Jobs/Job-Start-Work";
import Job_Purchase_Order_List from "Pages/Technician/Jobs/Job-Purchase-Order-List";
import Job_Purchase_Order from "Pages/Technician/Jobs/Job-Purchase-Order";
import Job_Payment from "Pages/Technician/Jobs/Job-Payment";
import Job_Compliance from "Pages/Technician/Jobs/Job-Compliance";
import Videos_Dashboard from "Pages/App/Videos/Videos_Dashboard";
import Videos_BookAJob from "Pages/App/Videos/Videos_BookAJob";
import Videos_CallTracking from "Pages/App/Videos/Videos_CallTracking";
import Videos_JobSearch from "Pages/App/Videos/Videos_JobSearch";
import Videos_Dispatching from "Pages/App/Videos/Videos_Dispatching";
import Videos_PriceBook from "Pages/App/Videos/Videos_PriceBook";
import Videos_Inventory from "Pages/App/Videos/Videos_Inventory";
import Videos_Reports from "Pages/App/Videos/Videos_Reports";
import Videos_Accounting from "Pages/App/Videos/Videos_Accounting";
import Videos_Outbound from "Pages/App/Videos/Videos_Outbound";
import Videos_Payments from "Pages/App/Videos/Videos_Payments";
import Videos_Settings from "Pages/App/Videos/Videos_Settings";
import Videos_QuickSetup from "Pages/App/Videos/Videos_QuickSetup";
import Videos_MyAccount from "Pages/App/Videos/Videos_UserAccount";
import Job_Compliance_Document from "Pages/Technician/Jobs/Job-Compliance-Document";
import Videos_TechnicianApp from "Pages/App/Videos/Videos_TechnicianApp";
import Videos_UserAccount from "Pages/App/Videos/Videos_UserAccount";
//import Integration_Xero_Webhook from "Pages/App/Settings/Integration_Xero_Webhook";

export const routes = [
  /// Deshborad
  { url: "app/dashboard", component: Dashboard, app: ["website"] },
  /// Book A Job
  { url: "app/book-a-job", component: BookAJob, app: ["website"] },
  { url: "app/book-a-job/customers", component: Customers, app: ["website"] },
  /// Call Tracking
  { url: "app/call-tracking", component: CallTracking, app: ["website"] },
  /// Job Search
  { url: "app/job-search", component: JobSearch, app: ["website"] },
  {
    url: "app/job-search/advance-job-search",
    component: AdvanceSearch,
    app: ["website"],
  },

  /// Dispatching
  { url: "app/dispatching", component: Dispatching, app: ["website"] },

  /// Price Book
  // { url: "app/price-book", component: PriceBook , app: ['app']},
  { url: "app/price-book", component: AllServices, app: ["website"] },
  {
    url: "app/price-book/billable-hourly-rate",
    component: BillableHourlyRate,
    app: ["website"],
  },
  {
    url: "app/price-book/all-services",
    component: AllServices,
    app: ["website"],
  },
  {
    url: "app/price-book/all-categories",
    component: AllCategories,
    app: ["website"],
  },
  { url: "app/price-book/all-tasks", component: AllTasks, app: ["website"] },
  {
    url: "app/price-book/all-materials",
    component: AllMaterials,
    app: ["website"],
  },
  {
    url: "app/price-book/all-utilities",
    component: AllUtilities,
    app: ["website"],
  },
  {
    url: "app/price-book/material-margin-matrix",
    component: MaterialMarginMatrix,
    app: ["website"],
  },
  {
    url: "app/price-book/option-templates",
    component: OptionTemplates,
    app: ["website"],
  },

  /// Inventory
  // { url: "app/inventory", component: Inventory , app: ['app']},
  { url: "app/inventory", component: Trucks, app: ["website"] },
  { url: "app/inventory/products", component: Products, app: ["website"] },
  { url: "app/inventory/categories", component: Categories, app: ["website"] },
  { url: "app/inventory/trucks", component: Trucks, app: ["website"] },
  { url: "app/inventory/suppliers", component: Suppliers, app: ["website"] },
  { url: "app/inventory/templates", component: Templates, app: ["website"] },
  { url: "app/inventory/reporting", component: Reporting, app: ["website"] },

  /// Reports
  // { url: "app/reports", component: Reports , app: ['app']},
  { url: "app/reports", component: Jobs, app: ["website"] },
  { url: "app/reports/jobs", component: Jobs, app: ["website"] },
  { url: "app/reports/sales", component: Sales, app: ["website"] },
  { url: "app/reports/quotes", component: Quotes, app: ["website"] },
  { url: "app/reports/csr", component: CSR, app: ["website"] },
  { url: "app/reports/marketing", component: Marketing, app: ["website"] },
  {
    url: "app/reports/customer-types",
    component: CustomerTypes,
    app: ["website"],
  },
  {
    url: "app/reports/service-types",
    component: ServiceTypes,
    app: ["website"],
  },
  {
    url: "app/reports/timesheets_report",
    component: Timesheets_Report,
    app: ["website"],
  },
  {
    url: "app/reports/technician-roles",
    component: TechnicianRoles,
    app: ["website"],
  },
  {
    url: "app/reports/daily-timesheets",
    component: Timesheets_Daily,
    app: ["website"],
  },
  {
    url: "app/reports/approved-timesheets",
    component: Timesheets_Approved,
    app: ["website"],
  },
  {
    url: "app/reports/confirmed-payroll",
    component: Timesheets_ConfirmedPayroll,
    app: ["website"],
  },
  { url: "app/reports/invoices", component: Invoices, app: ["website"] },
  { url: "app/reports/job-priority", component: JobPriority, app: ["website"] },
  {
    url: "app/reports/discount-coupons",
    component: DiscountCoupons,
    app: ["website"],
  },
  {
    url: "app/reports/purchase-orders",
    component: PurchaseOrders,
    app: ["website"],
  },
  {
    url: "app/reports/technician-performance",
    component: TechnicalPerformance,
    app: ["website"],
  },
  {
    url: "app/reports/outbound-sms",
    component: OutboundSMS,
    app: ["website"],
  },
  {
    url: "app/reports/create-your-own",
    component: CreateYourOwn,
    app: ["website"],
  },

  /// Accounting
  // { url: "app/accounting", component: Accounting , app: ['app']},
  {
    url: "app/accounting",
    component: Accounting_AccountsReceivable,
    app: ["website"],
  },
  {
    url: "app/accounting/purchase-orders",
    component: Accounting_PurchaseOrders,
    app: ["website"],
  },
  {
    url: "app/accounting/accounts-receivable",
    component: Accounting_AccountsReceivable,
    app: ["website"],
  },

  /// Outbound
  // { url: "app/outbound", component: Outbound , app: ['app']},
  { url: "app/outbound", component: Outbound_Quotes, app: ["website"] },
  { url: "app/outbound/quotes", component: Outbound_Quotes, app: ["website"] },
  {
    url: "app/outbound/marketing",
    component: Outbound_Marketing,
    app: ["website"],
  },
  {
    url: "app/outbound/sms-marketing",
    component: Outbound_SMS_Marketing,
    app: ["website"],
  },
  {
    url: "app/outbound/credits",
    component: Outbound_Credits,
    app: ["website"],
  },

  /// Payments
  { url: "app/payments", component: Payments, app: ["website"] },

  /// Settings
  // { url: "app/settings", component: Settings , app: ['app']},
  { url: "app/settings", component: LinkAccountingSoftware, app: ["website"] },
  {
    url: "app/settings/link-accounting-software",
    component: LinkAccountingSoftware,
    app: ["website"],
  },
  {
    url: "app/settings/link-payment-gateway",
    component: LinkPaymentGateway,
    app: ["website"],
  },
  {
    url: "app/settings/link-inventory-software",
    component: LinkInventorySoftware,
    app: ["website"],
  },
  {
    url: "app/settings/invoice-template",
    component: InvoiceTemplate,
    app: ["website"],
  },
  {
    url: "app/settings/commission-parameters",
    component: CommissionParameters,
    app: ["website"],
  },
  {
    url: "app/settings/discount-coupons",
    component: Dicsount_Coupons,
    app: ["website"],
  },
  {
    url: "app/settings/discount-emergency-rate",
    component: Discount_EmergencyRate,
    app: ["website"],
  },
  {
    url: "app/settings/discount-special-rate-discount",
    component: Discount_SpecialRateDiscount,
    app: ["website"],
  },
  {
    url: "app/settings/discount-add-price-increase",
    component: Dicsount_AddPriceIncrease,
    app: ["website"],
  },
  {
    url: "app/settings/integrations-xero",
    component: Integration_Xero,
    app: ["website"],
  },
  // {
  //   url: "app/settings/integrations-xero-webhook",
  //   component: Integration_Xero_Webhook,
  //   app: ["website"],
  // },
  {
    url: "app/settings/integrations-myob",
    component: Integration_MYOB,
    app: ["website"],
  },
  {
    url: "app/settings/integrations-quickbooks",
    component: Integration_Quickbooks,
    app: ["website"],
  },
  {
    url: "app/settings/integrations-wildjar",
    component: Integration_WildJar,
    app: ["website"],
  },
  {
    url: "app/settings/integrations-square",
    component: Integration_Square,
    app: ["website"],
  },
  {
    url: "app/settings/integrations-twillio",
    component: Integration_Twillio,
    app: ["website"],
  },
  {
    url: "app/settings/import-your-customer-list",
    component: ImportYourCustomerList,
    app: ["website"],
  },
  {
    url: "app/settings/compliance-documents",
    component: ComplianceDocuments,
    app: ["website"],
  },
  {
    url: "app/settings/manage-office-users",
    component: ManageUsers_Office,
    app: ["website"],
  },
  {
    url: "app/settings/manage-field-users",
    component: ManageUsers_Field,
    app: ["website"],
  },
  {
    url: "app/settings/manage-project-teams",
    component: ManageUsers_ProjectTeams,
    app: ["website"],
  },
  {
    url: "app/settings/fleet-vehicles",
    component: FleetManagement_Vehicles,
    app: ["website"],
  },
  {
    url: "app/settings/fleet-plants",
    component: FleetManagement_Plants,
    app: ["website"],
  },

  /// Quick Setup
  // { url: "app/quick-setup", component: QuickSetup , app: ['app']},
  { url: "app/quick-setup", component: Organisations, app: ["website"] },
  {
    url: "app/quick-setup/organisations",
    component: Organisations,
    app: ["website"],
  },
  {
    url: "app/quick-setup/industries",
    component: Industries,
    app: ["website"],
  },
  { url: "app/quick-setup/job-tags", component: JobTags, app: ["website"] },
  {
    url: "app/quick-setup/job-priorities",
    component: JobPriorities,
    app: ["website"],
  },
  {
    url: "app/quick-setup/discount-tags",
    component: DiscountTags,
    app: ["website"],
  },
  {
    url: "app/quick-setup/service-types",
    component: ServiceTypes_QS,
    app: ["website"],
  },
  {
    url: "app/quick-setup/technician-roles",
    component: TechnicianRoles,
    app: ["website"],
  },
  {
    url: "app/quick-setup/customer-types",
    component: CustomerTypes_QS,
    app: ["website"],
  },
  {
    url: "app/quick-setup/office-users",
    component: OfficeUsers,
    app: ["website"],
  },
  {
    url: "app/quick-setup/sub-contractors",
    component: SubContractors,
    app: ["website"],
  },
  {
    url: "app/quick-setup/field-technicians",
    component: FieldTechnicians,
    app: ["website"],
  },
  {
    url: "app/quick-setup/project-teams",
    component: ProjectTeams,
    app: ["website"],
  },
  {
    url: "app/quick-setup/lead-sources",
    component: LeadSources,
    app: ["website"],
  },

  // USER VIDEOS
  { url: "app/videos", component: Videos_Dashboard, app: ["website"] },
  {
    url: "app/videos/dashboard",
    component: Videos_Dashboard,
    app: ["website"],
  },
  {
    url: "app/videos/book-a-job",
    component: Videos_BookAJob,
    app: ["website"],
  },
  ,
  {
    url: "app/videos/call-tracking",
    component: Videos_CallTracking,
    app: ["website"],
  },

  {
    url: "app/videos/job-search",
    component: Videos_JobSearch,
    app: ["website"],
  },
  {
    url: "app/videos/dispatching",
    component: Videos_Dispatching,
    app: ["website"],
  },
  {
    url: "app/videos/price-book",
    component: Videos_PriceBook,
    app: ["website"],
  },
  {
    url: "app/videos/inventory",
    component: Videos_Inventory,
    app: ["website"],
  },
  {
    url: "app/videos/reports",
    component: Videos_Reports,
    app: ["website"],
  },
  {
    url: "app/videos/accounting",
    component: Videos_Accounting,
    app: ["website"],
  },
  {
    url: "app/videos/outbound",
    component: Videos_Outbound,
    app: ["website"],
  },
  {
    url: "app/videos/payments",
    component: Videos_Payments,
    app: ["website"],
  },
  {
    url: "app/videos/settings",
    component: Videos_Settings,
    app: ["website"],
  },
  ,
  {
    url: "app/videos/quick-setup",
    component: Videos_QuickSetup,
    app: ["website"],
  },
  ,
  {
    url: "app/videos/user-account",
    component: Videos_UserAccount,
    app: ["website"],
  },
  {
    url: "app/videos/technician-app",
    component: Videos_TechnicianApp,
    app: ["website"],
  },

  { url: "app/user", component: UserProfile, app: ["website"] },
  { url: "app/user/profile", component: UserProfile, app: ["website"] },
  {
    url: "app/user/accounts-billing",
    component: Accounts_Billing,
    app: ["website"],
  },
  {
    url: "app/user/change-password",
    component: ChangePassword,
    app: ["website"],
  },
  { url: "app/user/languages", component: UserLanguages, app: ["website"] },

  /// GENERAL PROTECTED PAGES for
  {
    url: "app/session-expired",
    component: SessionExpired,
    app: ["website", "technician"],
  },
  { url: "app/error-400", component: Error400, app: ["website", "technician"] },
  { url: "app/error-403", component: Error403, app: ["website", "technician"] },
  { url: "app/error-404", component: Error404, app: ["website", "technician"] },
  { url: "app/error-500", component: Error500, app: ["website", "technician"] },
  { url: "app/error-503", component: Error503, app: ["website", "technician"] },

  // PUBLIC ROUTES
  { url: "login", auth: "public", component: Login, app: [] },
  { url: "register", auth: "public", component: Registration, app: [] },
  { url: "lock", auth: "public", component: LockScreen, app: [] },
  {
    url: "forgot-password",
    auth: "public",
    component: ForgotPassword,
    app: [],
  },
  {
    url: "session-expired",
    auth: "public",
    component: SessionExpired,
    app: [],
  },
  { url: "error-400", auth: "public", component: Error400, app: [] },
  { url: "error-403", auth: "public", component: Error403, app: [] },
  { url: "error-404", auth: "public", component: Error404, app: [] },
  { url: "error-500", auth: "public", component: Error500, app: [] },
  { url: "error-503", auth: "public", component: Error503, app: [] },
  { url: "verify-user/:token", auth: "public", component: VerifyUser, app: [] },
  {
    url: "contact-support",
    auth: "public",
    component: ContactSupport,
    app: [],
  },
  //{ url: "app/", auth: "public", component: LandingPage },

  // MANAGEMENT ROUTES
  {
    url: "management/dashboard",
    component: ManagementDashboard,
    app: ["management"],
  },

  // TECHNICIAN ROUTES
  {
    url: "technician/dashboard",
    component: TechnicianDashboard,
    app: ["technician"],
  },
  {
    url: "technician/timesheet",
    component: TechnicianTimesheet,
    app: ["technician"],
  },
  { url: "technician/fleet", component: TechnicianFleet, app: ["technician"] },
  { url: "technician/jobs", component: TechnicianJobs, app: ["technician"] },
  { url: "technician/user", component: UserProfile, app: ["technician"] },
  {
    url: "technician/user/profile",
    component: UserProfile,
    app: ["technician"],
  },
  {
    url: "technician/user/change-password",
    component: ChangePassword,
    app: ["technician"],
  },
  {
    url: "technician/user/languages",
    component: UserLanguages,
    app: ["technician"],
  },
  {
    url: "technician/jobs/job-view/:jid?",
    component: Job_View,
    app: ["technician"],
  },
  {
    url: "technician/jobs/job-estimate-start/:jid",
    component: Job_Estimate_Start,
    app: ["technician"],
  },
  {
    url: "technician/jobs/job-estimate-main/:jid?/:qid?",
    component: Job_Estimate_Main,
    app: ["technician"],
  },
  {
    url: "technician/jobs/job-estimate-present/:jid/:qid",
    component: Job_Estimate_Present,
    app: ["technician"],
  }, // { url: "technician/jobs/job-estimate-present-email", component: Job_Estimate_Present_Email, app: ["technician"] },
  {
    url: "technician/jobs/job-start-travel/:jid?",
    component: Job_Start_Travel,
    app: ["technician"],
  },
  {
    url: "technician/jobs/job-payment/:jid",
    component: Job_Payment,
    app: ["technician"],
  },
  {
    url: "technician/jobs/job-notes/:jid",
    component: Job_Notes,
    app: ["technician"],
  },
  {
    url: "technician/jobs/job-close-notes/:jid",
    component: Job_Close_Notes,
    app: ["technician"],
  },
  {
    url: "technician/jobs/job-start-work/:jid?",
    component: Job_Start_Work,
    app: ["technician"],
  },
  {
    url: "technician/jobs/job-purchase-order-list/:jid/:page?",
    component: Job_Purchase_Order_List,
    app: ["technician"],
  },
  {
    url: "technician/jobs/job-purchase-order/:jid?/:page?",
    component: Job_Purchase_Order,
    app: ["technician"],
  },
  {
    url: "technician/jobs/job-compliance/:jid",
    component: Job_Compliance,
    app: ["technician"],
  },
  {
    url: "technician/job-compliance-document",
    component: Job_Compliance_Document,
    app: ["technician"],
  },
];
