import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

export const Features = (props) => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 3
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2
    }
  };
  return (
    <div id='team' className='text-center board 
    '>
      <div className='container'>
        <div className='col-md-10 col-md-offset-1 '>
          <h2>Partners</h2>
        </div>
        <div className='row'>
          <Carousel responsive={responsive} infinite={true}
            autoPlay={true}
            autoPlaySpeed={5000} removeArrowOnDeviceType={["tablet", "mobile"]}>
            {props.data
              ? props.data.map((d, i) => (
                <div key={`${d.title}-${i}`} className='col-xs-6 col-md-12'>
                  {' '}
                  <img src={d.icon} />

                </div>
              ))
              : 'Loading...'}
          </Carousel>

        </div>
      </div>
    </div>
  )
}
