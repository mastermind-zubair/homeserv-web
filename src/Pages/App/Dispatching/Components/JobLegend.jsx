import { Badge } from "antd";
import React from "react";

function JobLegend({ data }) {
  return (
    <div>
      <br /> <b>Job status colors: </b>
      {data.map((item, index) => {
        return (
          <>
            <Badge
              key={"jl_"+index}
              count={item.name}
              style={{
                backgroundColor: item.bg_color,
                color: "#fff",
                fontSize: "smaller",
              }}
            />
            {"  "}
          </>
        );
      })}
    </div>
  );
}

export default JobLegend;
