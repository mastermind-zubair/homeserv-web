import { Button, Col, Row, Space } from "antd";
import { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { trackPromise } from "react-promise-tracker";
import DefaultService from "Services/API/DefaultService";
import { notify } from "Services/ToastService";
import { DataGrid, DropDownBox } from "devextreme-react";
import {
  FilterRow,
  Paging,
  Scrolling,
  Selection,
} from "devextreme-react/data-grid";
import Context from "Store/Context";
const JobSelection = ({ jobSelected, nextButtonTitle }) => {
  const { curOrg: organisation } = useContext(Context);
  const { t } = useTranslation();

  const [jobs, setJobs] = useState();
  const [jobBoxValue, setJobBoxValue] = useState([]);
  const [isJobBoxOpened, setIsJobBoxOpened] = useState(false);

  useEffect(async () => {
    let { data: JOBS, status } = await trackPromise(
      DefaultService.POST("/job/list", {
        condition: {
          main: {
            organisation_id: organisation.id,
            job_status_id: 1,
          },
        },
      })
    );

    notify(JOBS?.length || "No" + " Jobs found", status);

    setJobs(JOBS);
  }, [organisation]);

  const jobGridRender = () => {
    return (
      <DataGrid
        dataSource={jobs}
        columns={[
          { caption: "Job#", dataField: "id" },
          { caption: "Customer", dataField: "customer.full_name" },
          { caption: "Industry", dataField: "industry.name" },
          { caption: "Service Type", dataField: "service_type.name" },
          { caption: "Job Priority", dataField: "job_priority.name" },
        ]}
        hoverStateEnabled={true}
        selectedRowKeys={jobBoxValue}
        onSelectionChanged={jobGridOnSelectionChanged}
        height="100%"
      >
        <FilterRow
          visible={true}
          applyFilter={{
            key: "onClick",
            name: "On Button Click",
          }}
        />
        <Selection mode="single" />
        <Scrolling mode="virtual" />
        <Paging enabled={true} pageSize={10} />
      </DataGrid>
    );
  };

  const syncJobGridSelection = (e) => {
    // console.log("sync selection", e);
    setJobBoxValue(e.value);
  };

  const jobGridOnSelectionChanged = (e) => {
    //console.log("Selected Item", e);
    if (e.selectedRowKeys?.length > 0) {
      //setJobBoxValue([e.selectedRowKeys[0]?.id]);
      setJobBoxValue([e.selectedRowKeys[0]]);
      setIsJobBoxOpened(false);
    }
  };

  const jobBoxDisplayExpr = (item) => {
    //console.log("Item to display", item);
    if (!item) return "Please select a customer/job to continue";
    return `${item?.customer?.full_name} - [${item?.industry.name}] - [${item?.service_type.name}]`;
  };

  const onJobBoxOpened = (e) => {
    // notify(e.name);
    if (e.name === "opened") {
      setIsJobBoxOpened(e.value);
    }
  };

  return (
    <>
      <Row style={{ width: "100%" }}>
        <Col xs={24}>
          <h3>Select a customer & job</h3>
        </Col>
        <Col xs={21} style={{ width: "100%" }}>
          {(jobs?.length > 0 && (
            <DropDownBox
              value={
                jobBoxValue && jobBoxValue.length > 0 && jobBoxValue[0]?.id
              }
              opened={isJobBoxOpened}
              valueExpr="id"
              deferRendering={false}
              displayExpr={jobBoxDisplayExpr}
              placeholder="Select a job..."
              showClearButton={true}
              dataSource={jobs}
              onValueChanged={syncJobGridSelection}
              onOptionChanged={(obj) => {
                //console.log(obj);
                onJobBoxOpened(obj);
              }}
              contentRender={jobGridRender}
              width="100%"
            />
          )) ||
            "No jobs found"}
        </Col>
        <Col xs={3}>
          <Button
            className="text-larger ml-2"
            size="large"
            onClick={() =>
              !jobBoxValue || jobBoxValue.length === 0
                ? notify("No Customer/Job selected", false)
                : jobSelected((jobBoxValue && jobBoxValue[0]) || null)
            }
          >
            {nextButtonTitle}
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="my-5 py-5 text-center push-center"></div>
        </Col>
      </Row>
    </>
  );
};

export default JobSelection;
