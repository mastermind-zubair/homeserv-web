import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Form, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import DefaultService from "Services/API/DefaultService";
import LookupService from "Services/API/LookupService";
import Form_OfficeUser from "./Components/Form_OfficeUser";
import { ProfilePhoto } from "Components/Common/Images";
import { useTranslation } from "react-i18next";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";

const OfficeUsers = (props) => {
  const { curOrg: organisation } = useContext(Context);
  const ENTITY = "Office User";
  const ENTITY_PLURAL = "Office Users";
  const ENTITY_API_KEY = "QS_Office_User";

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const [roles, setRoles] = useState();
  useEffect(async () => {
    if (organisation) {
      await handleSearch();
      let r = await LookupService.OfficeUserRoles();
      setRoles(r);
    }
  }, [organisation]);

  useEffect(() => {
    form.resetFields();
  }, [recordToEdit]);

  const handleSearch = async () => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List(ENTITY_API_KEY, {
        organisation_id: organisation.id,
      })
    );
    notify(message, status);
    setData(data);
  };
  const handleEdit = async (item) => {
    let record = {};
    if (item.id) {
      record = { ...item };
    } else {
      record.organisation_id = organisation.id;
    }
    setRecordToEdit(record);

    setShowEditForm(true);
  };

  const handleDelete = async (item) => {
    //console.log("Delete Handler", item);
    let { status, message } = await trackPromise(
      DefaultService.Entity_Delete(ENTITY_API_KEY, item.id)
    );
    notify(message, status);
    await handleSearch();
  };

  const handleCancel = () => {
    setShowEditForm(false);
  };

  const onFinish = async (values) => {
    let record = values;

    if (values.role) {
      record.role_id = values.role;
      record.role = roles.find((r) => r.value === values.role).label;
    }
    console.log("record: ", record);

    const { status, message } = record.id
      ? await trackPromise(DefaultService.Entity_Update(ENTITY_API_KEY, record))
      : await trackPromise(DefaultService.Entity_Add(ENTITY_API_KEY, record));

    notify(message, status);
    if (status) {
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
    {
      caption: t("quick_setup_office_users_grid_photo"),
      dataField: "id",
      dataType: "string",
      alignment: "center",
      className: "bg-primary",
      style: { maxWidth: "50px", backgroundColor: "red" },
      cellRender: (item) => {
        let row = item.row.data;
        return (
          <>
            <ProfilePhoto filename={row.profile_pic} width={60} />
          </>
        );
      },
    },
    {
      caption: t("quick_setup_office_users_grid_user_name"),
      dataField: "username",
      dataType: "string",
      cellRender: (itemData) => {
        return <b>{itemData.text}</b>;
      },
      showSummary: true,
      summaryType: "count",
    },
    {
      caption: t("quick_setup_office_users_grid_display_name"),
      dataField: "first_name",
      dataType: "string",
      cellRender: (item) => {
        let row = item.data;
        return (
          <>
            {row.first_name} {row.last_name}
          </>
        );
      },
    },
    {
      caption: t("quick_setup_office_users_grid_role"),
      dataField: "role",
      dataType: "string",
    },
    {
      caption: t("quick_setup_office_users_grid_contact_name"),
      dataField: "contact_number",
      dataType: "string",
    },
    {
      caption: t("quick_setup_service_types_form_active"),
      dataField: "is_active",
      dataType: "string",
      alignment: "center",
    },
  ];

  return (
    (organisation && (
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
                onClick={handleEdit}
              >
                {t("quick_setup_add_new_office_user")}
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
            canEdit={true}
            canDelete={true}
          />
        </div>

        {showEditForm && (
          <Form_OfficeUser
            form={form}
            showForm={showEditForm}
            recordToEdit={recordToEdit}
            handleCancel={handleCancel}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            ENTITY={ENTITY}
            data={{ roles }}
          />
        )}
      </>
    )) || <h3>You need to select an organisation first</h3>
  );
};

export default OfficeUsers;
