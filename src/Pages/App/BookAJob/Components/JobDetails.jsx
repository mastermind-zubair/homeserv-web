import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, Form, Select, DatePicker, Input, Radio } from 'antd';
import Context from 'Store/Context';
import LookupService from "Services/API/LookupService";
import { useTranslation } from 'react-i18next';

const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

const InfoSelect = ({ label, name, span, options , handleChange, disabled, mode, rules }) => (<>
    <Col span={span}>
      <Form.Item label={label} name={name} rules={rules}>
        <Select showSearch 
                filterOption={ handleFilterOption }
                onChange={handleChange}
                disabled={disabled}
                mode={mode}
                >
          {options.map(v => (<Select.Option key={v.value} value={v.value}>{v.label}</Select.Option>))}
        </Select>
      </Form.Item>
    </Col>
  </>);
  
export default function JobDetails({ShowDiscountTag,
    ShowJobPriority,
    ShowJobTag,
    ShowServiceType}){
        const { curOrg: organisation } = useContext(Context);
        // const [dateFormat, setDateFormat] = useState("MM-dd-yyyy");
        const [Industries, setIndustries] = useState([]);
        const [ServiceTypes, setServiceTypes] = useState([]);
        const [DiscountTags, setDiscountTags] = useState([]);
        const [Priorities, setPriorities] = useState([]);
        const [LeadSources, setLeadSources] = useState([]);
        const [Tags, setTags] = useState([]);

        useEffect(() => {
            if(organisation === undefined || organisation === null) return;
            (async () => {
                let _industries = await LookupService.Industries({ organisation_id: organisation.id });
                let _discount_tags = await LookupService.DiscountTags({ organisation_id: organisation.id });
                let _job_priorities = await LookupService.JobPriorities({ organisation_id: organisation.id });
                let _lead_sources = await LookupService.LeadSources({ organisation_id: organisation.id });
                setIndustries(_industries);
                setDiscountTags(_discount_tags);
                setPriorities(_job_priorities);
                setLeadSources(_lead_sources);
                setServiceTypes([]);
                setTags([]);
                // setDateFormat(organisation.date_format);
            })();
        }, [organisation]);

  useEffect(() => {
    if (organisation === undefined || organisation === null) return;
    (async () => {
      let _industries = await LookupService.Industries({ organisation_id: organisation.id });
      let _discount_tags = await LookupService.DiscountTags({ organisation_id: organisation.id });
      let _job_priorities = await LookupService.JobPriorities({ organisation_id: organisation.id });
      setIndustries(_industries);
      setDiscountTags(_discount_tags);
      setPriorities(_job_priorities);
      setServiceTypes([]);
      setTags([]);
    })();
  }, [organisation]);

  const handleIndustryChange = async v => {
    let _service_types = await LookupService.ServiceTypes({ industry_id: v });
    let _job_tags = await LookupService.JobTags({ industry_id: v });

    setServiceTypes(_service_types);
    setTags(_job_tags);
  };

  const requiredRule = p => ({
    required: true,
    message: `Please input ${p}`
  });
  const { t } = useTranslation();
  return (
    <>
      <Row gutter={5}>
        <InfoSelect span={6}
          label={t("quick_setup_manage_project_select_ind")}
          name="industry_id"
          options={Industries}
          handleChange={handleIndustryChange}
          rules={[requiredRule('Industry')]}
        />
        {ShowServiceType && <InfoSelect span={6}
          label={t("label_select_service_type")}
          name="service_type_id"
          options={ServiceTypes}
          rules={[requiredRule('Service Type')]}
        />}
        {ShowDiscountTag && <InfoSelect span={6}
          label={t("label_select_discount_tag")}
          name="discount_tag_id"
          options={DiscountTags}
        />}
        {ShowJobPriority && <InfoSelect span={6}
          label={t("label_select_priority")}
          name="job_priority_id"
          options={Priorities}
          rules={[requiredRule('Job Priority')]}
        />}
        {ShowJobTag && <InfoSelect span={6}
          label="Select Job Tags"
          name="job_tags"
          mode="multiple"
          options={Tags}
          rules={[requiredRule('Job Tags')]}
        />}
        <Col span={3}>
          <Form.Item label={t("label_select_visit_date/time")} name="need_at" rules={[requiredRule('visit date/time')]}>
            <DatePicker showTime={{ format: "HH:mm", minuteStep: 5 }} format="DD-MM-YYYY HH:mm" />
          </Form.Item>
        </Col>
        <InfoSelect span={3}
          label={t("label_lead_source")}
          name="lead_source_id"
          options={LeadSources}
          rules={[requiredRule('Job Priority')]}
        />
        {/* <Col span={3}>
          <Form.Item label={t("label_lead_source")} name="lead_source">
            <Input />
          </Form.Item>
        </Col> */}
        <Col span={12}>
          <Form.Item label={t("label_job_duration_(in_mins)")} name="job_duration_mins" rules={[requiredRule('Job Duration (in Mins)')]}>
            <Radio.Group>
              {[...Array(8).keys()].map((item) => {
                var labels = ['30 mins',
                  '1 hour',
                  '1.5 hours',
                  '2 hours',
                  '2.5 hours',
                  '3 hours',
                  '3.5 hours',
                  '4 hours'];
                return (
                  <Radio.Button key={item} value={(item + 1) * 30}>
                    {labels[item]}
                  </Radio.Button>
                )
              }
              )}
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label={t("label_job_description")} name="job_details" rules={[requiredRule('Job Description')]}>
            <Input.TextArea showCount maxLength={1000} rows={10} />
          </Form.Item>
        </Col>
      </Row>
    </>);
}