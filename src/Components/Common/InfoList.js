import { snakeCaseToTitle } from "Lib/JsHelper";

export const InfoList = ({ obj }) => {
  if (!obj) return;
  // console.log(obj);
  let cols = Object.entries(obj);
  //console.log("cols", cols);
  return cols.map(([key, value]) => {
    return (
      <info-group>
        <info-label>{snakeCaseToTitle(key)}</info-label>
        <info>{value}</info>
      </info-group>
    );
  });
};
