import React from 'react';
import { List, Space, Typography } from 'antd';
import moment from 'moment';

function JobItem({job, jobClicked, isDragging, connectDragSource, connectDragPreview}) {
    const itemClicked = () => {
        jobClicked(job.id);
    }
    let dragContent = <div>
            <List.Item onClick={itemClicked}>
                <Space>
                    <Typography.Text mark>[{job.id}]</Typography.Text>
                    <Typography.Text style={{textAlign: 'left'}} type={job.job_priority_id === 2 ? 'danger': 'default'}>{moment(job.need_at).format("DD/MM/yyyy HH:mm")} - {job.service_type? job.service_type.name : '' } - {job.job_site_address.city}</Typography.Text>
                </Space>
            </List.Item>
        </div>;

    return (
        isDragging ? null : (
            <div>
                {
                    connectDragPreview(
                        connectDragSource(dragContent)
                    )
                }
            </div>
        )
    )
}

export default JobItem;
