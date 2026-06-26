import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Descriptions,
  Form,
  Modal,
  Radio,
  Select,
  Tabs,
} from "antd";
import moment from "moment";

function JobDetails({
  job,
  handleOk,
  handleCancelJob,
  visible,
  dateFormat,
  fieldTechnicians,
  teams,
  time_format,
  onAssignedTo,
}) {
  const [showTeams, setShowTeams] = useState(false);
  const initialValues = {
    slot_type: "FT",
    slot_start: moment(),
    slot_end: moment().add(2, "hour"),
    field_technician_id: null,
    team_id: null,
  };
  const line_item = (i, { label, value }) => (
    <Descriptions.Item key={i} label={label} span={3}>
      {value}
    </Descriptions.Item>
  );
  const time_display = (job) =>
    moment(job.need_at).format(dateFormat) +
    " " +
    moment(job.need_at).format("HH:mm");
  const items =
    job === null
      ? []
      : [
          { label: "Job Id", value: job.id },
          { label: "Visit date", value: time_display(job) },
          { label: "Industry", value: job.industry.name },
          {
            label: "Service Type",
            value: job.service_type ? job.service_type.name : "",
          },
          {
            label: "Discount Tag",
            value: job.discount_tag ? job.discount_tag.name : "",
          },
          {
            label: "Job Priority",
            value: job.job_priority ? job.job_priority.name : "",
          },
          { label: "Job Duration", value: job.job_duration_mins },
          { label: "Job Details", value: job.job_details },
          { label: "Customer", value: job.customer.full_name },
          { label: "Contact", value: job.contact_address.full_address },
          { label: "Mobile", value: job.contact_address.mobile },
          { label: "Phone", value: job.contact_address.phone },
          {
            label: "Site",
            value:
              job.job_site_address.full_address ===
              job.contact_address.full_address
                ? "same as contact"
                : job.job_site_address.full_address,
          },
          {
            label: "Job Tags",
            value: job.job_tags
              ? "[" + job.job_tags.map((v) => v.name).join("] [") + "]"
              : "",
          },
        ];
  const onCancelJob = () => {
    if (window.confirm(`Are you sure to cancel job?`)) handleCancelJob(job.id);
  };
  const handleChangeAssignType = (e) => {
    if (e.target.value === "TEAM") {
      setShowTeams(true);
    } else {
      setShowTeams(false);
    }
  };
  const onFinish = (values) => {
    console.log("Received values of form: ", values);

    if (values.slot_type === "FT") {
      values.team_id = null;
    } else {
      values.field_technician_id = null;
    }
    onAssignedTo(values, job);
  };
  return (
    <>
      {job !== null && (
        <Modal
          title="Job"
          onOk={handleOk}
          onCancel={handleOk}
          visible={visible}
        >
          <Tabs defaultActiveKey={1}>
            <Tabs.TabPane tab="Details" key={1}>
              <Descriptions bordered>
                {items.map((v, i) => line_item(i, v))}
              </Descriptions>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Actions" key={2}>
              <Button block danger onClick={onCancelJob}>
                Cancel Job
              </Button>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Assign To" key={3}>
              <Form
                layout="vertical"
                onFinish={onFinish}
                initialValues={initialValues}
              >
                <Form.Item label="Type" name="slot_type">
                  <Radio.Group onChange={handleChangeAssignType}>
                    <Radio.Button value="FT">Field Technician</Radio.Button>
                    <Radio.Button value="TEAM">Team</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="Start Date & Time" name="slot_start">
                  <DatePicker
                    format={`${dateFormat.toUpperCase()} ${time_format}`}
                    showTime={{ minuteStep: 5, format: time_format }}
                  />
                </Form.Item>
                <Form.Item label="End Date & Time" name="slot_end">
                  <DatePicker
                    format={`${dateFormat.toUpperCase()} ${time_format}`}
                    showTime={{ minuteStep: 5, format: time_format }}
                  />
                </Form.Item>
                {!showTeams && (
                  <Form.Item
                    label="Field Technician"
                    name="field_technician_id"
                  >
                    <Select>
                      {fieldTechnicians.map((v) => (
                        <Select.Option key={`ft_${v.id}`} value={v.id}>
                          {v.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
                {showTeams && (
                  <Form.Item label="Teams" name="team_id">
                    <Select>
                      {teams.map((v) => (
                        <Select.Option key={`t_${v.id}`} value={v.id}>
                          {v.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Assigned
                  </Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </Modal>
      )}
    </>
  );
}

export default JobDetails;
