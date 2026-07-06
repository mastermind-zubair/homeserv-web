import {
  Avatar,
  Badge,
  Col,
  Dropdown,
  List,
  Menu,
  Popover,
  Row,
  Skeleton,
  Space,
  Tooltip,
} from "antd";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Context from "Store/Context";
import logo from "assets/images/logo.png";
import logo_icon from "assets/images/logo_icon.svg";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Profile from "../Profile";
import DefaultService from "Services/API/DefaultService";
import moment from "moment";

const NavHeader = ({ layout, modules, curModule, onMenuButtonClicked }) => {
  const history = useHistory();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { t } = useTranslation();
  const { curOrg: organisation } = useContext(Context);

  const trimLabel = (label) => {
    var maxLength = 15;
    if (label.length > maxLength) {
      return label.substring(0, maxLength - 3) + "...";
    }
    return label;
  };
  useEffect(() => {
    //setCurNavItem(curModule);
  }, [curModule]);

  const onTopMenuChanged = (path) => {
    history.push(path);
  };

  const loadNotifications = useCallback(
    async (organisation) => {
      if(!organisation) return;
      const result = await DefaultService.GetMyNotifications({
        organisation_id: organisation.id,
      });

      if (result && result.data) {
        setNotifications(result.data);
      }
    },
    [organisation]
  );

  useEffect(() => {
    loadNotifications(organisation);
  }, [organisation]);
  const menu = (
    <Menu onClick={(e) => onTopMenuChanged(e.key)}>
      {modules.map((nav) => {
        return (
          <Menu.Item key={`${nav.path}`}>
            <div>
              <i className={nav.icon} style={{ fontSize: "18px" }}></i>
              <span style={{ float: "right", marginLeft: "10px" }}>
                {t(nav.label_key)}
              </span>
            </div>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const notificationsContent = (
    <>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <>
            <List.Item>
              
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
              <div>{moment(item.date).fromNow()}</div>
              
            </List.Item>
          </>
        )}
      ></List>
    </>
  );
  return (
    <>
      <Row align="middle" justify="start" wrap={false}>
        <Col span={24}>
          <div className="flex app-nav-header">
            <div
              className="logo"
              style={{
                width: layout === "full" ? "225px" : "70px",
                borderRight: "solid 1px #eee",
                flex: "0 0 auto",
              }}
            >
              <Link to="/app/dashboard">
                {(layout === "full" && <img src={logo} />) || (
                  <img src={logo_icon} style={{ width: "65%" }} />
                )}
              </Link>
            </div>
            <Space size={layout === "full" ? 8 : 2} className="app-nav-menu">
              {layout !== "overlay" &&
                modules.map((nav) => {
                  return (
                    nav.show && (
                      <Tooltip
                        key={nav.path}
                        placement="bottomLeft"
                        title={t(nav.label_key)}
                      >
                        <Link
                          key={`tp-nav-${nav.label}`}
                          to={nav.path}
                          onClick={() => {
                            onTopMenuChanged(nav.path);
                          }}
                        >
                          <div
                            style={{
                              alignItems: "center",
                              textAlign: "center",
                            }}
                            className={`${
                              layout === "mini" ? "top-menu-small" : "top-menu"
                            }  ${
                              nav.path === (curModule && curModule.path) ||
                              nav.path.startsWith(curModule && curModule.path)
                                ? "top-menu-active"
                                : ""
                            }`}
                          >
                            <i
                              className={nav.icon}
                              style={{
                                fontSize: layout === "mini" ? "16px" : "24px",
                              }}
                            ></i>
                            {layout === "full" && (
                              <div>{trimLabel(t(nav.label_key))}</div>
                            )}
                          </div>
                        </Link>
                      </Tooltip>
                    )
                  );
                })}
            </Space>
            {layout === "overlay" && (
              <div style={{ marginTop: "8px" }}>
                <Space size={2}>
                  <Dropdown.Button overlay={menu}>
                    {curModule && t(curModule.label_key)}
                  </Dropdown.Button>

                  {/* <Tooltip title="Menu Options"> */}
                  <Button
                    className="top-menu-button bg-success ml-2"
                    icon={<MenuOutlined />}
                    shape="circle"
                    onClick={() => onMenuButtonClicked(true)}
                    size={40}
                  />
                  {/* </Tooltip> */}
                </Space>
              </div>
            )}

            <div
              className="ml-auto"
              style={{ textAlign: "right", marginTop: "0px", flex: "0 0 auto" }}
            >
              <Row wrap={false} align="middle">
                <Col>
                  <Popover
                    placement="bottomRight"
                    title={`Notifications (${notifications.length})`}
                    trigger={["click"]}
                    open={showNotifications}
                    onOpenChange={(e) => setShowNotifications(e)}
                    content={notificationsContent}
                    overlayStyle={{ width: "400px" }}
                  >
                    <Badge
                      shape="square"
                      count={notifications.length}
                      overflowCount={99}
                      style={{ marginRight: "10px" }}
                    >
                      <Avatar
                        shape="square"
                        size="large"
                        icon={<i className="fa fa-bell"></i>}
                      />
                    </Badge>
                  </Popover>
                </Col>
                <Col>
                  <Profile layout={layout} onLinkClicked={onTopMenuChanged} />
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};
export default NavHeader;
