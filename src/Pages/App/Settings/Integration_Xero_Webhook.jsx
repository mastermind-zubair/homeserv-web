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

const Integration_Xero_Webhook = (props) => {
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
    // const p = qs.parse(location.search, { ignoreQueryPrefix: true });
    // setParams(p);
    // await trackPromise(connect(p));
  }, []);

  return (
    <>
      <h1>XERO Integration</h1>
    </>
  );
};

export default Integration_Xero_Webhook;
