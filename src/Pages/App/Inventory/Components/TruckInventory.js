import { useEffect } from "react";
import { CloseButton, UpdateButton } from "Components/Common/FormButtons";
import CustomDataGrid from "Components/DevEx/CustomDataGrid";

const {
  Modal,
} = require("antd");

const { LoadingPanelForPopup } = require("Layout/LoadingPanels");

const TruckInventory = ({ showForm, handleUpdate, handleCancel, ENTITY, ENTITY_PLURAL, data, columns }) => {
  useEffect(() => {}, []);

  return (
    <Modal
      title={`List of ${ENTITY_PLURAL}`}
      visible={showForm}
      width={768}
      // onOk={handleSave}
      onCancel={handleCancel}
      footer={[
        <div className="flex">
          <UpdateButton handleUpdate={handleUpdate} />
          <CloseButton handleCancel={handleCancel} />
        </div>,
      ]}
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
          inlineEditing={true}
        />
      </div>
    </Modal>
  );
};

export default TruckInventory;
