import { 
    Row,
    Col,
    Descriptions, 
    Tabs, 
    Input,
    InputNumber,
    DatePicker,
    Select,
    Checkbox
} from 'antd';
import React from 'react';

const DrawLabel = (question, input_json) => (<Descriptions.Item span={3} label={question}>{input_json.text}</Descriptions.Item>);
const DrawText = (question, input_json) => (<Descriptions.Item span={3} label={question}><Input placeholder={input_json.type} /> </Descriptions.Item>);
const DrawLongText = (question, input_json) => (<Descriptions.Item span={3} label={question}><Input.TextArea rows={6} placeholder={input_json.type} /> </Descriptions.Item>);
const DrawDate = (question, input_json) => (<Descriptions.Item span={3} label={question}><DatePicker placeholder={input_json.type} style={{ width: '100%' }}/> </Descriptions.Item>);
const DrawSelect = (question, input_json) => (<Descriptions.Item span={3} label={question}>
    <Select placeholder={input_json.type} style={{ width: '100%' }}>
        {input_json.items.map(v => (<Select.Option value={v}>{v}</Select.Option>))}
    </Select> 
    </Descriptions.Item>);

const DrawMultiSelect = (question, input_json) => (<Descriptions.Item span={3} label={question}>
    {input_json.items === undefined ? <b>No items</b> : 
        <Checkbox.Group style={{ width: '100%' }}>
            <Row>
                {input_json.items.map(v =>(<Col span={6}><Checkbox value={v}>{v}</Checkbox></Col>))}
            </Row>
        </Checkbox.Group>}
    </Descriptions.Item>);

const DrawNumber = (question, input_json) => (<Descriptions.Item span={3} label={question}><InputNumber style={{ width: '100%' }} min={input_json.min} max={input_json.max} placeholder={input_json.type} /> </Descriptions.Item>);
const DrawSign = (question) => (<Descriptions.Item span={3} label={question}><Input.TextArea disabled={true} rows={6} /></Descriptions.Item>);
const DrawPotentialHazards = (question) => (
            <Descriptions.Item span={3}>
                <Row>
                    <Col><b>{question}</b></Col>
                </Row>
                <Descriptions bordered layout='vertical'>
                    <Descriptions.Item span={3} label="Hazards">
                        <Select style={{width:'100%'}}>
                            <Select.Option>Yes</Select.Option>
                            <Select.Option>No</Select.Option>
                            <Select.Option>N/A</Select.Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item span={3} label="Describe Hazards">
                        <Input.TextArea />
                    </Descriptions.Item>
                    <Descriptions.Item span={3} label="Risk Level">
                        <Input.TextArea />
                    </Descriptions.Item>
                    <Descriptions.Item span={3} label="Control Measure">
                        <Input.TextArea />
                    </Descriptions.Item>
                    <Descriptions.Item span={3} label="Risk Level">
                        <Input.TextArea />
                    </Descriptions.Item>
                    <Descriptions.Item span={3} label="Action by">
                        <Input.TextArea />
                    </Descriptions.Item>
                </Descriptions>                    
            </Descriptions.Item>
);

const DrawVerifyCheck = (question) => (<Descriptions.Item span={3} label={`${question}`}>
        <Row>
            <Col><Checkbox>verify</Checkbox></Col>
            <Col><Checkbox>Check</Checkbox></Col>
        </Row>
    </Descriptions.Item>);

const DrawNameSignDate = (question) => (<Descriptions.Item span={3} label={question}>
        <Descriptions layout='vertical' bordered>
            <Descriptions.Item label="Name"><Input /></Descriptions.Item>
            <Descriptions.Item label="Signature"><Input.TextArea /></Descriptions.Item>
            <Descriptions.Item label="Date"><DatePicker /></Descriptions.Item>
        </Descriptions>
    </Descriptions.Item>);

const DrawConstruction2 = (question) => (<Descriptions.Item span={3} label={question}>
        <Input.TextArea rows={10} />
    </Descriptions.Item>);

const DrawJsaDetails = (question) => (<Descriptions.Item span={3} label={question}>
        <Input.TextArea rows={10} />
    </Descriptions.Item>);

function DrawControl(q){
    var input_json = JSON.parse(q.input_json);
    var question = q.question;
    switch(input_json.type){
        case "label":       return DrawLabel(question, input_json);
        case "text":        return DrawText(question, input_json);
        case "long-text":   return DrawLongText(question, input_json);
        case "date":        return DrawDate(question, input_json);
        case "select":      return DrawSelect(question, input_json);
        case "multi-select":    return DrawMultiSelect(question, input_json);
        case "number":      return DrawNumber(question, input_json);
        case "sign":        return DrawSign(question);
        case "potential-hazards":   return DrawPotentialHazards(question);
        case "verify-check":    return DrawVerifyCheck(question);
        case "name-sign-date":  return DrawNameSignDate(question);
        case "construction-2":  return DrawConstruction2(question);
        case "jsa-details":     return DrawJsaDetails(question);
        default:            return (<></>)
    }
}
function Form_ComplianceDocument({ doc }) {
    return (
        <Tabs tabPosition='left'>
        {doc.sections.map(section => (
            <Tabs.TabPane tab={section.title} key={section.id}>
                <Row>
                    <Col span={24}>
                        <Descriptions title={section.title} bordered>
                            {section.questions.map(q => DrawControl(q))}
                        </Descriptions>
                    </Col>
                </Row>
            </Tabs.TabPane>
        ))}
        </Tabs>
    );
}

export default Form_ComplianceDocument;