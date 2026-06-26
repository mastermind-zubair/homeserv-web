import { Card, Col, Descriptions, Row, Table } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

function JobCardMaterial({ job }) {
  const columns = [
    { title: "Product Name", dataIndex: "product_name" },
    { title: "Quantity", dataIndex: "quantity" },
    { title: "Price", dataIndex: "price" },
  ];

  const trans_columns = [
    { title: "Product Name", dataIndex: "product_name" },
    { title: "Supplier #", dataIndex: "supplier_part_number" },
    { title: "Quantity", dataIndex: "quantity" },
    { title: "Price", dataIndex: "price" },
  ];
  const { t } = useTranslation();
  if (!job) return <h3>No Material found</h3>;

  return (
    <>
      <Row>
        <Col span={24}>
          <Card title={t("dashboard_job_search_material_used_from_truck")}>
            {job.transactions &&
              job.transactions.map((trans) => (
                <>
                  <Descriptions title={`Trans#${trans.id}`}>
                    <Descriptions.Item label="Total">
                      {trans.total}
                    </Descriptions.Item>
                  </Descriptions>
                  <Table columns={trans_columns} dataSource={trans.products} />
                </>
              ))}
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Card title={t("dashboard_job_search_purchase_orders")}>
            {job.purchase_orders &&
              job.purchase_orders.map((po) => (
                <>
                  <Descriptions title={` PO#${po.id} - ${po.supplier.name}`}>
                    <Descriptions.Item label="Status">{`${po.status_name}`}</Descriptions.Item>
                    <Descriptions.Item label="Contact Person">{`${po.supplier.first_name} ${po.supplier.last_name}`}</Descriptions.Item>
                  </Descriptions>
                  <Table columns={columns} dataSource={po.products} />
                </>
              ))}
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Card title={t("dashboard_job_search_material_list")}>
            {t("dashboard_job_search_material_list")}
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default JobCardMaterial;
