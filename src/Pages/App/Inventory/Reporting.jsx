import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Form, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import DefaultService from "Services/API/DefaultService";
import Form_Supplier from "./Components/Form_Supplier";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
const Reporting = (props) => {
  const ENTITY = "Supplier";
  const ENTITY_PLURAL = "Suppliers";
  const ENTITY_API_KEY = "Inventory_Supplier";

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const { curOrg: organisation } = useContext(Context);

  useEffect(async () => {
    //const { data } = await trackPromise(DefaultService.GetInvoiceTemplateOptions());
  }, []);

  useEffect(async () => {
    // organisation && (await handleSearch());
  }, [organisation]);

  return (
    <>
      <div className="flex mb-2">
        <PageTitle />
        <h3 className="push-right text-right">
          {/* <Tooltip title={`Do you have more ${ENTITY_PLURAL}? Click here to add another`}>
            <Button className="bg-success" icon={<PlusCircleOutlined />} onClick={handleEdit}>
              Add New {ENTITY}
            </Button>
          </Tooltip> */}
        </h3>
      </div>
    </>
  );
};

export default Reporting;
