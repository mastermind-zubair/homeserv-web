import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Space, Table } from 'antd';
import _ from 'lodash';
import SelectedCard from 'Components/AntD/SelectedCard';
import { useTranslation } from 'react-i18next';

function JobCardQuotes({ job }) {
    const [latestOne, setLatestOne] = useState(null);
    useEffect(() => {
        if (job === null || job === undefined) return;
        if (job.quotes === null) return;
        if (job.quotes.length === 0) return;
        setLatestOne(job.quotes[job.quotes.length - 1]);
    }, [job]);
    const { t } = useTranslation();
    const columns = [
        { title: t("general_title"), dataIndex: 'title' },
        { title: t("dashboard_job_search_quantity"), dataIndex: 'quantity' },
        { title: t("general_price"), dataIndex: 'price' },
        { title: t("dashboard_job_search_sub_total"), dataIndex: 'sub_total' },
        { title: t("dashboard_job_search_total"), dataIndex: 'total' },
    ]
    if (latestOne === null) return "No quotes available";

    return (
        <>
            {latestOne.options.map(option => (
                <Row>
                    <Col span={24}>
                        <SelectedCard isSelected={option.is_recommended}
                            title={option.title}
                            extra={<h2 style={{ color: `${option.is_recommended ? "#dd6633" : "#555"}` }}>${_.round(option.amount, 2)}</h2>}>
                            <Table columns={columns} dataSource={option.items} pagination={false} />
                        </SelectedCard>
                    </Col>
                </Row>
            ))}
        </>
    );
}

export default JobCardQuotes;