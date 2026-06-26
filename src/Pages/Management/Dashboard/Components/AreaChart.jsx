import React from 'react';
import { Area } from '@ant-design/plots';
import { Empty } from 'antd';


function AreaChart({ data, xField, yField }) {
    const config = {
        data,
        xField,
        yField,
        xAxis: {
          range: [0, 1],
        },
      };
    if(data === null || data.length === 0) return (<Empty />);
    return (
    <div style={{ height: '200px'}}>
        <Area {...config} />
    </div>
);
}

export default AreaChart;