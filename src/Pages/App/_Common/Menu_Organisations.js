import { BankOutlined, DownOutlined } from "@ant-design/icons";
import { Button, Col, Dropdown, Row } from "antd";

import { trackPromise } from "react-promise-tracker";
import { Link, useHistory } from "react-router-dom";
import DefaultService from "Services/API/DefaultService";
import AuthService from "Services/AuthService";
import Context from "Store/Context";

const { useEffect, useContext } = require("react");

const Menu_Organisations = () => {
  const history = useHistory();
  const { userOrgs, setUserOrgs, curOrg, setCurOrg } = useContext(Context);

  useEffect(() => {
    reloadOrganisations();
  }, []);
  useEffect(() => {
    let orgs = userOrgs;
    if (orgs && orgs.length > 0) {
      let co;
      //if curOrg has been deleted or not yet selected by user. select the default one or the very first one..
      if ((curOrg && !orgs.find((o) => o.id === curOrg.id)) || !curOrg) {
        co = orgs.find((o) => o.is_default === true) || orgs[0];

        setCurOrg(co);
      }
    } else {
      setCurOrg(null);
    }
  }, [userOrgs]);

  // useEffect(() => {
  //   setCurOrg(OrganisationManager.GetSelectedOrganisation());
  // }, [userOrgs]);

  const onOrgChanged = (org) => {
    console.log("Organisation selected", org);
    setCurOrg(org);

    history.replace(window.location.pathname);
  };

  const reloadOrganisations = async () => {
    if (!curOrg) {
      let { data: orgs } = await trackPromise(
        AuthService.isOfficer()
          ? DefaultService.Entity_Get(
              "QS_Organisation",
              AuthService.getCurrentOfficer().organisation_id
            )
          : DefaultService.Entity_List("QS_Organisation")
      );

      orgs = !Array.isArray(orgs) ? [orgs] : orgs;

      if (orgs && orgs.length > 0) {
        let co;
        //if curOrg has been deleted or not yet selected by user. select the default one or the very first one..
        if ((curOrg && !orgs.find((o) => o.id === curOrg.id)) || !curOrg) {
          co = orgs.find((o) => o.is_default === true) || orgs[0];

          setCurOrg(co);
        }
      } else {
        setCurOrg(null);
      }

      setUserOrgs(orgs);
    }
  };

  const handleOrgClick = (e) => {
    let orgId = e.key;
    let org = userOrgs && userOrgs.find((o) => o.id === parseInt(orgId));
    if (org) {
      onOrgChanged(org);
    }
  };

  const menuItems = userOrgs
    ? [
        ...userOrgs.map((o) => ({
          key: `${o.id}`,
          label: o.name,
          title: o.name,
          icon: <BankOutlined />,
        })),
        ...(!AuthService.isOfficer()
          ? [
              { type: "divider" },
              {
                key: "manage-organisations",
                label: "Manage Organisations",
                icon: <i className="fas fa-edit link text-bold mr-1"></i>,
              },
            ]
          : []),
      ]
    : [];

  return (
    <>
      {userOrgs && (
        <Row className="ml-3 mr-3 mb-2">
          <Col xs={24} xl={24}>
            <div className="flex" style={{ verticalAlign: "bottom" }}>
              <Link
                to="#"
                style={{ marginLeft: "8px", marginRight: "5px" }}
                className="text-primary"
                onClick={() => {
                  history.push("/app/quick-setup/organisations");
                }}
              >
                <span className="text-smaller">Organisation:</span>
              </Link>

              {/*<Tooltip title="Click here to reload organisation list" className="ml-auto">
                <i className=" fas fa-sync-alt link text-bold text-success" onClick={reloadOrganisations}></i>
              </Tooltip>
              <Tooltip title="Click here to manage your organisations" className="ml-auto">
                <i className=" fas fa-edit link text-bold text-success" onClick={reloadOrganisations}></i>
              </Tooltip> */}

              <Dropdown
                menu={{
                  items: menuItems,
                  onClick: (e) => {
                    if (e.key === "manage-organisations") {
                      history.push("/app/quick-setup/organisations");
                      return;
                    }
                    handleOrgClick(e);
                  },
                  selectedKeys: curOrg ? [`${curOrg.id}`] : [],
                }}
                className="top ml-auto text-bold text-right push-right bg-warning"
                width={150}
                style={{
                  minWidth: "150px",
                  fontSize: "10px",
                  zIndex: "9999990",
                }}
              >
                <Button>
                  <span
                    style={{
                      maxWidth: "110px",
                      fontSize: "10px",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {(curOrg && curOrg.name) || "Please select"}{" "}
                    <DownOutlined />
                  </span>
                </Button>
              </Dropdown>

              {/* {(userOrgs && userOrgs.length > 0 && (
                <Dropdown
                  menu={{ items: menuItems }}
                  className="ml-auto text-bold text-right push-right"
                  width={150}
                  style={{ minWidth: "150px", fontSize: "10px" }}
                >
                  <Button style={{ fontSize: "10px" }}>
                    {(curOrg && curOrg.name) || "Org"} <DownOutlined />
                  </Button>
                </Dropdown>
              )) || (
                <Link to="/app/quick-setup/organisations">
                  <Tooltip title="Click here to setup your first organisation">
                    <div className="ml-auto text-right text-danger">Not found</div>
                  </Tooltip>
                </Link>
              )} */}
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Menu_Organisations;
