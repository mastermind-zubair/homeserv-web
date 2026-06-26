import React, { useState, useCallback, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useHistory, useParams } from "react-router-dom";
import { Row, Col, Typography, Card, Table, Space, Tag, Button } from "antd";
import { LeftOutlined } from '@ant-design/icons';
import TechJobPurchaseOrder from "Services/API/Technician/TechJobPurchaseOrder";
import TechJobService from "Services/API/Technician/TechJobService";
import AuthService from "Services/AuthService";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

const Job_Purchase_Order_List = (props) => {
  let history = useHistory();

  let { jid, page } = useParams();
  const user = AuthService.getCurrentTechnician();
  const ORGANISATION_ID = user ? user.organisation_id : 0;

  const [dtPurchaseOrder, setPurchaseOrder] = useState(null);
  const { dtJob } = props.location
  const [job, setJob] = useState(dtJob);
  const { t } = useTranslation();

  function fetchData() {
    return new Promise(async (resolve, reject) => {
      if (!job) {
        if (!jid) {
          return history.push("/technician/jobs/");
        }
        const { data } = await TechJobService.GetTechJob(jid);
        setJob(data);
        resolve();
      }
      else {
        resolve();
      }
    })
  }

  useEffect(async () => {
    await fetchData().then(loadData());
  }, []);


  const columns = [

    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
      className: "ant-table-cell",
      align: "left",
      render: (value, record) => {
        return (
          <>
            <b className="text-success">
              {record.supplier.name}
            </b>
          </>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status_id",
      key: "status_id",
      className: "ant-table-cell",
      align: "left",
      render: (value, record) => {
        return (
          <>
            <b className="text-success">
              {statusText(record.status_id)}
            </b>
          </>
        );
      },
    },
  ];


  const statusText = (status_id) => {
    switch (status_id) {
      case 0:
        return <Tag color="red">
          {t("general_rejected")}
        </Tag>
      case 1:
        return <Tag color="yellow">
          {t("general_pending")}
        </Tag>
      case 2:
        return <Tag color="green">
          {t("general_accepted")}
        </Tag>
      default:
        break;
    }
  }
  const loadData = useCallback(async () => {
    let param_job = { "condition": { "organisation_id": ORGANISATION_ID, "job_id": jid } }
    const { data } = await TechJobPurchaseOrder.GetJobPurchaseOrders(param_job);
    setPurchaseOrder(data);
  }, []);


  return (
    <>
      <Row>
        <Col span={12}>
          <Title level={4}>Purchase Order List</Title>
        </Col>
        <Col span={12}>
          {dtPurchaseOrder !== null ? <Button type="primary" shape="square" icon={<LeftOutlined />} className="ant-btn-lg ant-col-24" style={{ float: "right" }} onClick={() => {
            let pageURL = page !== 'job-start-work' ? `/technician/jobs/job-notes/${jid}` : `/technician/jobs/job-start-work/${jid}`;
            history.push({
              pathname: pageURL,
              dtJob: job
            })
          }}>
          </Button> : ""}

        </Col>
      </Row>
      {dtPurchaseOrder !== null ? (
        <Row>
          <Col span={24}>
            <Card title={<Title level={5}>{t("side_menu_navigation_reports_sub_purchase_orders")}</Title>} extra={<b>{t("general_job_id")}: {jid}</b>}>
              <Space span={24} direction="vertical" size="small" style={{ display: 'flex' }}>
                <Row>
                  <Col span={24}>
                    <Table
                      className="ant-table-custom"
                      style={{ width: "100%" }}
                      cellClassName="ant-table-cell"
                      rowClassName="dx-row dx-data-row dx-row-lines dx-column-lines dx-row-alt"
                      columns={columns}
                      expandable={{
                        expandedRowRender: (record) => (

                          <p
                            style={{
                              margin: 0,
                            }}
                          >
                            <b className="text-success">{
                              record.products.map((item, index) => {
                                let color = item.length > 15 ? 'geekblue' : 'green';

                                return <><Space direction="vertical" size="small" ><Tag color={color} key={item.id}>
                                  {item.product_name.toUpperCase()}
                                </Tag>
                                  <Tag color={color} key={item.id + item.product_name}>
                                    {t("general_qty")}: {item.quantity}
                                  </Tag>
                                  <Tag color={color} key={item.id + item.product_name}>
                                    {t("general_price_($)")}{item.price}
                                  </Tag>
                                </Space></>

                              })}</b>
                          </p>
                        )
                      }}
                      dataSource={dtPurchaseOrder}
                      rowkey={(record) => record.id}
                      pagination={false}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>{(dtPurchaseOrder && dtPurchaseOrder.length) || 0} Item(s)</Col>
                  <Col span={18} className="text-right push-right">
                    <Space>
                      <Link
                        className="ant-btn ant-btn-primary"
                        to={{
                          pathname: `/technician/jobs/job-purchase-order/${jid}/${page}`,
                          dtJob: job // your data array of objects
                        }}
                      >{t("general_add_purchase_order")}</Link>
                    </Space>
                  </Col>
                </Row>
              </Space>
            </Card>
          </Col>

        </Row>
      ) : (
        <Row>
          <Col>
            <Typography>{t("general_wait_for_purchase_list")}</Typography>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Job_Purchase_Order_List;
