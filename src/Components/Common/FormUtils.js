import { Col, Form, Input, Select } from 'antd';
import React from 'react';

const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

function InfoItem({ label, span , name, readOnly, rules, onChange, onFocusOut }) {
    return (
        <>
            <Col span={span}>
            <Form.Item label={label} name={name} rules={rules}>
                <Input placeholder={label} readOnly={readOnly} onChange={onChange} onBlur={onFocusOut} />
            </Form.Item>
            </Col>            
        </>
    );
}

function InfoSelect ({ label, name, span, options, defaultValue , handleChange, disabled, readOnly, rules }) {
    return <>
            <Col span={span}>
            <Form.Item label={label} name={name} rules={rules}>
                <Select showSearch 
                        filterOption={ handleFilterOption }
                        onChange={handleChange}
                        disabled={disabled}
                        readOnly={readOnly}
                        defaultValue={defaultValue}
                        >
                {options.map(v => (<Select.Option key={v.id} value={""+v.id}>{v.name}</Select.Option>))}
                </Select>
            </Form.Item>
            </Col>
        </>;
}

const FormUtils = { InfoItem, InfoSelect };
export default FormUtils;

