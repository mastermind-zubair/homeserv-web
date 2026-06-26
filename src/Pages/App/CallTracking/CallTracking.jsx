import React from "react";

const CallTracking = (props) => {
  return (
    <>
      <iframe 
      src="https://calls.servicevault.com/login" 
      title="call tracking" 
      style={{width: '100%', height: '800px'}} frameBorder={0} 
      />
    </>
  );
};

export default CallTracking;
