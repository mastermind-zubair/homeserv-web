import React from "react";

function Loader() {
  //console.log("Loader");
  return (
    <div className="animated fadeIn pt-1 text-center">
      <div className="loader center fa-3x">
        {/* <i className="fa fa-cog fa-spin" /> */}
        <i className="fa fa-spinner fa-pulse"></i>
      </div>
    </div>
  );
}

export default Loader;
