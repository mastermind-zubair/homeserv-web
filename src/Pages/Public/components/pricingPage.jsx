import React, { useState } from "react";
import { useHistory } from 'react-router-dom'
export const PricingPage = (props) => {
    const [showSate, setShowSate] = useState(false);
    const [monthlySate, setmonthlySate] = useState(true);

    const [showpackage, setShowpackage] = useState('SV Lite');

    const { push } = useHistory()
    debugger;
    const changeToAnnual = () => {
        debugger;
        setShowSate(true);
        setShowpackage('SV Lite')
        setmonthlySate(false);
        const month = document.getElementById('month');
        const year = document.getElementById('year');

        month.classList.remove("active");
        year.classList.add("active");


    }
    const changeToMonthly = () => {
        setShowSate(false);
        setShowpackage('SV Lite')
        setmonthlySate(true);
        const month = document.getElementById('month');
        const year = document.getElementById('year');

        year.classList.remove("active");
        month.classList.add("active");

    }

    const changeToSVLite = () => {
        debugger;
        if (showSate) {
            setmonthlySate(false);


        } else {
            setmonthlySate(true);

        }


        setShowpackage('SV Lite')

        const lite = document.getElementById('lite');
        const grow = document.getElementById('grow');

        grow.classList.remove("active");
        lite.classList.add("active");
    }
    const changeToSVGrow = () => {
        debugger;
        if (showSate) {
            setmonthlySate(false);


        } else {
            setmonthlySate(true);

        }
        const lite = document.getElementById('lite');
        const grow = document.getElementById('grow');

        lite.classList.remove("active");
        grow.classList.add("active")

        setShowpackage('SV Grow')


    }

    return (
        <div id="featuresPage" className='text-center'>

            <div className='col-md-12  section-pricing-bannerimage'>
                <h1 className="headlingalign"> Manage Your Jobs Smarter </h1>
            </div>
            <div className='col-md-12  '>
                <div className="column one">
                    <h1>Pick your plan </h1>
                </div>
                <br />
                <div className="text-center">
                    <div className="btn-group">
                        <button id="month" className="btn  btn-custom ml-2 custombackgroundbtn rounded btn-space btn-lg active btn-responsive" onClick={changeToMonthly}>Billed Monthly</button>

                        <button id="year" className="btn  btn-custom mr-2 custombackgroundbtn rounded  btn-lg btn-responsive" onClick={changeToAnnual}>Billed Annually</button>
                    </div>
                </div>
                <br />
                <div className="text-center margin-top">
                    <div className="btn-group">

                        <button id="lite" className="btn  btn-custom custombackgroundbtn rounded mr-2 btn-lg active" onClick={changeToSVLite} >SV Lite</button>
                        <button id="grow" className="btn  btn-custom custombackgroundbtn rounded  ml-2  btn-space btn-lg" onClick={changeToSVGrow}>SV Grow</button>

                    </div>
                </div>
            </div>
            <div className='container'>

                <div className=' row'>
                    {
                        (() => {



                            if (showpackage === 'SV Lite')
                                return props.data
                                    ? props.data.filter(x => x.ismonthly === monthlySate && x.name === showpackage).map((d, i) => (
                                        <div className="col-xs-6 col-md-3 columns" key={`${d.name}-${i}`}>
                                            <ul className="price">
                                                <li className="header">{d.name}</li>
                                                {d.ismonthly ? <li className="content"> {d.price == 0 ? <p><b></b><br /><a href="/contact">Contact Us</a></p> : <p><b>${d.price} AUD + GST</b><br /><p> Per Month</p></p>}
                                                </li> :
                                                    <li className="content">
                                                        {d.price == 0 ? <p><b><br /></b><br /><a href="/contact">Contact Us</a></p> : <p><b>${d.price} AUD + <br /> GST</b><br /><p> Per Annum</p></p>}


                                                    </li>

                                                }
                                                <li >{d.users}</li>


                                                <li className="grey">  <button className="btn  btn-custom btn-responsive" onClick={() => push('/contact')}>Get Started</button></li>
                                            </ul>

                                        </div>
                                    ))
                                    : 'Loading...'

                            else if (showpackage === 'SV Grow')
                                return props.data
                                    ? props.data.filter(x => x.ismonthly === monthlySate && x.name === showpackage).map((d, i) => (
                                        <div className="col-xs-6 col-md-3 columns" key={`${d.name}-${i}`}>
                                            <ul className="price">
                                                <li className="header">{d.name}</li>
                                                {d.ismonthly ? <li className="content"> {d.price == 0 ? <p><b></b><br /><a href="/contact">Contact Us</a></p> : <p><b>${d.price} AUD +  GST</b><br /><p> Per Month</p></p>}
                                                </li> :
                                                    <li className="content">
                                                        {d.price == 0 ? <p><br /><b></b><br /><a href="/contact">Contact Us</a></p> : <p><b>${d.price} AUD + <br /> GST</b><br /><p> Per Annum</p></p>}


                                                    </li>

                                                }
                                                <li >{d.users}</li>


                                                <li className="grey">  <button className="btn  btn-custom btn-responsive" onClick={() => push('/contact')}>Get Started</button></li>
                                            </ul>

                                        </div>
                                    ))
                                    : 'Loading...'

                        })()
                    }




                </div>
                <br />
                <br />
                <br />

                <table>
                    <colgroup></colgroup>
                    <colgroup></colgroup>
                    <colgroup></colgroup>
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            <th>
                                <h2>SV Lite</h2>
                            </th>

                            <th>
                                <h2>SV Grow</h2>
                            </th>
                        </tr>
                    </thead>
                    <tfoot>
                        {/* <tr>
                            <th>&nbsp;</th>
                            <td><a href="#">Start a free trial</a></td>
                            <td><a href="#">Start a free trial</a></td>
                        </tr> */}
                    </tfoot>
                    <tbody>
                        <tr>
                            <th>Dashboard</th>
                            <td>&#10004;</td>
                            <td>&#10004;</td>
                        </tr>
                        <tr>
                            <th>Book a job</th>
                            <td>&#10004;</td>
                            <td>&#10004;</td>
                        </tr>
                        <tr>
                            <th>Call Tracking</th>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <th>Job Search</th>
                            <td>&#10004;</td>
                            <td>&#10004;</td>
                        </tr>
                        <tr>
                            <th>Dispatching</th>
                            <td>&#10004;</td>
                            <td>&#10004;</td>
                        </tr>
                        <tr>
                            <th>Price Book</th>
                            <td></td>
                            <td>&#10004;</td>
                        </tr>
                        <tr>
                            <th>Inventory Control</th>
                            <td></td>
                            <td>&#10004;</td>
                        </tr>
                        <tr>
                            <th>Reports</th>
                            <td>&#10004;</td>
                            <td>&#10004;</td>
                        </tr>
                        <tr>
                            <th>Accounting</th>
                            <td>&#10004;</td>
                            <td>&#10004;</td>
                        </tr>
                        <tr>
                            <th>OutBound Marketing Campaign</th>
                            <td>Up to 1,000 Emails</td>
                            <td>Up to 3,000 Emails</td>
                        </tr>
                        <tr>
                            <th>Settings</th>
                            <td>&#10004;</td>
                            <td>&#10004;</td>
                        </tr>
                        <tr>
                            <th>Quick Setup</th>
                            <td>&#10004;</td>
                            <td>&#10004;</td>
                        </tr>
                        <tr>
                            <th>Fleet Management</th>
                            <td>&#10004;</td>
                            <td>&#10004;</td>
                        </tr>
                    </tbody>
                </table>
            </div>



        </div>
    );
}
