import React, { useState, useEffect, useContext, useTransition } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Form, Tooltip } from "antd";
import { PlusCircleOutlined, UserOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import DefaultService from "Services/API/DefaultService";
import Form_ProjectTeam from "./Components/Form_ProjectTeam";
import LookupService from "Services/API/LookupService";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import { useTranslation } from "react-i18next";

const ProjectTeams = (props) => {
  const { curOrg: organisation } = useContext(Context);
  const ENTITY = "Project Team";
  const ENTITY_PLURAL = "Project Teams";
  const ENTITY_API_KEY = "QS_Project_Team";

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const [organisations, setOrganisations] = useState();
  const [industries, setIndustries] = useState();
  const { t } = useTranslation();
  useEffect(async () => {
    if (organisation) {
      await handleSearch();
      let o = await LookupService.Organisations();
      let i = await LookupService.Industries({ organisation_id: organisation.id });

      setOrganisations(o);
      setIndustries(i);
    }
  }, [organisation]);

  useEffect(() => {
    if (recordToEdit && recordToEdit.id === 0) {
      //recordToEdit.licenses = [];
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
    let record = {};
    if (item.id) {
      record = { ...item };

      let manager = record.members && record.members.find((m) => m.is_manager === true);
      record.manager_id = manager && manager.id;

      record.members =
        record.members &&
        record.members.map((m) => {
          return m.id;
        });
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

    record.members = record.members.map((r) => {
      return { user_id: r, is_manager: record.manager_id === r ? true : false };
    });

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

  const columns = [
    {
      caption: t("general_team_name"),
      dataField: "name",
      dataType: "string",
      alignment: "left",
    },

    {
      caption: t("side_menu_dropdown_organization_title"),
      dataField: "organisation.name",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_industry"),
      dataField: "industry.name",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("general_members"),
      dataField: "id",
      dataType: "string",
      cellRender: (item) => {
        let row = item.data;
        return (
          <ul className="list-nostyle">
            {row.members &&
              row.members.map((m, i) => {
                return (
                  <li>
                    <UserOutlined className={`${m.is_manager ? "text-success" : "text-primary"}`} /> {m.display_name}{" "}
                    {m.is_manager ? "(M)" : ""}
                  </li>
                );
              })}
          </ul>
        );
      },
    },

    {
      caption: t("general_active"),
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
            <Tooltip title={`Do you have more ${ENTITY_PLURAL}? Click here to add another`}>
              <Button className="bg-success" icon={<PlusCircleOutlined />} onClick={handleEdit}>
                {t("general_add_new_project_team")}
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
          <Form_ProjectTeam
            form={form}
            showForm={showEditForm}
            recordToEdit={recordToEdit}
            handleCancel={handleCancel}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            ENTITY={ENTITY}
            data={{ organisations, industries }}
          />
        )}
      </>
    )) || <h3>Please select an organisation first</h3>
  );
};

export default ProjectTeams;
