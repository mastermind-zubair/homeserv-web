import React from 'react';
import { Pie } from '@ant-design/plots';

function PlotChart({ data }) {

  const config = {
    appendPadding: -5,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.90,

    legend: {
      position: 'left-top',
    },
    label: {
      type: 'inner',
      //content: '${value}',
      content: ({ value }) => `${value.toLocaleString('en-AU', { style: "currency", currency: "AUD" })}`,
      offset: '-95%',
      autoRotate: false,
      rotate: 0,
      style: {
        fill: '#000',
        fontSize: 13,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    tooltip: {
      showCrosshairs: true,
      showMarkers: true,
    }
  };
  return (
    <div style={{ height: '200px' }}>
      <Pie {...config} />
    </div>
  );
}

export default PlotChart;