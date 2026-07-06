import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Row,
  Col,
  List,
  Button,
  Switch,
  Typography,
  Space,
} from "antd";
import {
  SchedulerData,
  ViewTypes,
  DATE_FORMAT,
  DnDSource,
} from "react-big-scheduler";
import moment from "moment";
import { notify } from "Services/ToastService";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import JobAssignment from "./Components/JobAssignment";
import DefaultService from "Services/API/DefaultService";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";
import { AppPage, GridPanel, PageHeader, PageSection, PageToolbar } from "../_Common/AppPage";
import JobItem from "./Components/JobItem";
import JobDetails from "./Components/JobDetails";
import { JOB_STATUS } from "Pages/Common/Constants";
import MapView from "./Components/MapView";
import { useTranslation } from "react-i18next";
import JobLegend from "./Components/JobLegend";
import TaskView from "./Components/TaskView";
import TaskDetailView from "./Components/TaskDetailView";

const Dispatching = (props) => {
  const date_format = "YYYY-MM-DD HH:mm:ss";
  // const bgColor = {
  //   1: "#808080", // unassigned
  //   2: "#F7931E", // new
  //   3: "#9E005D", // estimated
  //   4: "#C1272D", // approved estimate
  //   5: "#009245", // in progress
  //   6: "#93278F", // on going
  //   7: "#FF0000", // cancelled
  //   8: "#000000", // closed
  //   9: "#2e3192", // completed
  //   10: "#29ABE2", // moving
  //   11: "#0071BC", // arrived
  //   12: "#8CC63F", // estimating
  //   13: "#754C24", // payment received
  //   14: "#35586A", // confirmed
  // };
  const { t } = useTranslation();
  const allowedJobStatus = [
    JOB_STATUS.UNASSIGNED,
    JOB_STATUS.APPROVED,
    JOB_STATUS.ON_GOING,
  ];
  const { curOrg: organisation } = useContext(Context);
  const [dateFormat, setDateFormat] = useState("YYYY-MM-dd");
  const [JobStatus, setJobStatus] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [SData, setSData] = useState(null);
  const [forceupdate, setForceUpdate] = useState(0);

  const [ShowJobDetail, setShowJobDetail] = useState(false);
  const [SelectedJob, setSelectedJob] = useState(null);
  const [lockGrid, setLockGrid] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [fieldTechnicians, setFieldTechnicians] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const FIELD_TECHNICIAN_API_KEY = "QS_Field_Technician";
  const TEAMS_API_KEY = "QS_Project_Team";
  const JOB_STATUS_API_KEY = "Job_Status";
  const JOBS_API_KEY = "JOB";
  const TIME_SLOT_API_KEY = "TIME_SLOT";
  const QUERY_API_KEY = "Query_Data";

  const JOB_CHANGE = {
    NEW_ASSSIGNED: 1,
    CHANGE_TIME: 2,
    CHANGE_ASSIGNEE: 3,
    CHANGE_DURATION: 4,
    CANCELLED: 5,
  };
  let dndSource = new DnDSource(
    (props) => {
      return props.job;
    },
    JobItem,
    "JOB"
  );
  let DnDJobItem = dndSource.getDragSource();

  const loadResources = useCallback(async (organisation_id) => {
    let Jobs = [];
    let TimeSlots = [];
    let {
      data: { 
        field_technicians: { data: FTData }, 
        teams: { data:TData }, 
        time_slots: { data: TSData }, 
        job_statuses: { data:JobStatusData }, 
        job_priorities : { data:job_priority },
        jobs: { data: JData },
      },
      status: AllStatus,
    } = await DefaultService.GetOneTime("dispatching",{
      field_technician: { organisation_id },
      team: { organisation_id },
      time_slot: { organisation_id },
      job_status: { organisation_id },
      job_priority: { organisation_id },
      job: { main: { organisation_id } },
    });

    const JStatus = AllStatus;
    const FTStatus = AllStatus;
    const TStatus = AllStatus;
    const JSstatus = AllStatus;
    let job_status = [...JobStatusData];
    if (AllStatus) {
      TimeSlots = TSData.map((item) => {
        var start = moment(item.slot_date);
        var end = moment(item.slot_date);
        end.add(item.slot_duration, "minutes");

        return {
          id: "_" + item.id,
          is_job: false,
          start: start.format(date_format),
          end: end.format(date_format),
          resourceId: `ft_${item.field_technician_id}`,
          title: `${item.title}`,
          bgColor: "black",
          color: "white",
          job_status_id: 299,
        };
      });
    }
    // let { data: FTData, status: FTStatus } = await DefaultService.Entity_List(
    //   FIELD_TECHNICIAN_API_KEY,
    //   {
    //     organisation_id,
    //   }
    // );

    // let { data: TData, status: TStatus } = await DefaultService.Entity_List(
    //   TEAMS_API_KEY,
    //   { organisation_id }
    // );

    // let { data: TSData, status: TSStatus } = await DefaultService.Entity_List(
    //   TIME_SLOT_API_KEY,
    //   { organisation_id }
    // );

    // if (TSStatus) {
    //   TimeSlots = TSData.map((item) => {
    //     var start = moment(item.slot_date);
    //     var end = moment(item.slot_date);
    //     end.add(item.slot_duration, "minutes");

    //     return {
    //       id: "_" + item.id,
    //       is_job: false,
    //       start: start.format(date_format),
    //       end: end.format(date_format),
    //       resourceId: `ft_${item.field_technician_id}`,
    //       title: `${item.title}`,
    //       bgColor: "black",
    //       color: "white",
    //       job_status_id: 299,
    //     };
    //   });
    // }

    // let { data: JobStatusData, status: JSstatus } =
    //   await DefaultService.Entity_List(JOB_STATUS_API_KEY);

    // let { data: JData, status: JStatus } = await DefaultService.Entity_List(
    //   JOBS_API_KEY,
    //   {
    //     main: { organisation_id },
    //   }
    // );

    // let {
    //   data: { job_status, job_priority },
    // } = await DefaultService.Entity_Query(
    //   QUERY_API_KEY,
    //   ["job_status", "job_priority"],
    //   { organisation_id }
    // );

    let emergency_priority = job_priority.filter(
      (jp) => jp.name.toUpperCase() === "EMERGENCY"
    )[0];
    if (JStatus)
      Jobs = JData.map((job) => {
        var start = moment(job.need_at);
        var end = moment(job.need_at);
        end.add(job.job_duration_mins, "minutes");

        return {
          id: job.id,
          is_job: true,
          start: start.format(date_format),
          end: end.format(date_format),
          resourceId:
            job.team_id === null
              ? job.field_technician_id == null
                ? ""
                : `ft_${job.field_technician_id}`
              : `t_${job.team_id}`,
          title: `${
            job.job_site_address ? job.job_site_address.city : ""
          }`,
          // title: `${
          //   job.service_type ? job.service_type.name : ""
          // } - [${job.job_tags.map((v) => v.name).join("][")}]`,
          bgColor: job.job_status.bg_color,
          color: job.job_status.color,
          job_status_id: job.job_status_id,
        };
      });

    let ft_data = [];

    if (FTStatus) {
      ft_data = FTData.map((v) => ({
        id: `ft_${v.id}`,
        name: v.display_name,
        parentId: "ft_0",
      }));
      setFieldTechnicians(
        FTData.map((v) => ({
          id: v.id,
          name: v.display_name,
        }))
      );
    }

    let t_data = [];
    if (TStatus) {
      t_data = TData.map((v) => ({
        id: `t_${v.id}`,
        name: v.name,
        parentId: "t_0",
      }));
      setTeams(TData.map((v) => ({ id: v.id, name: v.name })));
    }

    let t_js_data = [];
    if (JSstatus)
      t_js_data = JobStatusData.map((v) => ({
        id: `js_${v.sort_order}`,
        name: v.name,
        bg_color: v.bg_color,
        color: v.color,
      }));

    setStatusList(t_js_data);

    ft_data.unshift({
      id: "ft_0",
      name: t("side_menu_navigation_quick_setup_sub_field_technicians"),
      groupOnly: true,
    });

    t_data.unshift({
      id: "t_0",
      name: t("general_teams"),
      groupOnly: true,
    });

    const all_resources = [...ft_data, ...t_data];

    let sd = new SchedulerData(
      new moment().format(DATE_FORMAT),
      ViewTypes.Day,
      false,
      false,
      {
        eventItemPopoverEnabled: false,
        checkConflict: true,
      }
    );

    sd.setResources(all_resources);
    var events = Jobs.concat(TimeSlots).filter((v) => v.resourceId !== "");
    // var events = TimeSlots;

    sd.setEvents(events);
    setSData(sd);

    job_status = job_status.filter((v) => allowedJobStatus.includes(v.id));

    var group_by_status = JData.reduce((pv, v) => {
      if (pv[v.job_status_id] === undefined) pv[v.job_status_id] = [];
      pv[v.job_status_id].push(v);
      return pv;
    }, {});

    job_status.forEach((v) => {
      v.items = group_by_status[v.id];
      if (v.items === undefined) v.items = [];
    });
    //UNDEFINED CHECK BY BILAL
    var urgent_unassigned_jobs =
      group_by_status[JOB_STATUS.UNASSIGNED] === undefined
        ? []
        : group_by_status[JOB_STATUS.UNASSIGNED]
            .filter((v) => v?.job_priority_id === emergency_priority?.id)
            .map((v) => ({ ...v, job_status_id: 0 }));
    var regular_unassigned_jobs =
      group_by_status[JOB_STATUS.UNASSIGNED] === undefined
        ? []
        : group_by_status[JOB_STATUS.UNASSIGNED].filter(
            (v) => v?.job_priority_id !== emergency_priority?.id
          );

    job_status.unshift({
      id: 0,
      name: "UNASSIGNED - URGENT",
      items: urgent_unassigned_jobs,
    });
    job_status[1].items = regular_unassigned_jobs;

    setJobStatus(job_status);
    setForceUpdate(forceupdate + 1);
  }, []);

  useEffect(() => {
    if (!organisation) return;
    loadResources(organisation.id);
    setDateFormat(organisation.date_format);
  }, [organisation, loadResources]);

  const UpdateJob = async (job) => {
    let { status, message } = await DefaultService.Entity_Update(
      JOBS_API_KEY,
      job
    );
    if (status) {
      notify("Job updated", true);
    } else {
      notify(message, false);
    }
  };
  const newEvent = (
    schedulerData,
    slotId,
    slotName,
    start,
    end,
    type,
    item
  ) => {
    if (!lockGrid) return;
    let start_time = moment(start, date_format, true);
    let end_time = moment(start, date_format, true).add(
      item.job_duration_mins,
      "minutes"
    );

    let new_event = {
      id: item.id,
      title: `[${item.id}]-${item.industry.name}-${item.service_type.name}`,
      start: start_time.format(date_format),
      end: end_time.format(date_format),
      resourceId: slotId,
      bgColor: item.job_status.bg_color,
      color: item.job_status.color,
      job_status_id: item.job_status_id,
    };

    if (type === "JOB") {
      schedulerData.addEvent(new_event);
      var toks = slotId.split("_");
      var job_statuses = JobStatus.filter(
        (v) => v.id === item.job_status_id
      )[0];

      job_statuses.items = job_statuses.items.filter((v) => v.id !== item.id);
      var updated_job = {
        id: item.id,
        need_at: start_time.utc(),
        job_status_id: JOB_STATUS.NEW,
        change: JOB_CHANGE.NEW_ASSSIGNED,
      };

      if (toks[0] === "t") updated_job.team_id = +toks[1];
      else updated_job.field_technician_id = +toks[1];

      UpdateJob(updated_job);
      setForceUpdate(forceupdate + 1);
    }
  };

  const loadJob = async (job_id) => {
    const { data } = await DefaultService.Entity_Get(JOBS_API_KEY, job_id);
    setSelectedJob(data);
    setShowJobDetail(true);
  };
  const eventClicked = async (e, evt) => {
    console.log("evt:", evt);
    if (!isNaN(evt.id)) await loadJob(evt.id);
    else {
      let { data } = await DefaultService.Entity_Get(
        TIME_SLOT_API_KEY,
        evt.id.substr(1)
      );

      setSelectedTask(data);
      setShowTaskDetail(true);
    }
  };

  const handleJobDetailOk = () => {
    setShowJobDetail(false);
  };

  const handleTaskSubmit = async (values) => {
    console.log("handleTaskSubmit:", values);
    values.organisation_id = organisation.id;
    let { status, message } = await DefaultService.Entity_Add(
      TIME_SLOT_API_KEY,
      values
    );

    if (status) {
      setShowTask(false);
      notify("Slot added", true);
      loadResources(organisation.id);
    } else {
      notify(message, false);
    }
  };
  const removeFromCalander = (job_id) => {
    var remaining_events = SData.events.filter((e) => e.id !== job_id);
    SData.setEvents(remaining_events);
    setShowJobDetail(false);
  };
  const removeFromQueues = (job_id) => {
    JobStatus.forEach((queue) => {
      var new_items = queue.items.filter((v) => v.id !== job_id);
      queue.items = new_items;
    });
    setJobStatus(JobStatus);
    setForceUpdate(forceupdate + 1);
  };
  const handleCancelJob = async (job_id) => {
    await UpdateJob({
      id: job_id,
      job_status_id: JOB_STATUS.CANCELLED,
      change: JOB_CHANGE.CANCELLED,
    });
    removeFromCalander(job_id);
    removeFromQueues(job_id);
  };

  const allowUpdateEvent = (job_status_id) => {
    const allowed_updates = [
      JOB_STATUS.UNASSIGNED,
      JOB_STATUS.NEW,
      JOB_STATUS.ASSIGNED,
    ];
    return allowed_updates.includes(job_status_id);
  };
  const moveEvent = async (
    schedulerData,
    event,
    slotId,
    slotName,
    start,
    end
  ) => {
    if (!lockGrid) return;
    if (!allowUpdateEvent(event.job_status_id)) return;

    schedulerData.moveEvent(event, slotId, slotName, start, end);
    var updated_job = {
      id: event.id,
      need_at: moment(event.start).utc().format(),
      change: JOB_CHANGE.CHANGE_TIME,
    };
    var toks = slotId.split("_");

    if (toks[0] === "t") {
      updated_job.team_id = +toks[1];
      updated_job.field_technician_id = null;
    } else {
      updated_job.field_technician_id = +toks[1];
      updated_job.team_id = null;
    }

    await UpdateJob(updated_job);
    setForceUpdate(forceupdate + 1);
  };
  const updateEventStart = async (schedulerData, event, newStart) => {
    if (!lockGrid) return;
    if (!allowUpdateEvent(event.job_status_id)) return;
    schedulerData.updateEventStart(event, newStart);
    await UpdateJob({
      id: event.id,
      need_at: moment(event.start).utc().format(),
      job_duration_mins: moment(event.end).diff(
        moment(newStart),
        "minutes",
        false
      ),
      change: JOB_CHANGE.CHANGE_TIME,
    });
    setForceUpdate(forceupdate + 1);
  };
  const updateEventEnd = async (schedulerData, event, newEnd) => {
    if (!lockGrid) return;
    if (!allowUpdateEvent(event.job_status_id)) return;
    schedulerData.updateEventEnd(event, newEnd);
    await UpdateJob({
      id: event.id,
      job_duration_mins: moment(newEnd).diff(
        moment(event.start),
        "minutes",
        false
      ),
      change: JOB_CHANGE.CHANGE_DURATION,
    });
    setForceUpdate(forceupdate + 1);
  };
  const prevDay = (schedulerData) => {
    var data_events = schedulerData.events;
    schedulerData.prev();
    schedulerData.setEvents(data_events);
    setForceUpdate(forceupdate + 1);
  };

  const nextDay = (schedulerData) => {
    var data_events = schedulerData.events;
    schedulerData.next();
    schedulerData.setEvents(data_events);
    setForceUpdate(forceupdate + 1);
  };

  const viewChanged = (schedulerData, view) => {
    var data_events = schedulerData.events;
    schedulerData.setViewType(view.viewType);
    schedulerData.setEvents(data_events);
    setForceUpdate(forceupdate + 1);
  };

  const handleItemClick = async (job_id) => {
    await loadJob(job_id);
  };

  const handleShowMap = () => {
    setShowMap(true);
  };
  const handleShowTask = () => {
    setShowTask(true);
  };
  const handleAssignedTo = async (e, job) => {
    var overlapping = false;
    var resourceId =
      e.field_technician_id === null
        ? "t_" + e.team_id
        : "ft_" + e.field_technician_id;

    SData.events
      .filter((evt) => evt.resourceId === resourceId && evt.is_job)
      .forEach((evt) => {
        if (
          (moment(evt.start) > e.slot_start &&
            moment(evt.start) < e.slot_end) ||
          (moment(evt.end) > e.slot_start && moment(evt.end) < e.slot_end) ||
          (moment(evt.start) < e.slot_start && moment(evt.end) > e.slot_end)
        ) {
          overlapping = true;
          return;
        }
      });

    if (overlapping) {
      notify("Slot is already booked", false);
      return;
    }
    await UpdateJob({
      id: job.id,
      field_technician_id: e.field_technician_id,
      team_id: e.team_id,
      need_at: e.slot_start.utc(),
      job_duration_mins: e.slot_end.diff(e.slot_start, "minutes", false),
      job_status_id: JOB_STATUS.NEW,
      change: JOB_CHANGE.NEW_ASSSIGNED,
    });
    //setForceUpdate(forceupdate + 1);
    loadResources(organisation.id);
    alert("Job assigned");
  };
  return (
    <AppPage className="dispatching-page">
      <PageHeader
        title={<PageTitle />}
        actions={
          <PageToolbar>
          <Typography.Text>Grid: </Typography.Text>
          <Switch
            checkedChildren="Open"
            unCheckedChildren="Locked"
            checked={lockGrid}
            onChange={(e) => {
              setLockGrid(e);
            }}
            style={{ marginRight: "10px" }}
          />
          <Button
            type="primary"
            onClick={handleShowTask}
            style={{ marginRight: "10px" }}
          >
            Add Task
          </Button>
          <Button type="primary" danger onClick={handleShowMap}>
            {t("general_show_map")}
          </Button>
          </PageToolbar>
        }
      />
      <PageSection>
        <GridPanel>
          <JobAssignment
            schedulerData={SData}
            dndSources={[dndSource]}
            forceupdate={forceupdate}
            newEvent={newEvent}
            updateEventStart={updateEventStart}
            updateEventEnd={updateEventEnd}
            prevClick={prevDay}
            nextClick={nextDay}
            moveEvent={moveEvent}
            eventItemClick={eventClicked}
            viewChanged={viewChanged}
          />
        </GridPanel>
      </PageSection>

      <PageSection title={t("general_job_items")}>
      <div className="dispatching-job-lanes">
        {JobStatus.map((v, i) => (
          <div key={i}>
            <List
              size="large"
              header={
                <div>
                  <b>{v.name}</b>
                </div>
              }
              bordered
              dataSource={v.items}
              renderItem={(item) => (
                <DnDJobItem
                  key={item.id}
                  jobClicked={handleItemClick}
                  job={item}
                  schedulerData={SData}
                  newEvent={newEvent}
                />
              )}
            />
          </div>
        ))}
      </div>
      </PageSection>
      <div className="dispatching-legend">
        <JobLegend data={statusList} />
      </div>
      <Row>
        <Col>
          <JobDetails
            job={SelectedJob}
            visible={ShowJobDetail}
            handleOk={handleJobDetailOk}
            handleCancelJob={handleCancelJob}
            dateFormat={dateFormat}
            fieldTechnicians={fieldTechnicians}
            teams={teams}
            time_format={"HH:mm"}
            onAssignedTo={handleAssignedTo}
          />
        </Col>
        <Col>
          {showMap && (
            <MapView
              visible={showMap}
              handleCancel={() => {
                setShowMap(false);
              }}
            />
          )}
        </Col>
        <Col>
          {showTask && (
            <TaskView
              visible={showTask}
              fieldTechnicians={fieldTechnicians}
              dateFormat={dateFormat}
              handleCancel={() => {
                setShowTask(false);
              }}
              handleSubmit={handleTaskSubmit}
            />
          )}
        </Col>
        <Col>
          {showTaskDetail && (
            <TaskDetailView
              visible={showTaskDetail}
              task={selectedTask}
              dateFormat={dateFormat}
              handleCancel={() => {
                setShowTaskDetail(false);
              }}
            />
          )}
        </Col>
      </Row>
    </AppPage>
  );
};

export default DragDropContext(HTML5Backend)(Dispatching);
