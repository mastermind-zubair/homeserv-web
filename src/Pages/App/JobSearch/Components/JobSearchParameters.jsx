import { Row } from 'antd';
import React from 'react';
import FormUtils from 'Components/Common/FormUtils.js';
import { useTranslation } from 'react-i18next';
const { InfoItem, InfoSelect } = FormUtils;

function JobSearchParameters({ data }) {
    const { t } = useTranslation();
    return (
        <>
            <Row>
                <InfoItem label={t("general_job_id")} name="job_id" span={8} />
            </Row>
            <Row>
                <InfoSelect label={t("general_job_status")} name="job_status_id" span={8} options={data.job_statuses} />
                <InfoSelect label={t("side_menu_navigation_reports_sub_job_priority")} name="job_priority_id" span={8} options={data.job_priorities} />
                <InfoSelect label={t("side_menu_navigation_quick_setup_sub_job_tags")} name="job_tag_id" span={8} options={data.job_tags} />
            </Row>
        </>
    );
}

export default JobSearchParameters;