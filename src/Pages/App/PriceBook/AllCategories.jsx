import React, { useState, useEffect, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import { Button, Checkbox, Col, Form, Image, Popconfirm, Row, Select, Space, Table, Tooltip, Tree } from "antd";
import {
  DeleteFilled,
  EditFilled,
  PlusCircleOutlined,
  SubnodeOutlined,
  TagOutlined,
  UserOutlined,
} from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import moment from "moment";
import LookupService from "Services/API/LookupService";
import DefaultService from "Services/API/DefaultService";
import Form_Category from "./Components/Form_Category";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import _ from "lodash";
import { useTranslation } from "react-i18next";



const { DirectoryTree } = Tree;
const AllCategories = (props) => {
  const ENTITY = "Service Category";
  const ENTITY_PLURAL = "Service Categories";
  const ENTITY_API_KEY = "PriceBook_ServiceCategory";

  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [recordToEdit, setRecordToEdit] = useState();

  const [industries, setIndustries] = useState();
  const [selectedIndustryId, setSelectedIndustryId] = useState();
  const { curOrg: organisation } = useContext(Context);

  useEffect(async () => {
    if (organisation) {
      setIndustries(await trackPromise(LookupService.Industries({ organisation_id: organisation.id })));
      await handleSearch();
    }
  }, [organisation]);

  useEffect(() => {
    if (recordToEdit && recordToEdit.id === 0) {
      //recordToEdit.ranges = [];
    }
    form.resetFields();
  }, [recordToEdit]);

  const handleSearch = async () => {
    let { data, status, message } = await trackPromise(
      DefaultService.Entity_List(ENTITY_API_KEY, { organisation_id: organisation.id }, [["sort_order", "ASC"]])
    );
    !status && notify(message, status);
    data =
      data &&
      data.map((d) => {
        return { ...d, key: d.id, is_active: d.is_active ? "Yes" : "No" };
      });

    setData(data);
  };
  const handleEdit = async (item) => {
    console.log("Edit Handler", item);

    let record = item;
    if (item.id) {
      const { data } = await trackPromise(DefaultService.Entity_Get(ENTITY_API_KEY, item.id));
      record = { ...data };
    } else {
      record.organisation_id = organisation.id;
      record.sort_order = item.sort_order || 1;
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
    record.parent_category_id = record.parent_category_id || null;
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
    { title: t("general_category"), dataIndex: "title", key: "title", className: "ant-table-cell" },
    { title: t("general_description"), dataIndex: "description", key: "description", className: "ant-table-cell" },
    { title: t("general_sort_order"), dataIndex: "sort_order", key: "sort_order", className: "ant-table-cell" },
    {
      title: t("general_active"),
      dataIndex: "is_active",
      key: "is_active",
      className: "ant-table-cell",
      align: "center",
      // render: (value, record) => {
      //   return (value && <b className="text-success">Yes</b>) || <b className="text-danger">No</b>;
      // },
    },
    {

      title: t("general_sub_category"),
      dataIndex: "id",
      key: "operation",
      align: "center",
      render: (value, record) => (
        <SubnodeOutlined
          title={`Add a new child category under "${record.title}"`}
          onClick={(event) => {
            event.stopPropagation();
            handleEdit({
              id: null,
              parent_category_id: value,
              industry_id: record.industry_id || selectedIndustryId,
              sort_order: getNextSortOrder(record),
            });
          }}
          className="text-success text-large"
        />
      ),
    },
    {
      title: "",
      dataIndex: "id",
      key: "operation",
      align: "center",
      render: (value, record) => (
        <Space size={20} align="center">
          <EditFilled
            title={`id: ${value}`}
            onClick={(event) => {
              event.stopPropagation();
              console.log(value);
              handleEdit({ id: value });
            }}
            className="text-primary text-large"
          />

          <Popconfirm
            title={`Are you sure to remove this ${ENTITY}`}
            onConfirm={(event) => {
              event.stopPropagation();
              console.log(value);
              handleDelete({ id: value });
            }}
          >
            <DeleteFilled className="text-danger text-large" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onIndustryChanged = async (i) => {
    let { data: cTree } = await trackPromise(
      DefaultService.Entity_List(ENTITY_API_KEY, { organisation_id: organisation.id, industry_id: i })
    );
    setData(cTree);
    setSelectedIndustryId(i);
  };

  function getNextSortOrder(category) {
    console.log("category", category);
    let subCatWithMaxSortOrder;
    if (category && category.children && category.children.length > 0) {
      subCatWithMaxSortOrder = _.maxBy(category.children, function (o) {
        return o.sort_order || 0;
      });
    }
    return (subCatWithMaxSortOrder && subCatWithMaxSortOrder.sort_order + 1) || 1;
  }

  return (
    <>
      <div className="flex mb-2">
        <PageTitle />
        <h3 className="push-right push-right">
          <Space>
            <Tooltip title={`Select an industry to see its service categories on this page`}>
              {t("quick_setup_service_types_grid_industry")} &nbsp;
              <Select
                multiple={false}
                options={industries}
                onChange={(i) => onIndustryChanged(i)}
                style={{ width: "150px" }}
              />
            </Tooltip>

            <Tooltip title={`Do you have more ${ENTITY_PLURAL}? Click here to add another`}>
              <Button className="bg-success" icon={<PlusCircleOutlined />} onClick={handleEdit}>
                {t("quick_setup_job_tags_modal_add_new_job_tag")}
              </Button>
            </Tooltip>
          </Space>
        </h3>
      </div>
      <div className="flex ml-auto mr-auto">
        {/* <CustomDataGrid
          data={data}
          columns={columns}
          ENTITY={ENTITY}
          ENTITY_PLURAL={ENTITY_PLURAL}
          editHandler={handleEdit}
          deleteHandler={handleDelete}
          canDelete={true}
          canEdit={true}
        /> */}

        {/* <DirectoryTree
          multiple={false}
          treeData={data}
          fieldNames={{ title: "title", key: "id", children: "children" }}
          // onClick={(item) => handleEdit(item)}
          onExpand={() => {
            console.log("tree node expanded");
          }}
          onSelect={(e) => {
            console.log("tree node selected", e);
          }}
        /> */}

        <Table
          className="ant-table-custom"
          style={{ width: "100%" }}
          cellClassName="ant-table-cell"
          rowClassName="dx-row dx-data-row dx-row-lines dx-column-lines dx-row-alt"
          columns={columns}
          expandable={true}
          dataSource={data}
          rowkey={(record) => record.id}
          pagination={false}
        />
      </div>

      {showEditForm && (
        <Form_Category
          form={form}
          showForm={showEditForm}
          recordToEdit={recordToEdit}
          handleCancel={handleCancel}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          ENTITY={ENTITY}
          data={{ organisation, industries, selectedIndustryId }}
        />
      )}
    </>
  );
};

export default AllCategories;
