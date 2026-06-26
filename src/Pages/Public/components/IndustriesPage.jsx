import React, { Component } from 'react';

export const IndustriesPage = (props) => {
    return (
        <div id="featuresPage" className='text-center'>
            <div className='col-md-12  section-maintitle'>
                <div className="container">
                    <div className="column one">
                        <h1>Build for all types of service businesses</h1>
                    </div>
                </div>
            </div>
            <div className='col-md-12  section-bannerimage'>
            </div>

            <div className='container'>

                <div className='row'>
                    {props.data
                        ? props.data.map((d, i) => (
                            <div key={`${d.title}-${i}`} className='col-xs-7 col-md-2 col-half-offset box custombox'>
                                {' '}
                                <div className='thumbnail customindustries'>
                                    <img src={d.image} alt='...' className='img-fluid' />

                                    <div className='caption'>
                                        <h4 className="title">{d.title}</h4>
                                    </div>
                                </div>
                            </div>
                        ))
                        : 'Loading...'}
                   

                </div>
                <div className='row'>
                <h1>Plus Many More</h1>
                </div>
            </div>
        </div>
    );
}
