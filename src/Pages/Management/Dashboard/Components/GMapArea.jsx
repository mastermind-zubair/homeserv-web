import React, { useEffect, useRef } from 'react';
import AuthService from "Services/AuthService";

function GMapArea({ jobs }) {
    const gmapRef = useRef();
    const ref = useRef();
    const handleZoomChanged = () => { 
        const { lat, lng } = gmapRef.current.getCenter();
        AuthService.setMapParams({ zoom: gmapRef.current.getZoom(), center: { lat: lat(), lng: lng()}});
    }
    const handleCenterChanged = () => { 
        const { lat, lng } = gmapRef.current.getCenter();
        AuthService.setMapParams({ zoom: gmapRef.current.getZoom(), center: { lat: lat(), lng: lng()}});
    }
    const map_style = {
        width: '100%',
        height: '500px'
      }

    useEffect(() => {
        var map_params = AuthService.getMapParams()
          
        if(map_params === null){ 
          map_params = {zoom: 5, center:{ lat: -25.344, lng: 131.036 } };
        }

        gmapRef.current = window.displayMap(ref.current, 
            map_params.center, 
            map_params.zoom, 
            jobs, 
            { handleCenterChanged, handleZoomChanged });
          }, [jobs]);
    return (
            <div ref={ref} style={map_style} />
    );
}

export default GMapArea;
