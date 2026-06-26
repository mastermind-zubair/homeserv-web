import { Modal, Descriptions } from "antd";
import moment from "moment";
import React from "react";

function TaskDetailView({ visible, handleCancel, task, dateFormat }) {
  if (task === null) {
    return <>Loading information</>;
  }
  var start = moment(task.slot_date).format(
    `${dateFormat.toUpperCase()} HH:mm`
  );

  var end = moment(task.slot_date)
    .add(task.slot_duration, "minute")
    .format(`${dateFormat.toUpperCase()} HH:mm`);
  return (
    <>
      <Modal visible={visible} onCancel={handleCancel} onOk={handleCancel}>
        <Descriptions title={task.slot_type.replace("_", " ")} bordered>
          <Descriptions.Item span={3} label="Field Technician">
            {task.field_technician.display_name}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Title">
            {task.title}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Description">
            {task.description}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Start Date & Time">
            {start}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="End Date & Time">
            {end}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
}

export default TaskDetailView;
