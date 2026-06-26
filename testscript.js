const fs = require("fs");
const time_zone = require("./src/Data/timezone.json");

var all_time_zone = time_zone.reduce((acc, cur) => {
  if (acc["" + cur.offset] === undefined) {
    acc["" + cur.offset] = [];
  }
  acc["" + cur.offset].push(...cur.utc.filter((x) => !x.startsWith("Etc/GMT")));
  return acc;
}, {});

// var all_time_zone = time_zone.reduce((acc, cur) => {
//   acc.push(
//     ...cur.utc
//       .filter((x) => !x.startsWith("Etc/GMT"))
//       .map((x) => ({
//         label: `${x} (GMT${cur.offset >= 0 ? "+" : ""}${cur.offset})`,
//         value: cur.offset,
//       }))
//   );
//   return acc;
// }, []);
// all_time_zone.sort((a, b) => a.label.localeCompare(b.label));

console.log(all_time_zone);
fs.writeFileSync(
  "./src/Data/timezone_only_1.json",
  JSON.stringify(all_time_zone)
);
// var all_lang = {};
// const genKey = (key) => key.toLowerCase().split(" ").join("_");

// var all_navi = Navigation.map((v) => {
//   var lbl = genKey(v.label);
//   const label_key = `side_menu_navigation_${lbl}`;
//   all_lang[label_key] = v.label;
//   var new_v = { ...v, label_key };
//   if (new_v.items !== undefined)
//     new_v.items = v.items.map((w) => {
//       var sb_lbl = genKey(w.label);
//       const sub_label_key = `side_menu_navigation_${lbl}_sub_${sb_lbl}`;
//       all_lang[sub_label_key] = w.label;
//       var new_w = { ...w, label_key: sub_label_key };
//       return new_w;
//     });
//   return new_v;
// });

// fs.writeFileSync("nav_with_keys.json", JSON.stringify(all_navi));
// fs.writeFileSync("language_keys.json", JSON.stringify(all_lang));
