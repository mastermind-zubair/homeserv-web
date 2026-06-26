import React, { useState, useEffect, useContext } from 'react';
import { Button, Tooltip, Form } from 'antd';
import { useTranslation } from "react-i18next";
import Context from "Store/Context";
import { trackPromise } from 'react-promise-tracker';
import DefaultService from 'Services/API/DefaultService';
import { notify } from 'Services/ToastService';
import PageTitle from '../_Common/PageTitle';
import { PlusCircleOutlined } from '@ant-design/icons';
import CustomDataGrid from 'Components/DevEx/CustomDataGrid';
import FormCredits from './Components/FormCredits';
import AuthService from 'Services/AuthService';

function Credits() {
    const ENTITY = "Credits";
    const ENTITY_PLURAL = "Credits";
    const ENTITY_API_KEY = "Outbound_Credits";
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const auth_user = AuthService.getCurrentUser();
    const [data, setData] = useState();  
    const [currency, setCurrency] = useState('PKR');
    const [showEditForm, setShowEditForm] = useState(false);
    const [balance, setBalance] = useState(0);
    const { curOrg: organisation, setCurOrg } = useContext(Context);
  
    useEffect(() => {
      (async() => {
        if (organisation) {
          setCurrency(organisation.currency.symbol);
          setBalance(organisation.credits);
          await handleSearch();
        }        
      })();
    }, [organisation]);
  
    const columns = [
        {
          caption: t("general_id"),
          dataField: "id",
          dataType: "number",
          alignment: "left",
          width: 100,
        },
        {
          caption: t("general_date_created"),
          dataField: "createdAt",
          dataType: "date",
          format: "yyyy-MM-dd",
          alignment: "left",
        },
        {
          caption: t("general_amount"),
          dataField: "amount",
          dataType: "string",
          alignment: "left",
          cellRender: (item) => {
            return `${item.data.amount.toFixed(2)} ${currency}`;
          }
        },
        {
          caption: t("general_area"),
          dataField: "area",
          dataType: "string",
          alignment: "left",
        },
        {
          caption: t("general_description"),
          dataField: "description",
          alignment: "left",
        },
        {
          caption: t("general_transaction_type"),
          dataField: "transaction_type",
          dataType: "string",
          alignment: "left",
          cellRender: (item) => {
            return item.data.transaction_type === 0 ? "Credit" : "Debit";
          }
        },
      ];
    
      const handleEdit = async (item) => {
        setShowEditForm(true);
      };
      const handleCancel = () => {
        setShowEditForm(false);
      };
    
    const handleSearch = async () => {
        let { data, status, message } = await trackPromise(
          DefaultService.Entity_List(ENTITY_API_KEY, {
            organisation_id: organisation.id,
          })
        );
        //setShowAddButton(data.length === 0);
    
        notify(message, status);
    
        setData(data);
      };

      const onFinish = async (values) => {
  
        let record = {
          organisation_id: organisation.id,
          user_id: auth_user.id,
          transaction_type: 0,
          area: 'Outbound',
          amount: values.card_amount,
          description: "Credit added to card",
          status: true,
        };
        
//        console.log("Record to save", record);
    
        const { status, message } = record.id
          ? await trackPromise(DefaultService.Entity_Update(ENTITY_API_KEY, record))
          : await trackPromise(DefaultService.Entity_Add(ENTITY_API_KEY, record));
    
        notify(message, status);

        if (status) {
          setShowEditForm(false);
          handleSearch();
          setCurOrg({ ...organisation, credits: balance + values.card_amount });
        }
      };
      const onFinishFailed = async () => {
        notify("Please provide all the required input fields", false);
      };
      return (
        <>
            <div className="flex mb-2">
                <PageTitle /><h2><b>(Balance: {`${balance.toFixed(2)} ${currency}`})</b></h2>
                <h3 className="push-right text-right">
                <Tooltip
                    title={`Do you have more ${ENTITY_PLURAL}? Click here to add another`}
                >
                    <Button
                    className="bg-success"
                    icon={<PlusCircleOutlined />}
                    onClick={handleEdit}
                    >
                    {t("outbound_credits_add_new_credit")}
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
                    canDelete={false}
                    canEdit={false}
                />
            </div>
            <div className="flex">
        {showEditForm && (
          <FormCredits
            form={form}
            showForm={showEditForm}
            handleCancel={handleCancel}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            ENTITY={ENTITY}
            currency={currency}
            recordToEdit={{ card_amount: 100 }}
            data={{
              organisation
            }}
          />
        )}
      </div>

      
        </>
    );
}

export default Credits;