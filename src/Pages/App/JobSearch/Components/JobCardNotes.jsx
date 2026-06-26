import React from 'react';
import { Card, Col, Row, Table } from 'antd';
import { useTranslation } from 'react-i18next';

function JobCardNotes({ job }) {
    const { t } = useTranslation();
    const columns = [
        { title: t("dashboard_job_search_reference"), dataIndex: 'note_key', render: reference => reference.split('_').join(' ') },
        { title: t("dashboard_job_search_note"), dataIndex: 'note' },
    ]

    if (job === undefined) return (<h3> {t("dashboard_job_search_no_notes_found")} </h3>);
    return (
        <>
            <Row>
                <Col span={24}>
                    <Card title={t("dashboard_job_search_all_notes")}>
                        <Table columns={columns} dataSource={job.notes} />
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default JobCardNotes;