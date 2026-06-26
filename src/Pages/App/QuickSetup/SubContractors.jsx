import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Form, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import DefaultService from "Services/API/DefaultService";
import LookupService from "Services/API/LookupService";
import { ProfilePhoto } from "Components/Common/Images";
import Form_SubContractor from "./Components/Form_SubContractor";
import moment from "moment";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";

const SubContractors = (props) => {
  const { curOrg: organisation } = useContext(Context);
  const ENTITY = "Sub Contractor";
  const ENTITY_PLURAL = "Sub Contractors";
  const ENTITY_API_KEY = "QS_Sub_Contractor";

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const [roles, setRoles] = useState();
  const [technicianRoles, setTechnicianRoles] = useState();
  const [organisations, setOrganisations] = useState();
  const [skills, setSkills] = useState();
  const [workingAreas, setWorkingAreas] = useState();

  useEffect(async () => {
    if (organisation) {
      await handleSearch();
      let r = await LookupService.OfficeUserRoles();
      let t = await LookupService.TechnicianRoles();
      let o = await LookupService.Organisations();
      let s = await LookupService.getLookupByEntity("Settings_Skill");
      let w = await LookupService.getLookupByEntity("Settings_WorkingArea");

      setRoles(r);
      setTechnicianRoles(t);
      setOrganisations(o);
      setSkills(s);
      setWorkingAreas(w);
    }
  }, [organisation]);

  useEffect(() => {
    form.resetFields();
  }, [recordToEdit]);

  const handleSearch = async () => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List(ENTITY_API_KEY, { organisation_id: organisation.id })
    );
    notify(message, status);
    setData(data);
  };
  const handleEdit = async (item) => {
    if (!item.licenses) {
      item.licenses = [];
    }

    item.skills =
      item.skills &&
      item.skills.map((s) => {
        return s.id;
      });
    item.working_areas =
      (item.working_areas &&
        item.working_areas.map((w) => {
          return w.id;
        })) ||
      [];

    if (item.licenses) {
      item.licenses = item.licenses.map((l) => {
        return {
          ...l,
          expiry: moment(l.expiry),
        };
      });
    }
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
    record.skills = record.skills.map((s) => {
      return { id: isNaN(s) ? 0 : s, name: isNaN(s) ? s : "" };
    });
    record.working_areas = record.working_areas.map((s) => {
      return { id: isNaN(s) ? 0 : s, name: isNaN(s) ? s : "" };
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
      let s = await LookupService.Skills();
      let w = await LookupService.WorkingAreas();
      setSkills(s);
      setWorkingAreas(w);
      handleSearch();
    }
  };
  const onFinishFailed = async () => {
    notify("Please provide all the required input fields", false);
  };

  const columns = [
    {
      caption: "Photo",
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
      caption: "Company Name",
      dataField: "company_name",
      dataType: "string",
    },
    {
      caption: "Username",
      dataField: "username",
      dataType: "string",
      cellRender: (itemData) => {
        return <b>{itemData.text}</b>;
      },
      showSummary: true,
      summaryType: "count",
    },
    {
      caption: "Display name",
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
      caption: "Contact number",
      dataField: "phone_number",
      dataType: "string",
      cellRender: (item) => {
        let row = item.data;
        return (
          <ul>
            <li>{row.phone_number}</li>
            <li> {row.mobile_number}</li>
          </ul>
        );
      },
    },
    {
      caption: "Email",
      dataField: "email",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: "Industry",
      dataField: "technician_role.industry",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: "Active",
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
                Add New {ENTITY}
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
          <Form_SubContractor
            form={form}
            showForm={showEditForm}
            recordToEdit={recordToEdit}
            handleCancel={handleCancel}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            ENTITY={ENTITY}
            data={{ roles, organisations, technicianRoles, workingAreas, skills }}
          />
        )}
      </>
    )) || <h3>You need to select an organisation first</h3>
  );
};

export default SubContractors;
