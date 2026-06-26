import React from 'react';
import { Pie } from '@ant-design/plots';

function DoughnutChartThinMobile({ data, label }) {
  const config = {
    appendPadding: 0,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.8,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '',
      style: {
        textAlign: 'center',
        fontSize: 10,
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
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: 30,
        },
        content: label,
      },
    },
    legend: {
      position: 'left-top',
    }
  };
  return (
    <div style={{ height: '200px' }}>
      <Pie {...config} />
    </div>
  );
}

export default DoughnutChartThinMobile;