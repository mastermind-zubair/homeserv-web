import { useEffect, useState } from "react";
import { FormButtons } from "Components/Common/FormButtons";
import { useTranslation } from "react-i18next";
import environment from "Environment";
import { Button, Popconfirm, Space } from "antd";
import { trackPromise } from "react-promise-tracker";
import DefaultService from "Services/API/DefaultService";
import Swal from "sweetalert2";
import CustomDataGrid from "Components/DevEx/CustomDataGrid";

const { Modal, Form, Input, Radio, Select } = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_RunCampaign = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY, data }) => {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState();
  const [showCustomerList, setShowCustomerList] = useState(false);
  useEffect(async () => {
    if (recordToEdit) {
      let { data: c, status } = await trackPromise(
        DefaultService.POST("/market_campaign/customers", {
          organisation_id: data.organisation.id,
          filters: recordToEdit.filters,
        })
      );

      if (c) {
        if (c.length === 0) {
          //SEND TEST - START
          // setCustomers([
          //   { customer_name: "Khurram PRO", customer_email: "khurram.pro@gmail.com" },
          //   { customer_name: "Khurram GMAIL", customer_email: "khurram.imtiaz@gmail.com" },
          //   { customer_name: "Khurram ANSQUARE", customer_email: "khurram@ansquare.co.uk" },
          //   { customer_name: "Khurram CodeBooth", customer_email: "khurram@codebooth.com.au" },
          // ]);
          setCustomers([]);
          //SEND TEST - END
        } else {
          c = c.map((cust) => {
            return { customer_name: cust.first_name + " " + cust.last_name, customer_email: cust.email };
          });
          setCustomers(c);
        }
      }
    }
  }, [recordToEdit]);

  return (
    <Modal
      title={`Run Campaign`}
      visible={showForm}
      width={480}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={[]}
    >
      <LoadingPanelForPopup />
      <div className="mb-5 flex">
        <h3 className="text-primary">{recordToEdit.name} Campaign</h3>
        <div className="ml-auto">
          <b>Organisation: </b>
          <b className="text-danger">{data.organisation && data.organisation.name}</b>
        </div>
      </div>

      <h3>Email Preview</h3>
      <div className="box box-pad">
        Hi {`{{customer name}}`}
        <br />
        {recordToEdit.content}
        <br />
        <br />
        Regards,
        <br />
        {data.organisation && data.organisation.name}
      </div>

      <br />
      <div className="flex">
        You will send this email to {customers && customers.length} customers
        <Button type="link" danger className="ml-auto" onClick={() => setShowCustomerList(true)}>
          View customer list
        </Button>
      </div>
      <br />
      <div className="text-center">
        <Space size={15}>
          <Popconfirm
            title={`Are you sure to run this campaign by sending above email to ${
              customers && customers.length
            } customers?`}
            onConfirm={() => onFinish(customers, recordToEdit)}
          >
            <Button size="large">Send</Button>
          </Popconfirm>
          <Button size="large" type="dashed" danger onClick={handleCancel}>
            Cancel
          </Button>
        </Space>
      </div>

      {showCustomerList && (
        <Modal
          title={`List of customers`}
          visible={showCustomerList}
          width={480}
          // onOk={handleSave}
          onCancel={() => setShowCustomerList(false)}
          footer={[]}
        >
          <div className="flex">
            <CustomDataGrid
              data={customers}
              columns={[
                { caption: "Customer Name", dataField: "customer_name", align: "left" },
                { caption: "Email", dataField: "customer_email", align: "left" },
              ]}
              canDelete={false}
              canEdit={false}
            />
          </div>
        </Modal>
      )}
    </Modal>
  );
};

export default Form_RunCampaign;
