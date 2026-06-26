import React, { useEffect, useState } from "react";

// ES Modules
import parse from 'html-react-parser';
export const Header = (props) => {

  return (
    <header id='header' >

      <div className="">
         <video className='boardcss' id="myVideo" autoPlay muted loop playsInline>
        <source src="/videos/all-videos.mp4" type="video/mp4" />

      </video>
        <div className="video-overlay">
          <h1>
            {props.data ? parse(props.data.title) : 'Loading'}
            <span></span>
          </h1>
          <p>{props.data ? parse(props.data.paragraph) : 'Loading'}</p>
          <a
            href='/pricing'
            className='btn btn-custom btn-lg page-scroll'
          >
            Get Started
          </a>{' '}
        </div>
      </div>






    </header>
  )
}
