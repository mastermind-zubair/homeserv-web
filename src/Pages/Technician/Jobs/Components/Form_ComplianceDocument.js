import React from 'react';
import { Row,Col,Descriptions,Input,InputNumber,DatePicker,Select,Checkbox,Form,Collapse,Button,Radio,Typography} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
const { Panel } = Collapse;
const { Title } = Typography;


const DrawLabel = (question, input_json) => (<Descriptions.Item span={3} label={question}>{input_json.text}</Descriptions.Item>);

const DrawText = (item) => (
    <Form.Item
        label={item.question}
        name={item.id}
        rules={[{ required: true, message: 'Required' }]}
      >
        <Input />
      </Form.Item>
);

const DrawLongText = (item) => ( <Form.Item
        label={item.question}
        name={item.id}
        rules={[{ required: true, message: 'Required' }]}
      >
        <Input.TextArea />
      </Form.Item>);

const DrawDate = (item) => (
  <Form.Item
        label={item.question}
        name={item.id}
        rules={[{ required: true, message: 'Required' }]}
      >
       <DatePicker style={{width:"100%"}} />
      </Form.Item>)

const DrawSelect = (item,input_json) => (
 <Form.Item
        label={item.question}
        name={item.id}
        rules={[{ required: true, message: 'Required' }]}
      >
   <Select>
        {input_json.items.map(v => (<Select.Option value={v}>{v}</Select.Option>))}
  </Select> 
      </Form.Item>);

const DrawMultiSelect = (item,options) => (
  <Descriptions title={item.question}  column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
<Descriptions.Item>
 <Form.Item
noStyle
 wrapperCol={{span: 24}}
        name={item.id}
   rules={options.items === undefined ? [] : [{ required: true, message: 'Required' }]}
        
      >
    {options.items === undefined ? <b>No items</b> : 
        <Checkbox.Group style={{ width: '100%' }}>
                {options.items.map(v =>(<Checkbox value={v}>{v}</Checkbox>))}
        </Checkbox.Group>}</Form.Item>

    </Descriptions.Item></Descriptions>);

const DrawNumber = (item, input_json) => (

<Form.Item
        label={item.question}
        name={item.id}
        rules={[{ required: true, message: 'Required' }]}
      >
   <InputNumber style={{ width: '100%' }} min={input_json.min} max={input_json.max}  />
      </Form.Item>);

const DrawSign = (item) => (<Form.Item
            label="Signature"
            name={["signature",`${item.id}`]}
 rules={[{ required: true, message: 'Required' }]}
            >
       <Input className="font-face-sign" />
      </Form.Item>);

const DrawPotentialHazards = (item,index) => (
            <Collapse defaultActiveKey={['0']}>
            <Panel key={index}  header={<Title level={5}>{item.question}</Title>}>
                <Form.Item
                  label="Hazards"
                name={["hazards", `${item.id}`]}
                   rules={[{ required: true, message: 'Required' }]}
                >
                <Radio.Group>
                 <Radio value="Yes">Yes </Radio>
                 <Radio value="No"> No </Radio> 
                 <Radio value="N/A">N/A</Radio> 
                </Radio.Group>
                </Form.Item>
                <Form.Item
                name={["describe_hazards",`${item.id}`]}
                  label="Describe Hazards"
                   rules={[{ required: true, message: 'Required' }]}
                >
               <Input.TextArea />
                </Form.Item>
             
              <Form.Item
                name={["risk_level_1",`${item.id}`]}
                  label="Risk Level"
                   rules={[{ required: true, message: 'Required' }]}
                >
               <Input.TextArea />
                </Form.Item>
<Form.Item
                name={["control_measure",`${item.id}`]}
                  label="Control Measure"
                   rules={[{ required: true, message: 'Required' }]}
                >
               <Input.TextArea />
                </Form.Item>
<Form.Item
                name={["risk_level_2",`${item.id}`]}
                  label="Risk Level"
                   rules={[{ required: true, message: 'Required' }]}
                >
               <Input.TextArea />
                </Form.Item>
<Form.Item
                name={["action_by",`${item.id}`]}
                  label="Action By"
                   rules={[{ required: true, message: 'Required' }]}
                >
               <Input.TextArea />
                </Form.Item>
            </Panel>
</Collapse>
);

const DrawVerifyCheck = (item,index,docSectionQuestAnsObj) => {
 //console.log("docSectionQuestAnsObj[0].form_json[index])",docSectionQuestAnsObj !== undefined ? docSectionQuestAnsObj.form_json :"");
let objAnswer = docSectionQuestAnsObj !== undefined ? JSON.parse(docSectionQuestAnsObj.form_json) :"";
//console.log("objAnswer",objAnswer !== "" ? Object.values(objAnswer)[index]:"");
let SelectedValue = objAnswer !== "" ? Object.values(objAnswer)[index]:"";
return <>
 <Form.Item
        label={item.question}
        name={item.id}
        valuePropName="checked"
                labelCol={{
                  span: 17,
                }}
                wrapperCol={{
                  span: 7,
                }}
        
  // rules={[
  //         {
  //           validator: (_, value) =>
  //             value == "'Verify':true,'Check':true" ? Promise.resolve() : Promise.reject(new Error('Required')),
  //         },
  //       ]}
      >
<Checkbox.Group defaultValue={SelectedValue}  options={[
  { label: 'Verify', value: "'Verify':true" },
  { label: 'Check', value: "'Check':true" }
]}  />
 
      </Form.Item>
   
</>
}

const DrawNameSignDate = (item) => (

     <>
     <Form.Item
        labelCol={{
                  span: 24,
                }}
            label={item.question}
            >
      </Form.Item>
           <Form.Item
            label="Name"
            name={["name",`${item.id}`]}
            rules={[{ required: true, message: 'Required' }]}
            >
       <Input />
      </Form.Item>
        <Form.Item
            label="Signature"
            name={["signature",`${item.id}`]}
            rules={[{ required: true, message: 'Required' }]}
            >
       <Input className="font-face-sign" />
      </Form.Item>
           <Form.Item
        label="Date"
       name={["date",`${item.id}`]}
        rules={[{ required: true, message: 'Required' }]}
      >
       <DatePicker style={{width:"100%"}} />
      </Form.Item> </>
);


const DrawJsaDetails = (item) => (
    
        <Form.Item
        label={item.question}
        name={`${item.id}`}
        rules={[{ required: true, message: 'Required' }]}
      >
         <Input />
      </Form.Item>
);

const DrawConstruction2 = (item) => (
  
        <Form.Item
        label={item.question}
        name={`${item.id}`}
        style={{display: "block"}}
        rules={[{ required: true, message: 'Required' }]}
      >
         <Input />
      </Form.Item>
);

function DrawControl(docSectionQuest,docSectionQuestAnsObj){

if(docSectionQuest[0] && docSectionQuest[0].input_json.includes("jsa-details"))
{
return <>
            <Row><Col span={24}>
            {docSectionQuest.map((item, index) => { return (DrawJsaDetails(item))})}

      <Form.List name="questions">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <>
            <Collapse><Panel  header={key + 1}>
                {docSectionQuest.map((item, index) => { return ( 

                <Form.Item
                  {...restField} 
                  label={item.question}
                  name={[name,`${item.id}`]}
                  rules={[{ required: true, message: 'Required' }]}
                >

                  <Input />
                </Form.Item>)})}
                <MinusCircleOutlined onClick={() => remove(name)} />
            </Panel></Collapse>
              </>
            ))}
            <Form.Item className="mt-5">
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add new line
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
     
            </Col>
            </Row> 
            </>
}
else if(docSectionQuest[0] && docSectionQuest[0].input_json.includes("construction-2"))
{
return <>
            <Row><Col span={24}>
            {docSectionQuest.map((item, index) => { return (DrawConstruction2(item))})}

      <Form.List name="questions">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <>
            <Collapse><Panel  header={key + 1}>
                {docSectionQuest.map((item, index) => { return ( 

                <Form.Item
                  {...restField} 
                  label={item.question}
                  name={[name,`${item.id}`]}
                  rules={[{ required: true, message: 'Required' }]}
                >

                  <Input />
                </Form.Item>)})}
                <MinusCircleOutlined onClick={() => remove(name)} />
            </Panel></Collapse>
              </>
            ))}
            <Form.Item className="mt-5">
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add new line
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
     
            </Col>
            </Row> 
            </>
}
else
{
return docSectionQuest.map((item, index) => {
    var input_json = JSON.parse(item.input_json);
    var question = item.question;
    switch(input_json.type){
        case "label":       return DrawLabel(question, input_json);
        case "text":        return DrawText(item);
        case "long-text":   return DrawLongText(item);
        case "date":        return DrawDate(item);
        case "select":      return DrawSelect(item, input_json);
        case "multi-select":    return DrawMultiSelect(item,JSON.parse(item.input_json));
        case "number":      return DrawNumber(item, input_json);
        case "sign":        return DrawSign(item);
        case "potential-hazards":   return DrawPotentialHazards(item,index);
        case "verify-check":    return DrawVerifyCheck(item,index,docSectionQuestAnsObj);
        case "name-sign-date":  return DrawNameSignDate(item);
        default:            return (<></>)
    }
                })
}
    
}

function Form_ComplianceDocument( {docSectionQuest,docSectionQuestAnsObj}) {

return <>
     { DrawControl(docSectionQuest,docSectionQuestAnsObj)}

            </>
 
}

export default Form_ComplianceDocument;