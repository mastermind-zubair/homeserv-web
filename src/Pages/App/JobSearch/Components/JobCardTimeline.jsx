import React from 'react';
import { Card, Col, Row, Table } from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

function JobCardTimeline({ job }) {
    const { t } = useTranslation();
    const columns = [
        { title: t("dashboard_job_search_time"), dataIndex: 'createdAt', render: (_, { createdAt }) => (<>{moment(createdAt).format("YYYY-MM-DD HH:mm")}</>) },
        { title: t("dashboard_job_search_user"), dataIndex: 'user', render: (_, { user: { display_name } }) => (<>{display_name}</>) },
        { title: t("dashboard_job_search_activity"), dataIndex: 'activity', render: (activity) => activity.split('_').join(' ') },
        { title: t("dashboard_job_search_details"), dataIndex: 'details' },
        // { title: 'Total', dataIndex: 'total' },
    ]

    if (job === undefined) return (<h3>No logs found</h3>);
    return (
        <>
            <Row>
                <Col span={24}>
                    <Card title={t("dashboard_job_search_job_timeline")}>
                        <Table columns={columns} dataSource={job.logs} />
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default JobCardTimeline;