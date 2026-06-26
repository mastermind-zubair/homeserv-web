import {
  CalendarOutlined,
  FieldTimeOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Descriptions, Tag } from "antd";
import { ProfilePhoto } from "Components/Common/Images";
import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";

function TechnicianDetails({ data }) {
  const { t } = useTranslation();
  return (
    <>
      <Row>
        <Col span={6}>
          <ProfilePhoto filename={data.profile_pic} width={150} />
        </Col>
        <Col span={18}>
          <Descriptions bordered title={t("general_technician")}>
            <Descriptions.Item span={3} label={t("general_name")}>
              {data.display_name}
            </Descriptions.Item>
            <Descriptions.Item
              span={3}
              label={t("quick_setup_office_users_form_address")}
            >
              {data.address}
            </Descriptions.Item>
            <Descriptions.Item
              span={3}
              label={t("quick_setup_sub_contractors_form_mobile_number")}
            >
              {data.mobile_number}
            </Descriptions.Item>
            <Descriptions.Item span={3} label={t("general_phone")}>
              {data.phone_number}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </>
  );
}

function TeamDetails({ data }) {
  const { t } = useTranslation();
  var manager = data.members.filter((m) => m.is_manager);

  if (manager.length === 0) manager = data.members[0];
  else manager = manager[0];

  return (
    <>
      <Row>
        <Col span={6}>
          <ProfilePhoto filename={manager.profile_pic} width={150} />
        </Col>
        <Col span={18}>
          <Descriptions bordered title={`Team: ${data.name}`}>
            <Descriptions.Item span={3} label={t("general_total_members")}>
              {data.members.length}
            </Descriptions.Item>
            <Descriptions.Item span={3} label={t("general_team_manager_name")}>
              {manager.display_name}
            </Descriptions.Item>
            <Descriptions.Item
              span={3}
              label={t("quick_setup_office_users_form_address")}
            >
              {manager.address}
            </Descriptions.Item>
            <Descriptions.Item
              span={3}
              label={t("quick_setup_sub_contractors_form_mobile_number")}
            >
              {manager.mobile_number}
            </Descriptions.Item>
            <Descriptions.Item span={3} label={t("general_phone")}>
              {manager.phone_number}
            </Descriptions.Item>
            <Descriptions.Item span={3} label={t("general_members")}>
              {data.members.map((m) => (
                <Tag color={m.is_manager ? "gold" : "blue"}>
                  {m.display_name}
                </Tag>
              ))}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </>
  );
}

function JobCardSummary({ job, dateFormat }) {
  const { t } = useTranslation();
  const format_mins = (mins) => {
    if (mins < 60) return `${mins} ${t("general_mins")}`;
    else
      return `${Math.floor(mins / 60)} ${t("general_hours")} ${mins % 60} ${t(
        "general_mins"
      )}`;
  };
  if (job === null) return <>Loading job...</>;
  return (
    <>
      <Row>
        <Col span={12}>
          <Card title={t("general_attributes")}>
            <Descriptions bordered title={t("general_attributes")}>
              <Descriptions.Item label={t("general_job_status")} span={3}>
                {job.job_status.admin_status}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card title={t("general_job_efficiency")}>
            <Descriptions bordered title={t("general_efficiency_matrix")}>
              <Descriptions.Item label={t("general_quoting_time")} span={3}>
                {format_mins(job.efficiency_matrix.quoting_time_mins)}
              </Descriptions.Item>
              <Descriptions.Item label={t("general_labour_time")} span={3}>
                {format_mins(job.efficiency_matrix.labour_time_mins)}
              </Descriptions.Item>
              <Descriptions.Item label={t("general_total_time")} span={3}>
                {format_mins(job.efficiency_matrix.total_time_mins)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <Row>
        {job.contact_address !== null && (
          <Col span={12}>
            <Card title={t("general_client_details")}>
              <Descriptions bordered title={t("general_contact_address")}>
                <Descriptions.Item
                  span={3}
                  label={t("quick_setup_office_users_form_first_name")}
                >
                  {job.contact_address.first_name}
                </Descriptions.Item>
                <Descriptions.Item
                  span={3}
                  label={t("quick_setup_office_users_form_last_name")}
                >
                  {job.contact_address.last_name}
                </Descriptions.Item>
                <Descriptions.Item span={3} label={t("general_country")}>
                  {job.contact_address.country}
                </Descriptions.Item>
                <Descriptions.Item span={3} label={t("general_state")}>
                  {job.contact_address.state}
                </Descriptions.Item>
                <Descriptions.Item span={3} label={t("general_city")}>
                  {job.contact_address.city}
                </Descriptions.Item>
                <Descriptions.Item span={3} label={t("general_postal_code")}>
                  {job.contact_address.postal_code}
                </Descriptions.Item>
                <Descriptions.Item
                  span={3}
                  label={t("quick_setup_office_users_form_address")}
                >
                  {job.contact_address.line_1} {job.contact_address.line_2}
                </Descriptions.Item>
                <Descriptions.Item span={3} label={t("general_GPS_location")}>
                  <PushpinOutlined /> {job.job_site_lat}, {job.job_site_lng}
                </Descriptions.Item>
                <Descriptions.Item
                  span={3}
                  label={t("quick_setup_sub_contractors_form_mobile_number")}
                >
                  {job.contact_address.mobile}
                </Descriptions.Item>
                <Descriptions.Item span={3} label={t("general_phone")}>
                  {job.contact_address.phone}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        )}
        <Col span={12}>
          <Card title={t("general_job_details")}>
            <Descriptions bordered title={t("general_job_Info")}>
              <Descriptions.Item span={3} label={t("general_job_id")}>
                {job.id}
              </Descriptions.Item>
              <Descriptions.Item span={3} label={t("general_industry")}>
                {job.industry === null ? "" : job.industry.name}
              </Descriptions.Item>
              <Descriptions.Item span={3} label={t("general_service_type")}>
                {job.service_type === null ? "" : job.service_type.name}
              </Descriptions.Item>
              <Descriptions.Item
                span={3}
                label={t("quick_setup_discount_tags_modal_discount_tag")}
              >
                {job.discount_tag === null ? "" : job.discount_tag.name}
              </Descriptions.Item>
              <Descriptions.Item
                span={3}
                label={t("general_priority_call_out")}
              >
                {job.job_priority === null ? "" : job.job_priority.name}
              </Descriptions.Item>
              <Descriptions.Item
                span={3}
                label={t("side_menu_navigation_quick_setup_sub_job_tags")}
              >
                {job.job_tags.map((tag) => (
                  <Tag>{tag.name}</Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item
                span={3}
                label={t("general_booked_by")}
              ></Descriptions.Item>
              <Descriptions.Item span={3} label={t("general_job_contact")}>
                {job.customer.full_name}
              </Descriptions.Item>
              <Descriptions.Item span={3} label={t("general_visit_date_Time")}>
                <CalendarOutlined />{" "}
                {moment(job.need_at).format(dateFormat.toUpperCase())}{" "}
                <FieldTimeOutlined /> {moment(job.need_at).format("HH:mm")}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Card title={t("general_technician/team_details")}>
            {job.field_technician && (
              <TechnicianDetails data={job.field_technician} />
            )}
            {job.team && <TeamDetails data={job.team} />}
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default JobCardSummary;
