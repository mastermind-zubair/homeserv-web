import React, { useState, useEffect, useContext } from "react";

import {
  Button,
  Row,
  Col,
  Image,
  Card,
  Form,
  Space,
  Tooltip,
  Popconfirm,
  Switch,
} from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";
import { InfoList } from "Components/Common/InfoList";
import Form_Organisation from "./Components/Form_Organisation";
import { useTranslation } from "react-i18next";
import DefaultService from "Services/API/DefaultService";
import moment from "moment";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import AuthService from "Services/AuthService";
const Organisations = (props) => {
  const { t } = useTranslation();
  const ENTITY = "Organisation";
  const ENTITY_PLURAL = "Organisations";
  const ENTITY_API_KEY = "QS_Organisation";

  const { setUserOrgs } = useContext(Context);

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);
  const [formMode, setFormMode] = useState("create");

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const [logoImage, setLogoImage] = useState();

  useEffect(async () => {
    await handleSearch();
    return () => {
      //setData([]);
    };
  }, []);

  useEffect(() => form.resetFields(), [recordToEdit]);

  const handleSearch = async () => {
    let { data, status, message } = AuthService.isOfficer()
      ? await trackPromise(
          DefaultService.Get(
            ENTITY_API_KEY,
            AuthService.getCurrentOfficer().organisation_id
          )
        )
      : await trackPromise(DefaultService.Entity_List(ENTITY_API_KEY));
    notify(message, status);

    data = !Array.isArray(data) ? [data] : data;
    setData(data);
    setUserOrgs(data);
  };
  const handleEditForm = async (item) => {
    let record = {};
    setLogoImage(null);
    if (item.id) {
      setFormMode("edit");
      record = { ...item };
      record.financial_year_start = moment(record.financial_year_start);
    } else {
      setFormMode("create");
      record.financial_year_start = moment("2022-01-01");
      record.credits = 250;
    }
    setRecordToEdit(record);

    setShowEditForm(true);
  };

  const handleCancel = () => {
    setShowEditForm(false);
  };

  const handleDelete = async (id) => {
    let { status, message } = await trackPromise(
      DefaultService.Entity_Delete(ENTITY_API_KEY, id)
    );
    notify(message, status);
    //if deleted organisation is currently selected, remove it from local storage.
    // let org = OrganisationManager.GetSelectedOrganisation();
    // if (org && org.id === id) {
    //   OrganisationManager.RemoveSelectedOrganisation();
    // }
    //setUserOrgs

    await handleSearch();
  };

  const onFinish = async (values) => {
    //console.log(files);

    /* if files need to be uploaded with formData 
    const formData = new FormData();
     files.forEach((file) => {
       formData.append("files[]", file);
     });
    */
    let record = { ...values };
    record.is_default = values.is_default || false;
    if (!record.id && record.credits === undefined) {
      record.credits = 250;
    }

    const duplicateOrganisation = data?.find(
      (org) =>
        org.id !== record.id &&
        org.name?.trim().toLowerCase() === record.name?.trim().toLowerCase()
    );
    if (duplicateOrganisation) {
      form.setFields([
        {
          name: "name",
          errors: ["Organisation name must be unique"],
        },
      ]);
      notify("Organisation name must be unique", false);
      return;
    }

    if (logoImage) {
      record.business_logo = logoImage.base64.substring(
        logoImage.base64.indexOf(",") + 1
      );
    }
    const { status, message } = record.id
      ? await trackPromise(DefaultService.Entity_Update(ENTITY_API_KEY, record))
      : await trackPromise(DefaultService.Entity_Add(ENTITY_API_KEY, record));

    notify(message, status);
    if (status) {
      setLogoImage(null);
      setRecordToEdit({});
      setShowEditForm(false);
      handleSearch();
    }
  };
  const onFinishFailed = async () => {
    notify("Please provide all the required input fields", false);
  };

  const handleUploadChange = (newFile) => {
    //setFiles([...files, newfile]);
    setLogoImage(newFile);
  };
  /* PROPS FOR ANT-DESIGN FILE UPLOAD CONTROL
  const uploadProps = {
    onRemove: (file) => {
      const index = files.indexOf(file);
      const newFileList = files.slice();
      newFileList.splice(index, 1);
      setFiles(newFileList);
    },
    beforeUpload: (file) => {
      setFiles([...files, file]);
      return false;
    },
    files,
  };
*/

  const handleSetDefault = async (item) => {
    //console.log(item);
    item.is_default = true;
    const { status, message } = await trackPromise(
      DefaultService.Entity_Update(ENTITY_API_KEY, item)
    );
    if (status) {
      notify(`'${item.name}' has been set as your default organisation`, true);
      handleSearch();
    } else notify(message, status);
  };
  return (
    <>
      <div className="flex mb-2">
        <PageTitle />
        <h3 className="push-right text-right">
          <Tooltip
            title={`Do you have more ${ENTITY_PLURAL}? Click here to add another`}
          >
            <Button
              className="bg-success"
              icon={<PlusCircleOutlined />}
              onClick={handleEditForm}
            >
              {t("quick_setup_modal_heading")}
            </Button>
          </Tooltip>
        </h3>
      </div>

      <Row gutter={24} className="fill-height">
        {data &&
          data.map((d, i) => {
            return (
              <Col xl={8} xs={24} key={`org_${i}`} className="mb-2">
                <Card className="info-card">
                  <div className="flex">
                    <div className="mr-2">
                      <p className="text-heading">{d.name}</p>

                      <InfoList
                        obj={{
                          address: d.address,
                          ACN$ABN: d.acn_abn,
                          bsb_number: d.bsb_number,
                          account_number: d.account_number,
                          contractor_license_number:
                            d.contractor_license_number,
                          tax_rate: `${d.tax_rate}%`,
                          financial_year_start: `${moment(
                            d.financial_year_start
                          ).format("DD-MM-yyyy")}`,
                          date_format: `${d.date_format}`,
                          currency_id: `${d.currency.symbol}`,
                          utc_offset_minutes: `${d.utc_offset_minutes}`,
                        }}
                      />
                    </div>
                    <div className="ml-auto">
                      <Space align="end" direction="vertical">
                        <Image
                          src={`data:image/jpeg;base64,${d.business_logo}`}
                          style={{ width: "100px" }}
                        />
                        <Tooltip
                          title={`Option to set this organisation as default`}
                          placement="bottom"
                        >
                          <Popconfirm
                            title={`Are you sure to set this ${ENTITY} as default?`}
                            onConfirm={() => handleSetDefault(d)}
                          >
                            <Switch
                              style={{ border: "none" }}
                              checked={d.is_default}
                              checkedChildren={<span>Default</span>}
                              unCheckedChildren={<span></span>}
                            />
                          </Popconfirm>
                        </Tooltip>
                      </Space>
                    </div>
                  </div>
                  <div className=""></div>
                  <div className="box-bottom-right">
                    <Space>
                      <Popconfirm
                        title={`Are you sure to remove this organisation? ${
                          d.is_default
                            ? "By removing a default organisation, you need to manually set another organisation as default"
                            : ""
                        }`}
                        onConfirm={() => handleDelete(d.id)}
                      >
                        <Button type="danger" icon={<CloseOutlined />}>
                          {t("general_remove")}
                        </Button>
                      </Popconfirm>
                      <Button
                        type="primary"
                        onClick={() => {
                          handleEditForm(d);
                        }}
                        icon={<EditOutlined />}
                      >
                        {t("general_edit")}
                      </Button>
                    </Space>
                  </div>
                </Card>
              </Col>
            );
          })}
      </Row>

      <Form_Organisation
        form={form}
        showForm={showEditForm}
        recordToEdit={recordToEdit}
        handleCancel={handleCancel}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        handleUploadChange={handleUploadChange}
        logoImage={logoImage}
        mode={formMode}
        ENTITY={ENTITY}
      />
    </>
  );
};

export default Organisations;
