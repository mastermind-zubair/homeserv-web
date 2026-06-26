import React from "react";
import { Pie } from "@ant-design/plots";
import { Empty } from "antd";

function DoughnutChartThin({ data, label }) {
  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.9,
    label: {
      type: "inner",
      offset: "-50%",
      content: "",
      style: {
        textAlign: "center",
        fontSize: 10,
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: 36,
        },
        content: label,
      },
    },
    legend: {
      position: "left-top",
      itemWidth: 85,
    },
  };
  if (data === null || data.length === 0) return <Empty />;
  return (
    <div style={{ height: "200px" }}>
      <Pie {...config} />
    </div>
  );
}

export default DoughnutChartThin;
