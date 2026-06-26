import React from 'react';
import {AreaMap} from '@ant-design/maps';
import AuthService from "Services/AuthService";

function MapArea({ data }) {

    const color = [
        'rgb(255,255,217)',
        'rgb(237,248,177)',
        'rgb(199,233,180)',
        'rgb(127,205,187)',
        'rgb(65,182,196)',
        'rgb(29,145,192)',
        'rgb(34,94,168)',
        'rgb(12,44,132)',
      ];
    var config = {
        onReady: graph => {          
          var map_params = AuthService.getMapParams()
          
          if(map_params === null){ 
            map_params = {zoom: 3, center:{ lat: -20.1026, lng: 33.78}};
          }

          setTimeout(() => {
            graph.getMap().setZoom(map_params.zoom);
            graph.getMap().setCenter(map_params.center);
          },100);
          graph.on('zoomend', evt => {
            AuthService.setMapParams({ zoom: graph.getMap().getZoom(), center: graph.getMap().getCenter()});
          });
          graph.on('moveend', evt => {
            AuthService.setMapParams({ zoom: graph.getMap().getZoom(), center: graph.getMap().getCenter()});
          });
        },
        map: {
            type: 'mapbox',
            style: 'blank',
            pitch: 0,
            token: process.env.REACT_APP_MAPBOX_TOKEN
          },
          source: {
            data: data,
            parser: {
              type: 'geojson',
            },
          },
          autoFit: true,
          color: {
            field: 'jobs',
            value: color,
            scale: {
              type: 'quantile',
            },
          },
          style: {
            opacity: 1,
            stroke: 'rgb(93,112,146)',
            lineType: 'dash',
            lineDash: [2, 2],
            lineWidth: 0.6,
            lineOpacity: 1,
          },
          state: {
            active: true,
            select: true,
          },
          tooltip: {
            items: ['name', 'jobs'],
          },
          zoom: {
            position: 'bottomright',
          },
          legend: {
            position: 'bottomleft',
          },      
    };
    return (
        <div style={{height: '500px'}}>
            <AreaMap {...config} />
        </div>
    );
}

export default MapArea;