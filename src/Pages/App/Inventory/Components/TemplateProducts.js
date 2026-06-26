import { useEffect } from "react";
import { CloseButton } from "Components/Common/FormButtons";
import CustomDataGrid from "Components/DevEx/CustomDataGrid";

const {
  Modal,
} = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const TemplateProducts = ({ showForm, handleCancel, ENTITY, ENTITY_PLURAL, data, columns }) => {
  useEffect(() => {}, []);

  return (
    <Modal
      title={`List of ${ENTITY_PLURAL}`}
      visible={showForm}
      width={768}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={[<CloseButton handleCancel={handleCancel} />]}
    >
      <LoadingPanelForPopup />

      <div className="flex">
        <CustomDataGrid
          data={data}
          columns={columns}
          ENTITY={ENTITY}
          ENTITY_PLURAL={ENTITY_PLURAL}
          canDelete={false}
          canEdit={false}
          height="400px"
        />
      </div>
    </Modal>
  );
};

export default TemplateProducts;
