import { Menu, Space, Tooltip } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { Fragment, useContext, useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import Navigation from "Data/Navigation.js";
import AuthService from "Services/AuthService";

import Menu_Organisations from "Pages/App/_Common/Menu_Organisations";
import Context from "Store/Context";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { memo } from "react";

const SideMenu = ({ topNav, collapsed }) => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  let {
    curOrg: organisation,
    setUser,
    setToken,
    officer,
  } = useContext(Context);
  const [menu, setMenu] = useState();
  const [module, setModule] = useState();
  const [subMenuKeys, setSubMenuKeys] = useState();

  useEffect(() => {
    let navMenu = null;
    const path = window.location.pathname;

    let module = path.split("/").length >= 3 ? path.split("/")[2] : "";

    if (module === "") {
      navMenu = Navigation.filter((n) => n.path === "/app/dashboard");
    } else if (module !== "") {
      navMenu = Navigation.filter((n) => n.path === "/app/" + module)[0];
    }

    //if navMenu not found thentry to fetch from part of url
    if (!navMenu) {
      navMenu = Navigation.filter((n) =>
        n.path.startsWith("/app/" + module + "/")
      )[0];
    }

    setModule(module);
    setMenu(navMenu);

    let subMenuItem =
      navMenu &&
      navMenu.items &&
      navMenu.items.find(
        (n) => n.items && n.items.some((item) => item.path === path)
      );
    setSubMenuKeys((subMenuItem && [subMenuItem.path]) || []);
  }, [location.pathname]);

  const handleMenuClick = (e) => {
    let path = e.key;
    if (path === "logout") {
      AuthService.logout();
      setUser(null);
      setToken(null);
      window.location.href = "/session-expired";
      return;
    }
    setSubMenuKeys(path);
    history.push(path);
  };

  function getHardCodedOpenSubMenu() {
    let openSubmenu = [
      location.pathname.indexOf("fleet") > 0
        ? "/app/settings/fleet-management"
        : location.pathname.indexOf("rate") > 0
        ? "/app/settings/rate-management"
        : location.pathname.indexOf("timesheet") > 0 ||
          location.pathname.indexOf("payroll") > 0
        ? "/app/reports/timesheets"
        : "",
    ];
    return openSubmenu;
  }
  return (
    <>
      <div className="mt-2">
        <Menu_Organisations />
        <Tooltip placement="right" title={menu && menu.label}>
          <div
            className={`bg-primary sidebar-menu-head ${
              collapsed ? "sidebar-menu-head-collaped" : ""
            }`}
          >
            {menu && menu.show && (
              <Link to={menu.path}>
                <Space>
                  <i className={menu.icon} />
                  {menu.label === "Setup" ? (
                    <>
                      {(organisation && (
                        <div style={{ fontSize: "13px" }}>
                          <span className="text-warning">
                            {organisation.name}
                          </span>{" "}
                          <span className="text-smaller">(Setup)</span>
                        </div>
                      )) || (
                        <span className="text0smaller">
                          No organisation selected
                        </span>
                      )}
                    </>
                  ) : (
                    t(menu.label_key)
                  )}
                </Space>
              </Link>
            )}
          </div>
        </Tooltip>
        {/* <PerfectScrollbar> */}
        <div className={`sidebar-menu-box`}>
          {organisation ? (
            <Menu
              key={location.pathname}
              theme="light"
              mode="inline"
              onClick={handleMenuClick}
              selectedKeys={[window.location.pathname]}
              defaultSelectedKeys={[window.location.pathname]}
              defaultOpenKeys={getHardCodedOpenSubMenu()}
            >
              {menu &&
                menu.items &&
                menu.show &&
                menu.items.map((m) => {
                  return (
                    <Fragment key={m.path}>
                      {m.items && m.show && (
                        <SubMenu
                          key={m.path}
                          title={
                            <span style={{ marginLeft: "10px" }}>
                              {t(m.label_key)}
                            </span>
                          }
                          icon={getIcon(m.icon)}
                        >
                          {m.items.map((sm) => {
                            return (
                              <Fragment key={sm.path}>
                                {sm.show && (
                                  <Menu.Item
                                    key={`${sm.path}`}
                                    icon={getIcon(m.icon)}
                                  >
                                    {t(sm.label_key)}
                                  </Menu.Item>
                                )}
                              </Fragment>
                            );
                          })}
                        </SubMenu>
                      )}
                      {!m.items && m.show && (
                        <Menu.Item
                          key={`${m.path}`}
                          title={m.label}
                          icon={getIcon(m.icon)}
                        >
                          {t(m.label_key)}
                        </Menu.Item>
                      )}
                    </Fragment>
                  );
                })}
              {/* <Menu.Item key="logout" title="Log Out" icon={getIcon("fas fa-sign-out-alt")} className="text-danger text-bold">
          Log Out
        </Menu.Item> */}
            </Menu>
          ) : (
            <span>Please select an organisation first</span>
          )}
        </div>
        <div style={{ marginBottom: "200px" }}>
          {/* NOTE: Empty div to adjust scroll bar height. DO NOT REMOVE IT */}
        </div>
        {/* </PerfectScrollbar> */}
      </div>
    </>
  );
};

export default memo(SideMenu);

function getIcon(ico) {
  return <i className={ico} />;
}
