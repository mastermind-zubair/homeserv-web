import React, { useState, useEffect } from "react";
import { StaticGoogleMap, Marker, Direction } from "react-static-google-map";

function AddressDirectionMap({ ZoomIn, Address }) {

  const [mapSize, setMapSize] = useState("290x300")
  const { innerWidth: width } = window;

  useEffect(() => {
    if (width > 400 & width < 500) { setMapSize("290x300") }
    else if (width > 500) { setMapSize("500x300") }
  }, [width])


  return (
    <>
      {/* <StaticGoogleMap size={ZoomIn} apiKey="AIzaSyCUnezIP5S-C4qZOf4HiJ51gK0KckxRoFs">
        <Direction
          origin={latlan}
          destination={Address}
        />
      </StaticGoogleMap> */}

      <StaticGoogleMap size={mapSize} zoom={ZoomIn} apiKey="AIzaSyCUnezIP5S-C4qZOf4HiJ51gK0KckxRoFs">
        <Marker location={Address} color="blue" label="C" />
      </StaticGoogleMap>

    </>
  );
}

export default AddressDirectionMap;