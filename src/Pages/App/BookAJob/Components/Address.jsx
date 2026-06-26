import React, { useState, useEffect, } from "react";
import { Form, Row, Col } from "antd";
import { StaticGoogleMap, Marker } from "react-static-google-map";
import DefaultService from "Services/API/DefaultService";
import FormUtils from "Components/Common/FormUtils";
import { ConsoleSqlOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { InfoItem, InfoSelect } = FormUtils;


export default function Address({ name, readOnly, form, showMap, map_loc = null }) {

  const [Countries, setCountries] = useState([]);
  const [States, setStates] = useState([]);
  const [Citites, setCitites] = useState([]);
  const [DisableCountry, setDisableCountry] = useState(true);
  const [DisableState, setDisableState] = useState(true);
  const [DisableCity, setDisableCity] = useState(true);
  const [MapLoc, setMapLoc] = useState({ lat: 40.737102, lng: -73.990318 });
  const [MapZoom, setMapZoom] = useState(5);

  const isNoU = (item) => item === null || item === undefined ? '' : item;
  const getLatLng = async () => {
    var item_addr = form.getFieldsValue(
      [`${name}.country`,
      `${name}.city`,
      `${name}.state`,
      `${name}.line_1`,
      `${name}.line_2`,
      `${name}.postal_code`]);


    var line_1 = isNoU(item_addr[`${name}.line_1`]),
      line_2 = isNoU(item_addr[`${name}.line_2`]),
      postal_code = isNoU(item_addr[`${name}.line_2`]),
      city = isNoU(item_addr[`${name}.city`]),
      state = isNoU(item_addr[`${name}.state`]),
      country = isNoU(item_addr[`${name}.country`]);


    const { data } = await DefaultService.GetGeoLocation(line_1, line_2, city, state, country, postal_code);

    setMapLoc({ lat: data.lat, lng: data.lng });
    form.setFieldsValue({
      job_site_lat: data.lat,
      job_site_lng: data.lng,
    });
    //console.log('geo location response: ',response);
  }
  useEffect(() => {
    if (map_loc === undefined || map_loc === null) return;

    setMapLoc(map_loc);
    setMapZoom(16);
  }, [map_loc]);

  useEffect(() => {
    (async () => {
      const { data } = await DefaultService.GetCountries();
      setDisableCountry(false);
      setDisableState(true);
      setDisableCity(true);
      setCountries(data);
    })();
  }, []);

  const handleCountryChange = async (v, option) => {
    const { data } = await DefaultService.GetStates(v);
    const p_name = `${name}.country`;
    setDisableState(false);
    setDisableCity(true);
    setStates(data);
    //const selected_country = Countries.filter((c) => c.id === +v)[0];
    //setMapLoc({ lat: selected_country.lat, lng: selected_country.lng });
    setMapZoom(8);
    form.setFieldsValue({
      [p_name]: option.children,
      // job_site_lat: selected_country.lat,
      // job_site_lng: selected_country.lng,
    });
    getLatLng();
  };

  const handleStateChange = async (v, option) => {
    const { data } = await DefaultService.GetCities(v);
    const p_name = `${name}.state`;
    setDisableCity(false);
    setCitites(data);
    // const selected_state = States.filter((c) => c.id === +v)[0];
    // setMapLoc({ lat: selected_state.lat, lng: selected_state.lng });
    setMapZoom(12);
    form.setFieldsValue({
      [p_name]: option.children,
      // job_site_lat: selected_state.lat,
      // job_site_lng: selected_state.lng,
    });
    getLatLng();
  };

  const handleCityChange = (v, option) => {
    const p_name = `${name}.city`;

    // const selected_city = Citites.filter((c) => c.id === +v)[0];
    // setMapLoc({ lat: selected_city.lat, lng: selected_city.lng });
    setMapZoom(16);
    form.setFieldsValue({
      [p_name]: option.children,
      // job_site_lat: selected_city.lat,
      // job_site_lng: selected_city.lng,
    });
    getLatLng();
  };
  const requiredRule = (p) => ({
    required: true,
    message: `Please input ${p}`,
  });
  const { t } = useTranslation();
  return (
    <>
      <Form.Item hidden name={`${name}.id`} />
      {!readOnly && (
        <>
          <Form.Item hidden name={`${name}.country`} />
          <Form.Item hidden name={`${name}.state`} />
          <Form.Item hidden name={`${name}.city`} />
        </>
      )}
      <Row gutter={5}>
        <InfoItem
          span={12}
          label={t("quick_setup_office_users_form_first_name")}
          name={`${name}.first_name`}
          readOnly={readOnly}
          rules={[requiredRule("First Name")]}
        />
        <InfoItem
          span={12}
          label={t("quick_setup_office_users_form_last_name")}
          name={`${name}.last_name`}
          readOnly={readOnly}
          rules={[requiredRule("Last Name")]}
        />
      </Row>
      <Row gutter={5}>
        <InfoItem
          span={24}
          label={t("label_address_line_1")}
          name={`${name}.line_1`}
          readOnly={readOnly}
          rules={[requiredRule("Address Line 1")]}
          onFocusOut={() => { getLatLng(); }}
        />
        {/* <InfoItem 
          span={24} 
          label="Address Line 2" 
          name={`${name}.line_2`} 
          readOnly={readOnly} 
          onChange={() => { getLatLng(); }}
          visible={false}
          /> */}
      </Row>
      <Row gutter={5}>
        {!readOnly && (
          <>
            <InfoSelect
              span={6}
              label={t("general_country")}
              name={`${name}.country_id`}
              options={Countries}
              handleChange={handleCountryChange}
              disabled={DisableCountry}
              readOnly={readOnly}
              rules={[requiredRule("Country")]}
            />
            <InfoSelect
              span={6}
              label={t("general_state")}
              name={`${name}.state_id`}
              options={States}
              handleChange={handleStateChange}
              disabled={DisableState}
              readOnly={readOnly}
              rules={[requiredRule("State")]}
            />
            <InfoSelect
              span={6}
              label={t("general_city")}
              name={`${name}.city_id`}
              options={Citites}
              handleChange={handleCityChange}
              disabled={DisableCity}
              readOnly={readOnly}
              rules={[requiredRule("City")]}
            />
          </>
        )}
        {readOnly && (
          <>
            <InfoItem
              span={6}
              label={t("general_country")}
              name={`${name}.country`}
              options={Countries}
              handleChange={handleCountryChange}
              disabled={DisableCountry}
              readOnly={readOnly}
              rules={[requiredRule("Country")]}
            />
            <InfoItem
              span={6}
              label={t("general_state")}
              name={`${name}.state`}
              options={States}
              handleChange={handleStateChange}
              disabled={DisableState}
              readOnly={readOnly}
              rules={[requiredRule("State")]}
            />
            <InfoItem
              span={6}
              label={t("general_suburb")}
              name={`${name}.city`}
              options={Citites}
              handleChange={handleCityChange}
              disabled={DisableCity}
              readOnly={readOnly}
              rules={[requiredRule("City")]}
            />
          </>
        )}

        <InfoItem
          span={6}
          label={t("general_postal_code")}
          name={`${name}.postal_code`}
          readOnly={readOnly}
          rules={[requiredRule("Postal Code")]}
        />
      </Row>
      <Row gutter={5}>
        <InfoItem
          span={6}
          label={t("quick_setup_sub_contractors_form_mobile_number")}
          name={`${name}.mobile`}
          readOnly={readOnly}
          rules={[requiredRule("Mobile")]}
        />
        <InfoItem span={6} label={t("general_phone")} name={`${name}.phone`} readOnly={readOnly} />
        {showMap && (
          <Col span={12}>
            <StaticGoogleMap size="400x200" zoom={MapZoom} apiKey="AIzaSyCUnezIP5S-C4qZOf4HiJ51gK0KckxRoFs">
              <Marker location={MapLoc} color="blue" label="C" />
            </StaticGoogleMap>
          </Col>
        )}
      </Row>
    </>
  );
}
