import { BackwardOutlined } from "@ant-design/icons";
import { Button, Col, Row, Select } from "antd";
import axios from "axios";
import environment from "Environment";
import { getBase64 } from "Lib/JsHelper";
import React, { useEffect, useState } from "react";
import { trackPromise } from "react-promise-tracker";
import { Link, useHistory, useLocation } from "react-router-dom";
import DefaultService from "Services/API/DefaultService";
import BaseApiService from "Services/BaseApiService";
import { alertify, notify } from "Services/ToastService";
// import { XeroClient } from "xero-node";

const Integration_Xero = (props) => {
  const history = useHistory();
  const location = useLocation();

  const [params, setParams] = useState();
  const [accessToken, setAccessToken] = useState();
  const [linkAccountId, setLinkAccountId] = useState();
  const [allTenants, setAllTenants] = useState();
  const [selectedTenant, setSelectedTenant] = useState();

  const client_id = environment.XERO_CLIENT_ID;
  const client_secret = environment.XERO_CLIENT_SECRET2;
  const client_callback_url = environment.XERO_CALLBACK_URL;
  const scope =
    "offline_access openid profile email accounting.transactions accounting.contacts accounting.contacts.read";

  /* //TOKEN CALL RETURNS
  access_token:   The JWT token used to call the API.
  id_token:       The token containing user identity details (only returned if OpenID Connect scopes are requested).
  expires_in:     The amount of seconds until the access token expires.
  token_type:     Bearer
  refresh_token:  The token used to refresh the access token once it has expired (only returned if the offline_access scope is requested).
  */

  const qs = require("qs");

  useEffect(async () => {
    const p = qs.parse(location.search, { ignoreQueryPrefix: true });
    setParams(p);
    await trackPromise(connect(p));
  }, []);

  const connect_new = async (p) => {
    // const xero = new XeroClient({
    //   clientId: client_id,
    //   clientSecret: client_secret,
    //   redirectUris: [client_callback_url],
    //   scopes: scope.split(" "),
    //   state: p.state, // custom params (optional)
    //   httpTimeout: 5000, // ms (optional)
    // });
    //let consentUrl = await xero.buildConsentUrl();
    //const tokenSet = await xero.apiCallback(window.location.pathname);
    //console.log("XERO token", tokenSet);
  };
  const connect = async (p) => {
    var base64 = require("base-64");

    if (!p || !p.state) {
      notify("Failed to receive valid Ids from integration software", false);
      return;
    } else {
      notify("Successfully integrated with your XERO account", true);
    }

    let {
      data: linkAcc,
      status,
      message,
    } = await trackPromise(
      DefaultService.Entity_Get("Settings_Link_Accounting_Software", p.state)
    );

    if (linkAcc) {
      let authorization_header = `Basic ${base64.encode(
        client_id + ":" + client_secret
      )}`;
      const {
        data: token,
        status: tokenStatus,
        message: tokenMessage,
      } = await BaseApiService.RawRequest(
        "post-form-urlencoded",
        "https://identity.xero.com",
        "/connect/token",
        `grant_type=authorization_code&code=${p.code}&redirect_uri=${client_callback_url}`,
        {
          Authorization: authorization_header,
          "Access-Control-Allow-Origin": "*",
        }
      );
      notify(tokenMessage, tokenStatus);

      /* //TOKEN CALL RETURNS
  access_token:   The JWT token used to call the API.
  id_token:       The token containing user identity details (only returned if OpenID Connect scopes are requested).
  expires_in:     The amount of seconds until the access token expires.
  token_type:     Bearer
  refresh_token:  The token used to refresh the access token once it has expired (only returned if the offline_access scope is requested).
  */

      if (tokenStatus) {
        setAccessToken(token.access_token);
        setLinkAccountId(p.state);

        // let access_token = token.access_token;
        // let id_token = token.id_token;

        // const { data } = await trackPromise(
        //   DefaultService.ThirdParty_GetXeroConnections(token.access_token)
        // );

        const { data: tenants, status } = await BaseApiService.RawRequest(
          "GET",
          "https://api.xero.com",
          "/connections",
          `grant_type=authorization_code&code=${p.code}&redirect_uri=${client_callback_url}`,
          {
            Accept: "application/json",
            Authorization: `Bearer ${token.access_token}`,
            "Access-Control-Allow-Origin": "*",
          }
        );

        if (tenants) {
          console.log("tenants", tenants);

          const allTenants = tenants.map((t) => {
            if (t.tenantType === "ORGANISATION") {
              return { value: t.tenantId, label: t.tenantName };
            }
          });

          setAllTenants(allTenants);
        }
      } else {
        notify("No Access Token found", false);
      }
    }
  };

  const handleImportContacts = async () => {
    console.log("selectedTenant", selectedTenant);
    console.log("token", accessToken);
    console.log("link_accounting_software", linkAccountId);

    if (selectedTenant) {
      // const { data, status, message } = await trackPromise(
      //   DefaultService.ThirdParty_ImportContacts(linkAccountId, {
      //     tenantId: selectedTenant,
      //     token,
      //   })
      // );
      const { data, status, message } = await BaseApiService.RawRequest(
        "GET",
        "https://api.xero.com/api.xro/2.0",
        "/Contacts",
        null,
        {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Xero-Tenant-Id": selectedTenant,
          "Access-Control-Allow-Origin": "*",
        }
      );
      alertify(message, status, 5000);
    } else {
      notify("You must select a XERO organisation first", false);
    }
  };

  const handleExportTransactions = async () => {
    if (selectedTenant) {
      // const { data, status, message } = await trackPromise(
      //   DefaultService.ThirdParty_ExportTransactions(linkAccountId, {
      //     tenantId: selectedTenant,
      //     accessToken,
      //   })
      // );
      const { data, status, message } = await BaseApiService.RawRequest(
        "GET",
        "https://api.xero.com",
        "/transactions",
        null,
        {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Access-Control-Allow-Origin": "*",
        }
      );
      alertify(message, status, 5000);
    } else {
      notify("You must select a XERO organisation first", false);
    }
  };

  return (
    <>
      <h1>XERO Integration</h1>
      {/* <h4>Params:</h4>
      code: {params && params.code}
      <br />
      scope: {params && params.scope}
      <br />
      state: {params && params.state}
      <br />
      session_state: {params && params.session_state}
      <br />

      <br />
      <br />
      <h4>Token: </h4>
      token.access_token: {token && token.id_token}
      <br /> */}
      <div className="ml-auto mr-auto" style={{ width: "500px" }}>
        <Row gutter={(20, 20)} className="mb-5 mt-5">
          <Col span={24}>
            Select your company from XERO:{" "}
            <Select
              style={{ width: "170px" }}
              options={allTenants}
              onChange={(v) => {
                setSelectedTenant(v);
              }}
            />
            <br />
            <br />
          </Col>
        </Row>
        <Row gutter={(20, 20)} className="mt-5 mb-5">
          <Col>
            {" "}
            <Button
              onClick={handleImportContacts}
              style={{ fontSize: "18px", height: "60px" }}
              className="bg-success"
              disabled={!selectedTenant}
            >
              Import Contacts
            </Button>
          </Col>
          <Col>
            {" "}
            <Button
              onClick={handleExportTransactions}
              style={{ fontSize: "18px", height: "60px" }}
              className="bg-info"
              disabled={!selectedTenant}
            >
              Publish Invoices
            </Button>
          </Col>
        </Row>
        <Row gutter={(20, 20)} className="mt-5 mb-5">
          <Col span={24} className="text-large">
            <Link to="/app/settings/link-accounting-software">
              <BackwardOutlined /> Close
            </Link>
          </Col>
        </Row>
        <Row>
          <Col>
            <b>Access Token:</b> {accessToken}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Integration_Xero;
