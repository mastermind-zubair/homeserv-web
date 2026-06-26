const environment = {
  NAME: "DEVELOPMENT",
  APPLICATION_NAME: "Service Vault",
  LANDING_URL: "https://www.servicevault.com",
  APP_URL: "https://app.servicevault.com",
  VERSION: "1.0",
  USERNAME: "admin",
  PASSWORD: "123",
  ENVIRONMENT_CLASS: "bg-primary text-light",
  LANGUAGES: ["ar", "ch", "en", "es", "ge", "mar", "ur"],
  API: {
    BASE_URL: "https://api-stg.servicevault.com",
    USERNAME: "khurram",
    PASSWORD: "123",
    API_TIMEOUT: 30000,
    VERSION: "/v1",
  },
  PAYMENT_PORTAL_URL: "https://app-prototype.svpayments.com.au",
  PATH_PROFILE_PIC: "http://localhost:8000/v1/img/profile_pic",
  ENDPOINTS: {
    UPLOAD_PROFILE_PIC: "/upload/profile_pic",
    UPLOAD_LICENSE: "/upload/licenses",
    UPLOAD_VEHICLE_PIC: "/upload/vehicle_pic",
    UPLOAD_VEHICLE_POLICY_DOC: "/upload/policy_docs",
    UPLOAD_VEHICLE_SERVICE_DOC: "/upload/service_docs",
    UPLOAD_PRODUCT_PIC: "/upload/product",
    UPLOAD_TASK_PIC: "/upload/task",
    UPLOAD_SERVICE_MEDIA: "/upload/service_media",
    UPLOAD_COMPLIANCE_DOC: "/upload/compliance_document",
  },

  XERO_CALLBACK_URL: "http://localhost:3000/app/settings/link-accounting-software",
  XERO_CLIENT_ID: "8D5010B9DE77481992A51D2CB708DAC8",
  XERO_CLIENT_SECRET: "Yxit_lDWkJWb5w1heyIrhpzJUrDd9tz8mj0vdu6zJ2xchQJl",
  XERO_CLIENT_SECRET2: "3Q6IY7VWLIj83oitejgb8V6qh1RtoUYIgusiYZ9a2dIvvGxy",
  XERO_WEBHOOK_KEY: "yJyyWmLpg8JxjgYlvRre4jAls8+8K4LsJZbV1+NVVqv+27lVF1tPMddKQcXkxe/X6Xj90be5eReNrLMpCxYKwA==",
  XERO_SIGNATURE: "x-xero-signature",

  MYOB_CALLBACK_URL: "http://localhost:3000/app/settings/link-accounting-software",
  MYOB_CLIENT_ID: "2559e86e-2910-48a7-b603-5ab29880a073",
  MYOB_CLIENT_SECRET: "fUtXsSLcY3wB711U3SNx2rEe",
  REECE_CALLBACK_URL: 'http://localhost:3000/app/settings/link-inventory-software?reece_success=true',
  // REECE_BASE_URL: 'https://www.reece.com.au',
  // REECE_STAGED_ENABLED: false,
  REECE_BASE_URL: 'https://stage.reece.com.au',
  REECE_STAGED_ENABLED: true,
  SENDGRID: {
    API_KEY: process.env.REACT_APP_SENDGRID_API_KEY,
    templates: [
      {
        label: "Template 01",
        value: "d-9cb8bcda6e034bc5836fa8f0a0271811",
      },
      {
        label: "Template 02",
        value: "d-c610da8488514c228cc0dd521d1e0c07",
      },
      {
        label: "Template 03",
        value: "d-3c1c7222c16d43a58349651c07d8cf60",
      },
      {
        label: "Template 04",
        value: "d-e72d2d69a7584dcd81b695d6320d784e",
      },
      {
        label: "Template 05",
        value: "d-1cbe433480c14d82a98cf6eec9cbb195",
      },
      {
        label: "Template 06",
        value: "d-7e689a842e2c438da1b615c29543b7d7",
      },
      {
        label: "Template 07",
        value: "d-03168dc517024f54bc8607bdc8df28ff",
      },
    ],
    default_sender: "hello@servicevault.com",
  },
  NOTES: {
    JOB_NOTES: "JOB_NOTES",
    BEFORE_JOB_NOTES: "BEFORE_JOB_NOTES",
    AFTER_JOB_NOTES: "AFTER_JOB_NOTES",
    QUEST_JOB_COMPLETE_NOTES: "QUEST_JOB_COMPLETE_NOTES",
    QUEST_FULL_PAYMENT_NOTES: "QUEST_FULL_PAYMENT_NOTES",
    QUEST_PHOTO_UPLOAD_NOTES: "QUEST_PHOTO_UPLOAD_NOTES",
    QUEST_FORM_FILLED_NOTES: "QUEST_FORM_FILLED_NOTES",
    TRUCK_MATERIAL_NOTES: "TRUCK_MATERIAL_NOTES",
    TRUCK_MATERIAL_USED_NOTES: "TRUCK_MATERIAL_USED_NOTES",
  },
  DEFAULT_DATE_FORMAT: "YYYY-MM-DD",
  API_DATE_FORMAT: "YYYY-MM-DD",
};

if (process.env.REACT_APP_ENV === "development") {
  environment.NAME = "DEVELOPMENT";
  environment.APP_URL = "http://localhost:3000";
  environment.ENVIRONMENT_CLASS = "bg-info text-dark";

  environment.API.BASE_URL = "http://localhost:8000";
  environment.API.VERSION = "/v1";
  environment.PATH_PROFILE_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/profile_pic";
  environment.PATH_VEHICLE_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/vehicle_pic";
  environment.PATH_PLANT_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/vehicle_pic";
  environment.PATH_PRODUCT_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/product";
  environment.PATH_TASK_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/task";
  environment.PATH_SERVICE_MEDIA = environment.API.BASE_URL + environment.API.VERSION + "/img/service_media";
  environment.PATH_JOB_MEDIA = environment.API.BASE_URL + environment.API.VERSION + "/img/job_media";
  environment.PATH_PAYMENT = environment.API.BASE_URL + environment.API.VERSION + "/img/payment";
  environment.PATH_INVOICE_PDF = environment.API.BASE_URL + environment.API.VERSION + "/pdf/invoice_pdf";
  environment.PATH_QUOTE_PDF = environment.API.BASE_URL + environment.API.VERSION + "/pdf/quote_pdf";
  environment.PATH_COMPLIANCE_DOC = environment.API.BASE_URL + environment.API.VERSION + "/pdf/compliance_document";
}

if (process.env.REACT_APP_ENV === "staging") {
  environment.NAME = "STAGING";
  environment.APP_URL = "https://prototype.servicevault.com";
  environment.ENVIRONMENT_CLASS = "bg-warning text-dark";
  environment.PAYMENT_PORTAL_URL = "https://app-prototype.svpayments.com.au";
  environment.API.BASE_URL = "https://api-stg.servicevault.com";
  environment.API.VERSION = "/v1";
  environment.PATH_PROFILE_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/profile_pic";
  environment.PATH_VEHICLE_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/vehicle_pic";
  environment.PATH_PLANT_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/vehicle_pic";
  environment.PATH_PRODUCT_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/product";
  environment.PATH_TASK_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/task";
  environment.PATH_SERVICE_MEDIA = environment.API.BASE_URL + environment.API.VERSION + "/img/service_media";
  environment.PATH_JOB_MEDIA = environment.API.BASE_URL + environment.API.VERSION + "/img/job_media";
  environment.PATH_PAYMENT = environment.API.BASE_URL + environment.API.VERSION + "/img/payment";
  environment.PATH_INVOICE_PDF = environment.API.BASE_URL + environment.API.VERSION + "/pdf/invoice_pdf";
  environment.PATH_QUOTE_PDF = environment.API.BASE_URL + environment.API.VERSION + "/pdf/quote_pdf";
  environment.PATH_COMPLIANCE_DOC = environment.API.BASE_URL + environment.API.VERSION + "/pdf/compliance_document";

  environment.XERO_CALLBACK_URL =
    //"http://localhost:3000/app/settings/link-accounting-software";
    "https://prototype.servicevault.com/app/settings/link-accounting-software";
  environment.XERO_WEBHOOK_KEY =
    "yJyyWmLpg8JxjgYlvRre4jAls8+8K4LsJZbV1+NVVqv+27lVF1tPMddKQcXkxe/X6Xj90be5eReNrLMpCxYKwA==";

  environment.MYOB_CALLBACK_URL = "https://prototype.servicevault.com/app/settings/link-accounting-software";
  environment.MYOB_CLIENT_ID = "6b581366-c3ca-44cc-9f4b-f3b13fd37ae2";
  environment.MYOB_CLIENT_SECRET = "UYiLTK935tKfBbS5R3OQODc3";
  environment.REECE_CALLBACK_URL = 'https://prototype.servicevault.com/app/settings/link-inventory-software?reece_success=true';
}

if (process.env.REACT_APP_ENV === "production") {
  environment.NAME = "PRODUCTION";
  environment.APP_URL = "https://app.servicevault.com";
  environment.ENVIRONMENT_CLASS = "bg-success";
  environment.PAYMENT_PORTAL_URL = "https://app.svpayments.com.au";
  environment.API.BASE_URL = "https://api.servicevault.com";
  environment.API.VERSION = "/v1";
  environment.PATH_PROFILE_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/profile_pic";
  environment.PATH_VEHICLE_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/vehicle_pic";
  environment.PATH_PLANT_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/vehicle_pic";
  environment.PATH_PRODUCT_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/product";
  environment.PATH_TASK_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/task";
  environment.PATH_SERVICE_MEDIA = environment.API.BASE_URL + environment.API.VERSION + "/img/service_media";
  environment.PATH_JOB_MEDIA = environment.API.BASE_URL + environment.API.VERSION + "/img/job_media";
  environment.PATH_PAYMENT = environment.API.BASE_URL + environment.API.VERSION + "/img/payment";
  environment.PATH_INVOICE_PDF = environment.API.BASE_URL + environment.API.VERSION + "/pdf/invoice_pdf";
  environment.PATH_QUOTE_PDF = environment.API.BASE_URL + environment.API.VERSION + "/pdf/quote_pdf";
  environment.PATH_COMPLIANCE_DOC = environment.API.BASE_URL + environment.API.VERSION + "/pdf/compliance_document";

  environment.XERO_CALLBACK_URL = "https://app.servicevault.com/app/settings/link-accounting-software";
  environment.XERO_WEBHOOK_KEY =
    "yJyyWmLpg8JxjgYlvRre4jAls8+8K4LsJZbV1+NVVqv+27lVF1tPMddKQcXkxe/X6Xj90be5eReNrLMpCxYKwA==";

  environment.MYOB_CALLBACK_URL = "https://app.servicevault.com/app/settings/link-accounting-software";
  environment.MYOB_CLIENT_ID = "d1d9106e-06ee-4b7c-85dd-63729716cf2f";
  environment.MYOB_CLIENT_SECRET = "h4kSAMz5uGVKz244OnJWPmp2";
  environment.REECE_CALLBACK_URL = 'https://app.servicevault.com/app/settings/link-inventory-software?reece_success=true';
}

if (process.env.REACT_APP_ENV === "bilaldev") {
  environment.NAME = "BILALDEV";
  environment.APP_URL = "http://localhost:3000";
  environment.ENVIRONMENT_CLASS = "bg-warning text-dark";

  environment.API.BASE_URL = "http://localhost:8000";
  environment.API.VERSION = "/v1";
  environment.PATH_PROFILE_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/profile_pic";
  environment.PATH_VEHICLE_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/vehicle_pic";
  environment.PATH_PLANT_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/vehicle_pic";
  environment.PATH_PRODUCT_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/product";
  environment.PATH_TASK_PIC = environment.API.BASE_URL + environment.API.VERSION + "/img/task";
  environment.PATH_SERVICE_MEDIA = environment.API.BASE_URL + environment.API.VERSION + "/img/service_media";
  environment.PATH_JOB_MEDIA = environment.API.BASE_URL + environment.API.VERSION + "/img/job_media";
  environment.PATH_PAYMENT = environment.API.BASE_URL + environment.API.VERSION + "/img/payment";
  environment.PATH_INVOICE_PDF = environment.API.BASE_URL + environment.API.VERSION + "/pdf/invoice_pdf";
  environment.PATH_QUOTE_PDF = environment.API.BASE_URL + environment.API.VERSION + "/pdf/quote_pdf";
  environment.PATH_COMPLIANCE_DOC = environment.API.BASE_URL + environment.API.VERSION + "/pdf/compliance_document";
  environment.XERO_CALLBACK_URL = "http://localhost:3000/app/settings/link-accounting-software";
  //"https://prototype.servicevault.com/app/settings/link-accounting-software";

  environment.XERO_CLIENT_ID = "6DA7A8F59FD1405881F4B0372D0BC754";
  environment.XERO_CLIENT_SECRET = "xhWlQh23CzSwQzbeWQfwS2tAdP3Sz1QyyYR4LSGkdzE2VXtf";
  environment.XERO_WEBHOOK_KEY =
    "vm4BS3loKrmISmwET7elGSKJBpoCJlO4VV98UOCK+VdYrbDKcG9+9XP6ZniNNbmG8Spgxqg3f5k/M07oDjPx/A==";
  environment.XERO_SIGNATURE = "x-xero-signature";

  environment.MYOB_CALLBACK_URL = "http://localhost:3000/app/settings/link-accounting-software";
  environment.MYOB_CLIENT_ID = "2559e86e-2910-48a7-b603-5ab29880a073";
  environment.MYOB_CLIENT_SECRET = "fUtXsSLcY3wB711U3SNx2rEe";
}

export default environment;
