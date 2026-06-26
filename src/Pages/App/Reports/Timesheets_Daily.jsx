import React, { useState, useEffect, useContext, memo } from "react";

import { trackPromise } from "react-promise-tracker";
import { notify } from "Services/ToastService";

import {
  Button,
  Col,
  Form,
  Row,
  Tooltip,
  Space,
  DatePicker,
  Badge,
  Card,
  Table,
  Select,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomDataGrid from "Components/DevEx/CustomDataGrid";

import moment from "moment";
import LookupService from "Services/API/LookupService";
import DefaultService from "Services/API/DefaultService";
import Context from "Store/Context";
import PageTitle from "../_Common/PageTitle";

import { useTranslation } from "react-i18next";
import _ from "lodash";
import environment from "Environment";
import { MoneyFormat } from "Lib/DevExConstants";
import { Option } from "antd/lib/mentions";

const Timesheets_Daily = (props) => {
  const { t } = useTranslation();
  const ENTITY = "Daily Timesheets";
  const ENTITY_PLURAL = "Daily Timesheets";
  //const ENTITY_API_KEY = "Reports_Jobs";
  const { RangePicker } = DatePicker;
  const [form] = Form.useForm();
  const [showEditForm, setShowEditForm] = useState(false);

  const [data, setData] = useState();
  const [columns, setColumns] = useState([]);
  const [recordToEdit, setRecordToEdit] = useState();
  const [dateFormat, setDateFormat] = useState("YYYY-MM-DD");
  const { curOrg: organisation } = useContext(Context);
  const [technicians, setTechnicians] = useState();
  const [selectedTechnicianId, setSelectedTechnicianId] = useState(21);

  const [entryDates, setEntryDates] = useState();
  //const [formattedDates, setEntryDates] = useState();
  const [selectedDay, setSelectedDay] = useState();
  const days_of_week = [
    t("general_day_of_week_monday"),
    t("general_day_of_week_tuesday"),
    t("general_day_of_week_wednesday"),
    t("general_day_of_week_thursday"),
    t("general_day_of_week_friday"),
    t("general_day_of_week_saturday"),
    t("general_day_of_week_sunday"),
  ];

  useEffect(async () => {
    if (organisation) {
      setDateFormat(organisation.date_format);
      let techs = await trackPromise(
        LookupService.FieldTechnicians({
          organisation_id: organisation.id,
        })
      );
      setTechnicians(techs);
      //await handleSearch();
      console.log(organisation);

      const today = moment();
      const first = today.startOf("isoWeek");
      let dates = [
        moment(first).format("YYYY-MM-DD"),
        moment(first).add(1, "d").format("YYYY-MM-DD"),
        moment(first).add(2, "d").format("YYYY-MM-DD"),
        moment(first).add(3, "d").format("YYYY-MM-DD"),
        moment(first).add(4, "d").format("YYYY-MM-DD"),
        moment(first).add(5, "d").format("YYYY-MM-DD"),
        moment(first).add(6, "d").format("YYYY-MM-DD"),
      ];

      setEntryDates(dates);
      console.log("Entry Dates", dates);
    }
  }, [organisation]);

  useEffect(() => {
    if (recordToEdit && recordToEdit.id === 0) {
      //recordToEdit.ranges = [];
    }
    form.resetFields();
  }, [recordToEdit]);

  const handleSearch = async (techId) => {
    //alert(techId);
    console.log("tech", techId);
    console.log("dates", entryDates);

    let { data, status, message } = await trackPromise(
      DefaultService.POST("/time_sheet/list/1", {
        condition: {
          organisation_id: organisation.id,
          field_technician_id: techId,
          entry_date: entryDates,
        },
      })
    );

    data =
      data &&
      data.map((d) => {
        return { ...d, total_time: minutesToHours(d?.total_minutes) };
      });
    console.log("fetched data", data);
    !status && notify(message, status);
    setData(data);
    setSelectedDay(null);
  };

  function minutesToHours(minutes) {
    let time = minutes;
    var hrs = Math.floor(time / 60);
    var mins = time % 60;
    console.log(minutes, `${hrs}:${mins}`);
    return `${hrs}:${mins}`;
  }
  return (
    <>
      <div className="flex mb-2">
        <PageTitle />
        <p className="ml-auto">
          <Space direction="horizontal" size={12}>
            <b> {t("general_select_technician")} </b>
            <Select
              onChange={handleSearch}
              options={technicians}
              style={{ width: "100%", minWidth: "200px" }}
            ></Select>
          </Space>
        </p>
      </div>

      <div className="mt-3">
        <div className="mb-5">
          <table>
            <tr>
              <td className="text-bold"> {t("general_day_time")} </td>
              {entryDates &&
                entryDates.map((d, i) => {
                  return (
                    <td className="text-bold text-center">
                      {days_of_week[i]}
                      <br />
                      <Badge
                        count={moment(d).format(
                          organisation.date_format.toUpperCase()
                        )}
                        className="bg-primary"
                        style={{
                          TextColor: "#000",
                          fontWeight: "bold",
                        }}
                      />
                    </td>
                  );
                })}
            </tr>
            <tr>
              <td className="text-bold"> {t("general_total_hours")} </td>
              {entryDates &&
                entryDates.map((d) => {
                  let rec = data && _.find(data, { entry_date: d });
                  let mins = (rec && rec.total_time) || 0;
                  return (
                    <td className="text-center">
                      {(rec && (
                        <Button type="link" onClick={() => setSelectedDay(rec)}>
                          <b>{mins}</b>
                        </Button>
                      )) ||
                        "N/A"}
                    </td>
                  );
                })}
            </tr>
            <tr>
              <td colSpan={8}>
                <br />
                <br />
                <small className="text-danger my-4">
                  {" "}
                  {t("dashboard_job_search_note")} :
                </small>{" "}
                {t("general_click_working_hours")}
              </td>
            </tr>
          </table>
        </div>
        <div className="mt-5 box-success box-pad bg-grey">
          {selectedDay && (
            <table>
              <tr>
                <th> {t("general_day_time")} </th>
                <th>
                  {moment(selectedDay.entry_date).format(
                    organisation.date_format.toUpperCase()
                  )}
                </th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th> {t("general_start")} </th>
                <td>
                  {(selectedDay.time_in &&
                    moment(selectedDay.time_in).format(
                      organisation.date_format.toUpperCase() + " HH:mm"
                    )) ||
                    "N/A"}
                </td>
                <th>End</th>
                <td>
                  {(selectedDay.time_out &&
                    moment(selectedDay.time_out).format(
                      organisation.date_format.toUpperCase() + " HH:mm"
                    )) ||
                    "N/A"}
                </td>
                <th> {t("general_total_hours")} </th>
                <td>
                  {(selectedDay.total_minutes && selectedDay.total_time) || 0}
                </td>
              </tr>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Timesheets_Daily;
