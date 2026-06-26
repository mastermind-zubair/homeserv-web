import React from 'react';
import Feature_Image from 'assets/images/Features-Banner-Image.jpg'
export const FeaturesPage = (props) => {
    return (

        <div id="featuresPage" className='text-center'>
            <div className='col-md-12  section-maintitle'>
                <div className="container">
                    <div className="column one">
                        <h1>Super charge your work Flow </h1>
                    </div>
                </div>
            </div>
            {/* <div className='col-md-12  section-subtitle'>
                <h2>Its time to eliminate the guesswork from your phone leads</h2>
            </div> */}
            <div className='col-md-12  section-features-bannerimage'>
          
            </div>
            <div className='container'>

                <div className=' row'>
                    {props.data
                        ? props.data.map((d, i) => (
                            <div key={`${d.title}-${i}`} className='col-xs-9 col-md-3 box'>
                                {' '}
                                <div className='thumbnail customthumbnail'>
                                <i className={d.image} aria-hidden="true" style={{color: "rgb(32 152 248)"}}></i>
                                   
                                    <div className='caption'>
                                        <h4 className="title">{d.title}</h4>
                                        <div className="desc">{d.text}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                        : 'Loading...'}
                </div>
            </div>
        </div>
    );
}

export default FeaturesPage;