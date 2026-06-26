import { Col, Descriptions, Row } from "antd";
import moment from "moment";
import React from "react";
import { getCurrentSubscription } from "Services/AuthService";

const Accounts_Billing = ({ dateFormat }) => {
  const subscription = getCurrentSubscription();
  console.log("subscription: ", subscription);
  if (subscription === null) {
    return (
      <h3>
        Unable to retrieve license information. Please try after re-login.
      </h3>
    );
  }
  return (
    <>
      <Row>
        <Col xs={24} xl={24}>
          <Descriptions bordered>
            <Descriptions.Item label="License" span={3}>
              {subscription.license ? subscription.license.name : ""}
            </Descriptions.Item>
            <Descriptions.Item label="Expiry" span={3}>
              {subscription.expires_at
                ? moment(subscription.expires_at).format(dateFormat)
                : ""}
            </Descriptions.Item>
            <Descriptions.Item label="Status" span={3}>
              {subscription.is_active ? "Active" : "Inactive"}
            </Descriptions.Item>
            <Descriptions.Item label="Max Technicians" span={3}>
              {subscription.max_users}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </>
  );
};

export default Accounts_Billing;
