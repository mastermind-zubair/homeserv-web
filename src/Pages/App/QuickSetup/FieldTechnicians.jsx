import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { alertify, notify } from "Services/ToastService";

import { Button, Form, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import LookupService from "Services/API/LookupService";
import { ProfilePhoto } from "Components/Common/Images";
import Form_FieldTechnician from "./Components/Form_FieldTechnician";
import DefaultService from "Services/API/DefaultService";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import { useTranslation } from "react-i18next";
import { GetStorage } from "Lib/StorageHelper";

const FieldTechnicians = (props) => {
  const { curOrg: organisation } = useContext(Context);
  const ENTITY = "Field Technician";
  const ENTITY_PLURAL = "Field Technicians";
  const ENTITY_API_KEY = "QS_Field_Technician";

  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const [roles, setRoles] = useState();
  const [technicianRoles, setTechnicianRoles] = useState();
  const [organisations, setOrganisations] = useState();
  const [industries, setIndustries] = useState();
  const [skills, setSkills] = useState();
  const [workingAreas, setWorkingAreas] = useState();
  const [serviceTypes, setServiceTypes] = useState();
  //const [subContractors, setSubContractors] = useState();
  const [jobTags, setJobTags] = useState();

  useEffect(async () => {
    if (organisation) {
      await handleSearch();
      let r = await LookupService.OfficeUserRoles({
        organisation_id: organisation.id,
      });
      let t = await LookupService.TechnicianRoles({
        organisation_id: organisation.id,
      });
      let i = await LookupService.Industries({
        organisation_id: organisation.id,
      });
      let o = await LookupService.Organisations();
      let s = await LookupService.getLookupByEntity("Settings_Skill");
      let w = await LookupService.getLookupByEntity("Settings_WorkingArea");
      let st = await LookupService.ServiceTypes({
        organisation_id: organisation.id,
      });
      //let sc = await LookupService.SubContractors({ organisation_id: organisation.id });
      let jt = await LookupService.JobTags({
        organisation_id: organisation.id,
      });

      setRoles(r);
      setTechnicianRoles(t);
      setOrganisations(o);
      setIndustries(i);
      setSkills(s);
      setWorkingAreas(w);
      setServiceTypes(st);
      //setSubContractors(sc);
      setJobTags(jt);
    }
  }, [organisation]);

  useEffect(() => {
    if (recordToEdit && recordToEdit.id === 0) {
      recordToEdit.licenses = [];
    }
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

  async function isValidLicenseForMoreTechnicians() {
    const { data } = await trackPromise(DefaultService.LisenceLimitations());

    let isValid = !data?.technician_max_limit_reached;
    return isValid;
  }

  const handleEdit = async (item) => {
    //console.log("Edit Handler", item);

    if (!item.licenses) {
      item.licenses = [];
    }

    // item.skills =
    //   item.skills &&
    //   item.skills.map((s) => {
    //     return s.id;
    //   });
    item.working_areas =
      (item.working_areas &&
        item.working_areas.map((w) => {
          return w.id;
        })) ||
      [];
    item.job_tags =
      (item.job_tags &&
        item.job_tags.map((j) => {
          return j.id;
        })) ||
      [];

    if (item.licenses) {
      let moment = require("moment");
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
      let isValid = await isValidLicenseForMoreTechnicians();
      if (!isValid) {
        alertify(
          "You have reached your licensed limit of adding more technicians. Please upgrade your license or contact administrator. Thanks.",
          false,
          10000
        );
        return;
      }
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
    // record.skills = record.skills.map((s) => {
    //   return { id: isNaN(s) ? 0 : s, name: isNaN(s) ? s : "" };
    // });
    record.working_areas = record.working_areas.map((s) => {
      return { id: isNaN(s) ? 0 : s, name: isNaN(s) ? s : "" };
    });
    //temp fix
    record.role = "USER";
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
      caption: t("quick_setup_office_users_form_username_email"),
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
      caption: t("quick_setup_office_users_form_contact_number"),
      dataField: "phone_number",
      dataType: "string",
      cellRender: (item) => {
        let row = item.data;
        return (
          <ul>
            <li> {row.mobile_number}</li>
            <li> {row.phone_number}</li>
          </ul>
        );
      },
    },
    {
      caption: t("general_industry"),
      dataField: "industry.name",
      dataType: "string",
      alignment: "left",
    },
    {
      caption: t("label_status"),
      dataField: "status",
      dataType: "string",
      alignment: "left",
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
            <Tooltip
              title={`Do you have more ${ENTITY_PLURAL}? Click here to add another`}
            >
              <Button
                className="bg-success"
                icon={<PlusCircleOutlined />}
                onClick={handleEdit}
              >
                {t("quick_setup_add_new_field_tech")}
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
          <Form_FieldTechnician
            form={form}
            showForm={showEditForm}
            recordToEdit={recordToEdit}
            handleCancel={handleCancel}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            ENTITY={ENTITY}
            data={{
              roles,
              organisations,
              industries,
              technicianRoles,
              workingAreas,
              skills,
              serviceTypes,
              jobTags,
            }}
          />
        )}
      </>
    )) || <h3>You need to select an organisation first</h3>
  );
};

export default FieldTechnicians;
