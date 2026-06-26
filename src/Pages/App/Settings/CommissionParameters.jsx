import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Col, Form, Row, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import LookupService from "Services/API/LookupService";
import Form_CommissionParameter from "./Components/Form_CommissionParameter";
import NumberFormat from "react-number-format";
import DefaultService from "Services/API/DefaultService";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import { useTranslation } from "react-i18next";

const CommissionParameters = (props) => {
  const ENTITY = "Commission Parameter";
  const ENTITY_PLURAL = "Commission Parameters";
  const ENTITY_API_KEY = "Settings_Commission_Parameter";

  const { curOrg: organisation } = useContext(Context);

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const [industries, setIndustries] = useState();
  const [technicianRoles, setTechnicianRoles] = useState();

  useEffect(async () => {
    if (organisation) {
      let i = await trackPromise(LookupService.Industries({ organisation_id: organisation.id }));
      let t = await trackPromise(LookupService.TechnicianRoles({ organisation_id: organisation.id }));

      setIndustries(i);
      setTechnicianRoles(t);

      await handleSearch();
    }
  }, [organisation]);

  useEffect(() => {
    if (recordToEdit && recordToEdit.id === 0) {
      recordToEdit.ranges = [];
    }
    form.resetFields();
  }, [recordToEdit]);

  const handleSearch = async () => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List(ENTITY_API_KEY, { organisation_id: organisation.id })
    );
    !status && notify(message, status);
    setData(data);
  };
  const handleEdit = async (item) => {
    //console.log("Edit Handler", item);

    let record = {};
    if (item.id) {
      record = { ...item };
      // record.members =
      //   record.members &&
      //   record.members.map((m) => {
      //     return m.id;
      //   });
    } else {
      record.organisation_id = organisation.id;
    }
    setRecordToEdit(record);

    setShowEditForm(true);
  };

  const handleDelete = async (item) => {
    //console.log("Delete Handler", item);
    let { status, message } = await trackPromise(DefaultService.Entity_Delete(ENTITY_API_KEY, item.id));
    notify(message, status);
    await handleSearch();
  };

  const handleCancel = () => {
    setShowEditForm(false);
  };

  const onFinish = async (values) => {
    //console.log(files);

    /* IF FILES NEED TO BE UPLOADED VIA FORM
    const formData = new FormData();
     files.forEach((file) => {
       formData.append("files[]", file);
     });
    */
    let record = values;
    console.log("Form values", values);

    //SET SOME DEFAULT VALUES HERE

    console.log("Record to save", record);

    const { status, message } = record.id
      ? await trackPromise(DefaultService.Entity_Update(ENTITY_API_KEY, record))
      : await trackPromise(DefaultService.Entity_Add(ENTITY_API_KEY, record));

    notify(message, status);
    if (status) {
      //setLogoImage(null);
      setRecordToEdit({});
      setShowEditForm(false);
      handleSearch();
    }
  };
  const onFinishFailed = async () => {
    notify("Please provide all the required input fields", false);
  };
  const { t } = useTranslation();
  const columns = [
    // {
    //   caption: "Organisation",
    //   dataField: "organisation.name",
    //   dataType: "string",
    //   alignment: "left",
    // },
    {
      caption: t("quick_setup_service_types_grid_industry"),
      dataField: "industry.name",
      dataType: "string",
      alignment: "left",
      grouped: false,
      width: 150,
    },

    {
      caption: t("quick_setup_technician_role_grid_technician_role"),
      dataField: "technician_role.name",
      dataType: "string",
      alignment: "left",
      grouped: false,
      width: 150,
    },

    {
      caption: t("general_range"),
      cellRender: (item) => {
        let d = item.data;
        return (
          <>
            <Row gutter={10}>
              <Col span={8} className="text-left text-grey">
                {t("general_low")}
              </Col>
              <Col span={8} className="text-left text-grey">
                {t("general_high")}
              </Col>
              <Col span={8} className="text-right text-grey">
                {t("general_percentage")}
              </Col>
            </Row>
            {d.ranges &&
              d.ranges.map((r) => {
                return (
                  <Row gutter={10}>
                    <Col span={8} className="text-left">
                      <NumberFormat
                        value={r.low_range}
                        thousandSeparator={true}
                        prefix={"$"}
                        displayType={"text"}
                        decimalScale={2}
                        fixedDecimalScale={true}
                      />
                    </Col>
                    <Col span={8} className="text-left">
                      <NumberFormat
                        value={r.high_range}
                        thousandSeparator={true}
                        prefix={"$"}
                        displayType={"text"}
                        decimalScale={2}
                        fixedDecimalScale={true}
                      />
                    </Col>
                    <Col span={8} className="text-right">
                      <NumberFormat
                        value={r.percentage}
                        thousandSeparator={true}
                        suffix={"%"}
                        displayType={"text"}
                        decimalScale={2}
                        fixedDecimalScale={true}
                      />
                    </Col>
                  </Row>
                );
              })}
          </>
        );
      },
    },
    {
      caption: t("label_active"),
      dataField: "is_active",
      dataType: "string",
      alignment: "center",
    },
  ];

  return (
    (
      <>
        <div className="flex mb-2">
          <PageTitle />
          <h3 className="push-right text-right">
            <Tooltip title={`Do you have more ${ENTITY_PLURAL}? Click here to add another`}>
              <Button className="bg-success" icon={<PlusCircleOutlined />} onClick={handleEdit}>
                {t("general_add_new_serv_com_par")}
              </Button>
            </Tooltip>
          </h3>
        </div>
        <div className="flex">
          <CustomDataGrid
            data={data}
            columns={columns}
            ENTITY={ENTITY}
            ENTITY_PLURAL={ENTITY_PLURAL}
            editHandler={handleEdit}
            deleteHandler={handleDelete}
            canDelete={true}
            canEdit={true}
          />
        </div>

        {showEditForm && (
          <Form_CommissionParameter
            form={form}
            showForm={showEditForm}
            recordToEdit={recordToEdit}
            handleCancel={handleCancel}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            ENTITY={ENTITY}
            data={{ organisation, industries, technicianRoles }}
          />
        )}
      </>
    ) || <h3>You need to select an organisation first</h3>
  );
};

export default CommissionParameters;
