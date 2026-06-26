import { Button, DatePicker, Form, Input, Modal, Radio, Select } from "antd";
import moment from "moment";
import React from "react";

function TaskView({
  visible,
  handleCancel,
  handleSubmit,
  dateFormat,
  fieldTechnicians,
}) {
  const time_format = "HH:mm";
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    var slot_start = values.slot_start;
    var slot_end = values.slot_end;
    delete values.slot_start;
    delete values.slot_end;

    slot_start.set({ second: 0, millisecond: 0 });
    slot_end.set({ second: 0, millisecond: 0 });

    values.slot_date = slot_start;
    values.slot_duration = moment(slot_end).diff(moment(slot_start), "minutes");
    handleSubmit(values);
  };
  return (
    <Modal
      visible={visible}
      title="Add Task/Time"
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Type" name="slot_type">
          <Radio.Group>
            <Radio.Button value="TASK" defaultChecked>
              Task
            </Radio.Button>
            <Radio.Button value="TIME_BLOCK">Time Block</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Title" name="title">
          <Input placeholder="Enter your title here" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} />
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
        <Form.Item label="Field Technician" name="field_technician_id">
          <Select>
            {fieldTechnicians.map((v) => (
              <Select.Option value={v.id}>{v.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TaskView;
