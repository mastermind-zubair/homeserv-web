import BaseApiService from "Services/BaseApiService";

class ContactService extends BaseApiService {
  static async SaveContact(contact) {
    const url = `/contact_us`;
    const postData = contact;
    return await super.POST(url, postData);
  }

  
  
  
  

 
}

export default ContactService;
