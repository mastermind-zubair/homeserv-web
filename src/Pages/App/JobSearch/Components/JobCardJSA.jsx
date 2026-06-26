import React from 'react';
import { Card, Col, Descriptions, Row, Table } from 'antd';
import { useTranslation } from 'react-i18next';

function JobCardJSA({ job }) {
    const { t } = useTranslation();

    if (job === undefined) return (<h3> {t("dashboard_job_search_no_notes_found")} </h3>);
    return (
        <>
            <Row>
                <Col span={24}>
                    <Card title={"JSA"}>
                        <Descriptions bordered>
                            {job.jsa.map(item =>{
                                var answer = item.answer_json;
                                try{ answer = JSON.parse(item.answer_json).value; }catch(e){ answer = "N/A";}
                                return (<Descriptions.Item span={3} label={item.compliance_document_question.question}>{answer}</Descriptions.Item>);
                            } )}
                            
                        </Descriptions>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default JobCardJSA;