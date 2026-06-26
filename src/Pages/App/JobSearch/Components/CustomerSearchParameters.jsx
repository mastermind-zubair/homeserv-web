import { Row } from "antd";
import React from "react";
import FormUtils from 'Components/Common/FormUtils';
import { useTranslation } from "react-i18next";
const { InfoItem, InfoSelect } = FormUtils;

function CustomerSearchParameters({ data }) {
  const { t } = useTranslation();
  return (
    <>
      <Row>
        <InfoSelect label={t("quick_setup_customer_type_grid_heading_customer_type")} name="customer_type_id" span={8} options={data.customer_types} />
        <InfoItem label={t("quick_setup_office_users_form_first_name")} name="first_name" span={8} />
        <InfoItem label={t("quick_setup_office_users_form_last_name")} name="last_name" span={8} />
      </Row>
      <Row>
        <InfoItem label={t("quick_setup_office_users_form_email")} name="email" span={8} />
        <InfoItem label={t("quick_setup_office_users_form_address")} name="address" span={8} />
        <InfoItem label={t("general_phone")} name="phone" span={8} />
      </Row>
    </>
  );
}

export default CustomerSearchParameters;
