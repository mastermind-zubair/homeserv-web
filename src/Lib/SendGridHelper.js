// import environment from "Environment";

// export async function SendEmail(customers, contents, templateId, organisation, subject) {
//   const sgMail = require("@sendgrid/mail");
//   sgMail.setApiKey(environment.SENDGRID.API_KEY);
//   const fromEmail = environment.SENDGRID.default_sender;
//   const messages = customers.map((c) => {
//     return {
//       to: c.customer_email,
//       from: fromEmail,
//       templateId: templateId,
//       dynamic_template_data: {
//         subject: subject,
//         customer_name: c.customer_name,
//         content: contents,
//         organization: organisation,
//       },
//     };
//   });

//   try {
//     await sgMail.send(messages);
//     console.log("Emails sent successfully");
//     return true;
//   } catch (error) {
//     console.error("Error sending test email");
//     console.error(error);
//     if (error.response) {
//       console.error(error.response.body);
//     }

//     return false;
//   }
// }
