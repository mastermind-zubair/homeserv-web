import { useState } from 'react'
import ContactService from "Services/API/ContactService";
import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";
const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  contact: '',
  comapnyName: '',
  messageText: '',
}
export const Contact = (props) => {
  const [{ firstName, lastName, email, contact, comapnyName, messageText }, setState] = useState(initialState)

  const handleChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({ ...prevState, [name]: value }))
  }
  const clearState = () => setState({ ...initialState })

  const handleSubmit =async (e) => {
    e.preventDefault()
    const authUser = {first_name: firstName,last_name: lastName,email:email,contact:contact,company_name:comapnyName,message:messageText};
    console.log(firstName, lastName, email, contact, comapnyName, messageText)
    const { status, message } = await trackPromise(ContactService.SaveContact(authUser));

    if (status) {
      notify("Your Request has been sucessfully submitted", true);
      clearState()
      e.target.reset();
    } else {
      notify("Your provided existing password is incorrect", false);
    }
  }
  return (
    <div>
      <div id='contact' className='boardcontact'>
        <div className='container'>
          <div className='col-md-4  contact-info'>
            <div className='contact-item'>
              <h4>WANT TO LEARN MORE <i className="fa fa-question-circle" ></i></h4>
              <h3><i className="fa fa-check-circle themecolor" ></i> Request a demo today and experience Service Vault first hand
              </h3>
            </div>

          </div>
          <div className='col-md-8'>
            <div className='row'>
              {/* <div className='section-title'>
                <h2>Get In Touch</h2>
                <p>
                  Please fill out the form below to send us an email and we will
                  get back to you as soon as possible.
                </p>
              </div> */}
              <form name='sentMessage' onSubmit={handleSubmit}>
                <div className='row'>
                  <div className='col-md-5'>
                    <label>First Name:</label>
                    <div className='form-group'>
                      <input
                        type='text'
                        id='firstName'
                        name='firstName'
                        className='form-control'
                        placeholder=''
                        required
                        onChange={handleChange}
                      />
                      <p className='help-block text-danger'></p>
                    </div>
                  </div>
                  <div className='col-md-5'>
                    <label>Last Name:</label>
                    <div className='form-group'>
                      <input
                        type='text'
                        id='lastName'
                        name='lastName'
                        className='form-control'
                        placeholder=''
                        required
                        onChange={handleChange}
                      />
                      <p className='help-block text-danger'></p>
                    </div>
                  </div>
                  <div className='col-md-5'>
                    <label>Email Address:</label>
                    <div className='form-group'>
                      <input
                        type='email'
                        id='email'
                        name='email'
                        className='form-control'
                        placeholder=''
                        required
                        onChange={handleChange}
                      />
                      <p className='help-block text-danger'></p>
                    </div>
                  </div>
                  <div className='col-md-5'>
                    <label>Contact:</label>
                    <div className='form-group'>
                      <input
                        type='text'
                        id='contact'
                        name='contact'
                        className='form-control'
                        placeholder=''
                        required
                        onChange={handleChange}
                      />
                      <p className='help-block text-danger'></p>
                    </div>
                  </div>
                  <div className='col-md-5'>
                    <label>Comapny Name:</label>
                    <div className='form-group'>
                      <input
                        type='text'
                        id='comapnyName'
                        name='comapnyName'
                        className='form-control'
                        placeholder=''
                        required
                        onChange={handleChange}
                      />
                      <p className='help-block text-danger'></p>
                    </div>
                  </div>


                  <div className="col-md-8">
                    <label>Message:</label>
                    <div className='form-group'>
                      <textarea
                        name='messageText'
                        id='messageText'
                        className='form-control'
                        rows='4'
                        placeholder=''
                        required
                        onChange={handleChange}
                      ></textarea>
                      <p className='help-block text-danger'></p>
                    </div>
                    <div id='success'></div>
                    <button type='submit' className='btn btn-custom btn-lg'>
                      Send Message
                    </button>
                  </div>


                </div>


              </form>
            </div>
          </div>



        </div>
      </div>

    </div>
  )
}
