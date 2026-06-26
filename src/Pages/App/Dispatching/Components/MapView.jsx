import { Modal } from 'antd';
import React, { useEffect, useRef } from 'react';
import AuthService from "Services/AuthService";

function MapView({ visible, handleCancel }) {
    const gmapRef = useRef();
    const ref = useRef();
    const map_style = {
        width: '100%',
        height: '800px'
    }
    useEffect(() => {
        if(ref.current === null) return;
        var map_params = AuthService.getMapParams()
          
        if(map_params === null){ 
          map_params = {zoom: 5, center:{ lat: -25.344, lng: 131.036 } };
        }

        gmapRef.current = window.displayMap(ref.current, 
            map_params.center, 
            map_params.zoom, 
            [], 
            { handleCenterChanged: () => {}, handleZoomChanged: () => {} }
            );
    }, [ref]);
    return (
        <>
          <Modal 
          title="Technician Locations" 
          visible={visible} 
          onCancel={handleCancel}
          onOk={handleCancel}
          width={1000}
          >
            <div ref={ref} style={map_style} />
          </Modal>        
        </>
    );
}

export default MapView;