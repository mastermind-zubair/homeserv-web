import React from 'react';
import { Area } from '@ant-design/plots';
import { Empty } from 'antd';

function MultipleAreaChart({ data }) {
    var config = {
        data,
        xField: 'year',
        yField: 'value',
        seriesField: 'category',
        color: ['#6897a7', '#8bc0d6', '#60d7a7', '#dedede', '#fedca9', '#fab36f', '#d96d6f'],
        xAxis: {
          type: 'time',
          mask: 'YYYY',
        },
        yAxis: {
          label: {
            formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
          },
        },
        legend: {
          position: 'top',
        },
    };
    if(data === null || data.length === 0) return (<Empty style={{height: '500px'}} />);
    return (
        <div style={{height: '500px'}}>
            <Area {...config} />
        </div>
    );
}

export default MultipleAreaChart;