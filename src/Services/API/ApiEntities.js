const ApiEntities = [
  //GENERAL
  { name: "Query_Data", url: "/query-data" },
  { name: "Query_MarginMatrixTypes", url: "/margin_matrix_types" },

  //QUICK SETUP
  { name: "QS_Organisation", url: "/organisation" },
  { name: "QS_Industry", url: "/industry" },
  { name: "QS_Job_Tag", url: "/job_tag" },
  { name: "QS_Discount_Tag", url: "/discount_tag" },
  { name: "QS_Job_Priority", url: "/job_priority" },
  { name: "QS_Customer_Type", url: "/customer_type" },
  { name: "QS_Office_User", url: "/office_user" },
  { name: "QS_Sub_Contractor", url: "/sub_contractor" },
  { name: "QS_Field_Technician", url: "/field_technician" },
  { name: "QS_Project_Team", url: "/team" },
  { name: "QS_Service_Type", url: "/service_type" },
  { name: "QS_Technician_Role", url: "/technician_role" },
  { name: "QS_Lead_Source", url: "/lead_source" },

  //SETTINGS
  { name: "Settings_Commission_Parameter", url: "/commission_parameter" },
  { name: "Settings_Discount_Coupon", url: "/discount_coupon" },
  { name: "Settings_Discount_AddPriceIncrease", url: "/price_increase" },
  {
    name: "Settings_Discount_SpecialRateDiscount",
    url: "/special_rate_discount",
  },
  { name: "Settings_Discount_EmergencyRate", url: "/emergency_rate" },
  { name: "Settings_Fleet_Plant", url: "/plant" },
  { name: "Settings_Fleet_Vehicle", url: "/vehicle" },
  { name: "Settings_Invoice_Template", url: "/invoice_template" },
  { name: "Settings_Third_Party_Integration", url: "/third_party" },
  { name: "Settings_Compliance_Document", url: "/compliance_document" },
  { name: "Settings_Skill", url: "/skill" },
  { name: "Settings_WorkingArea", url: "/working_area" },
  { name: "Settings_Link_Accounting_Software", url: "/third_party" },
  { name: "Settings_Link_Inventory_Software", url: "/inventory_integration" },
  { name: "Settings_Payment_Gateway", url: "/payment_gateway" },

  //INVENTORY
  { name: "Inventory_Supplier", url: "/supplier" },
  { name: "Inventory_Product", url: "/product" },
  { name: "Inventory_Category", url: "/inventory_category" },
  { name: "Inventory_Template", url: "/inventory_template" },
  { name: "Inventory_Truck", url: "/truck" },
  {
    name: "Unassigned_Technicians",
    url: "/field_technician/unassigned-to-trucks",
  },
  { name: "Unassigned_Vehicles", url: "/vehicle/unassigned-to-trucks" },

  //PRICE BOOK
  { name: "PriceBook_BillableHourlyRate", url: "/hourly_rate" },
  { name: "PriceBook_Task", url: "/task" },
  { name: "PriceBook_Service", url: "/service" },
  { name: "PriceBook_Material", url: "/material" },
  { name: "PriceBook_Utility", url: "/utility" },
  { name: "PriceBook_MarginMatrix", url: "/margin_matrix" },
  { name: "PriceBook_ServiceCategory", url: "/category" },

  //OUTBOUND
  { name: "Outbound_Quote", url: "/quote" },
  { name: "Outbound_Marketing_Campaign", url: "/market_campaign" },
  { name: "Outbound_SMS_Campaign", url: "/sms_campaign" },
  { name: "Outbound_Credits", url: "/credits_transaction" },

  //ACCOUNTING
  { name: "Accounting_PurchaseOrder", url: "/purchase_order" },
  { name: "Accounting_Invoice", url: "/invoice" },

  //BOOK A JOB
  { name: "JOB", url: "/job" },
  { name: "JOB_COMPLAINT", url: "/job/complaint" },
  { name: "JOB_MESSAGE", url: "/job/message" },
  { name: "CUSTOMER", url: "/customer" },
  { name: "Job_Status", url: "/job/status" },

  //USER
  { name: "User", url: "/user" },

  //REPORTS
  {
    name: "Reports_Marketing",
    url: "/market_campaign",
  },
  {
    //NOT LIST
    name: "Reprots_Job_Stats",
    url: "/report/job",
  },
  {
    //NOT LIST
    name: "Reprots_Sales_Stats",
    url: "/report/sales",
  },
  {
    //NOT List
    name: "Reprots_CustomerType",
    url: "/report/customer_type",
  },

  {
    name: "Reports_Timesheet",
    url: "/time_sheet",
  },
  {
    name: "TIME_SLOT",
    url: "/time_slot",
  },
];
export default ApiEntities;
