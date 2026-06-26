import _ from "lodash";

export function HandlePathChanged(
  app,
  path,
  nav,
  curModule,
  curPage,
  curSubPage
) {
  let p = path.split("/");
  let module, page, subPage;

  //1st level
  if (p && p.length >= 3 && p[2] !== "") {
    let modulePath = p[2] || "dashboard";
    module = nav.filter((n) => n.path === `/${app}/` + modulePath)[0];
    if (!curModule || (module && module.path !== curModule.path)) {
      curModule = module;
      //setRemoveTitle(module.remove_title && module.remove_title === true);
    }

    //if navMenu not found thentry to fetch from part of url
    if (!module) {
      curModule = nav.filter((n) =>
        n.path.startsWith(`/${app}/` + modulePath + "/")
      )[0];
      module = curModule;
    }
  }

  //2nd level
  if (p && p.length >= 4 && p[3] !== "") {
    if (module && module.items) {
      page = _.find(module.items, { path: path });
      if (page) {
        if (!curPage || page.path !== curPage.path) {
          curPage = page;
        }
      } else {
        //3rd level
        let subMenu = _.find(module.items, { items: [{ path: path }] });
        subPage = subMenu && _.find(subMenu.items, { path: path });

        curPage = subMenu;
        curSubPage = subPage;
      }
    }
  }

  return { module: curModule, page: curPage, subPage: curSubPage };
}
