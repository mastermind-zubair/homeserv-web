import { Card, Col, Row, Carousel, Image } from 'antd';
import { JobMediaPhoto } from 'Components/Common/Images';
import React from 'react';
import { useTranslation } from 'react-i18next';

function JobCardMedia({ job }) {
    const { t } = useTranslation();
    if (!job || !job.media) return (<h3> {t("dashboard_job_search_no_media_found")} </h3>);


    const before_media = job.media.filter(v => v.type === 'BEFORE');
    const after_media = job.media.filter(v => v.type === 'AFTER');

    return (
        <>

            <Row>
                <Col span={24}>
                    <Card title={t("dashboard_job_search_before_images")}>
                        <Row>                            
                            <Image.PreviewGroup>
                                {before_media.map(m => (<Col><JobMediaPhoto filename={m.file_path} height={300} /></Col>))}
                            </Image.PreviewGroup>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Card title={t("dashboard_job_search_after_images")}>
                        <Row>                            
                            <Image.PreviewGroup>
                                {after_media.map(m => (<Col><JobMediaPhoto filename={m.file_path} height={300} /></Col>))}
                            </Image.PreviewGroup>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </>
    );


}

export default JobCardMedia;