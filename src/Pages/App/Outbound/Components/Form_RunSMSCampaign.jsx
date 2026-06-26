import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Popconfirm, Space, Modal } from "antd";
import { trackPromise } from "react-promise-tracker";
import DefaultService from "Services/API/DefaultService";
import CustomDataGrid from "Components/DevEx/CustomDataGrid";

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const Form_RunSMSCampaign = ({ form, showForm, recordToEdit, handleCancel, onFinish, onFinishFailed, ENTITY, data }) => {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState();
  const [showCustomerList, setShowCustomerList] = useState(false);
  useEffect(() => {
    (async (recordToEdit) => {if (recordToEdit) {
      let { data: c } = await trackPromise(
        DefaultService.POST("/sms_campaign/customers", {
          organisation_id: data.organisation.id,
          filters: recordToEdit.filters,
        })
      );

      if (c) {
        if (c.length === 0) {
          setCustomers([]);
          //SEND TEST - END
        } else {
          c = c.map((cust) => {
            return { customer_name: cust.first_name + " " + cust.last_name, customer_mobile: cust.mobile, customer_country: cust.country };
          });
          setCustomers(c);
        }
      }
    }})(recordToEdit);
  }, [recordToEdit, data.organisation.id]);

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

      <h3>SMS Preview</h3>
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
        You will send this sms to {customers && customers.length} customers
        <Button type="link" danger className="ml-auto" onClick={() => setShowCustomerList(true)}>
          View customer list
        </Button>
      </div>
      <br />
      <div className="text-center">
        <Space size={15}>
          <Popconfirm
            title={`Are you sure to run this campaign by sending above SMS to ${
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
                { caption: "Mobile", dataField: "customer_mobile", align: "left" },
                { caption: "Country", dataField: "customer_country", align: "left" },
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

export default Form_RunSMSCampaign;
