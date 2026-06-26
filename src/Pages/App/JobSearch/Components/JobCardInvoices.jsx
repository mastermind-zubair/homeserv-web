import React from 'react';
import { Card, Col, Row, Table, Descriptions, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

function JobCardInvoices({ job }) {
    const { t } = useTranslation();
    const columns = [
        { title: t("dashboard_job_search_item"), dataIndex: 'item' },
        { title: t("dashboard_job_search_amount"), dataIndex: 'amount' },
    ]

    if (job === undefined) return (<h3>No invoices found</h3>);
    return (
        <>
            {job.invoices.map(inv => (
                <>
                    <Row>
                        <Col span={24}>
                            <Descriptions title={t("general_company_info")} bordered>
                                <Descriptions.Item label={t("general_inv#")}><b>{inv.id}</b> <Tag color="orange">{inv.status}</Tag></Descriptions.Item>
                                <Descriptions.Item label={t("general_company")}>{inv.company_name}</Descriptions.Item>
                                <Descriptions.Item label={t("quick_setup_office_users_form_address")}>{inv.address}</Descriptions.Item>
                                <Descriptions.Item label={t("general_BSB_number")}>{inv.bsb_number}</Descriptions.Item>
                                <Descriptions.Item label={t("general_account_number")}>{inv.account_number}</Descriptions.Item>
                                <Descriptions.Item label={t("general_ACN/ABN")}>{inv.acn_abn}</Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Card title={t("general_items")}>
                                <Table columns={columns} dataSource={inv.items} />
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Descriptions title={t("general_totals")} bordered>
                                <Descriptions.Item label={t("dashboard_job_search_sub_total")}>{inv.sub_total}</Descriptions.Item>
                                <Descriptions.Item label={t("general_tax")}>{inv.tax}</Descriptions.Item>
                                <Descriptions.Item label={t("general_discount")}>{inv.company_name}</Descriptions.Item>
                                <Descriptions.Item label={t("dashboard_job_search_total")}><b>{inv.total}</b></Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                </>
            ))}
        </>
    );
}

export default JobCardInvoices;