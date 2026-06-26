import CustomDataGrid from 'Components/DevEx/CustomDataGrid';
import GridColumn from 'Components/DevEx/GridUtils';
import React from 'react';
import { useTranslation } from 'react-i18next';

function SearchResults({
  data,
  ENTITY,
  ENTITY_PLURAL,
  handleEdit,
  handleDelete,
  handleJobCard,
  dateFormat
}) {
  const { t } = useTranslation();
  const columns = [
    GridColumn(t("general_id"), "id", "number", { summaryType: "count" }),
    GridColumn(t("general_status"), "job_status.admin_status", "string"),
    GridColumn(t("general_customer"), "customer.full_name", "string"),
    GridColumn(t("quick_setup_service_types_grid_industry"), "industry.name", "string"),
    GridColumn(t("general_service_type"), "service_type.name", "string"),
    GridColumn(t("quick_setup_discount_tags_modal_discount_tag"), "discount_tag.name", "string"),
    GridColumn(t("general_priority"), "job_priority.name", "string"),
    GridColumn(t("label_lead_source"), "lead_source.name", "string"),
    GridColumn(t("general_visit_date_Time"), "need_at", "datetime", { valueFormat: dateFormat }),
    GridColumn(t("label_active"), "is_active", "boolean", { alignment: "center" }),
    {
      caption: t("dashboard_job_search_job_card"),
      alignment: "center",
      width: "100px",
      cellRender: (d) => {
        let row = d.data;
        return (
          <>
            <i
              class="fas fa-file"
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleJobCard(row.id);
                return false;
              }}
            ></i>
          </>
        );
      },
    }
  ];
  return (
    <>
      <CustomDataGrid
        data={data}
        columns={columns}
        ENTITY={ENTITY}
        ENTITY_PLURAL={ENTITY_PLURAL}
        editHandler={handleEdit}
        deleteHandler={handleDelete}
        canEdit={false}
        canDelete={false}
      />
    </>
  );
}

export default SearchResults;