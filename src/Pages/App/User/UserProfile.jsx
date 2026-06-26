import { Button, Col, Row } from "antd";
import { ProfilePhoto } from "Components/Common/Images";
import SvApiUploader from "Components/Common/SvApiUploader";
import environment from "Environment";
import moment from "moment";
import React, { useEffect, useState, useContext } from "react";

import { trackPromise } from "react-promise-tracker";
import DefaultService from "Services/API/DefaultService";
import AuthService from "Services/AuthService";
import { notify } from "Services/ToastService";
import Context from "Store/Context";

const UserProfile = (props) => {
  const [auth_user, setAuthUser] = useState();
  const [profilePic, setProfilePic] = useState();
  let { setUser } = useContext(Context);

  useEffect(async () => {
    let u = AuthService.getCurrentUser();
    setAuthUser(u);
  }, []);

  const updateUser = async () => {
    let u = { ...auth_user };
    u.profile_pic = profilePic;
    const { data, status, message } = await trackPromise(DefaultService.PUT(`/user/${auth_user.id}`, u));
    setUser(u);
    AuthService.setCurrentUser(u);
    setAuthUser(u);
    notify(message, status);
  };
  return (
    <>
      {auth_user && (
        <div>
          <h2>User Profile Page</h2>
          <Row gutter={(10, 10)} className="m-3">
            <Col span={6}>Name:</Col>
            <Col>{auth_user.display_name}</Col>
          </Row>
          <Row gutter={(10, 10)} className="m-3">
            <Col span={6}>Username:</Col>
            <Col>{auth_user.username}</Col>
          </Row>
          <Row gutter={(10, 10)} className="m-3">
            <Col span={6}>Status:</Col>
            <Col>{auth_user.status}</Col>
          </Row>
          <Row gutter={(10, 10)} className="m-3">
            <Col span={6}>Registered on:</Col>
            <Col>{moment(auth_user.created).format("YYYY-MM-DD")}</Col>
          </Row>
          <Row gutter={(10, 10)} className="m-3">
            <Col span={6}>Profile picture:</Col>
            <Col>
              <div className="flex">
                <div className="mr-auto">
                  Existing Photo <br />
                  <ProfilePhoto filename={auth_user && auth_user["profile_pic"]} width={200} />
                </div>
                <div className="mr-auto">
                  New Photo <br />
                  <SvApiUploader
                    endpoint={`${environment.API.BASE_URL}${environment.API.VERSION}${environment.ENDPOINTS.UPLOAD_PROFILE_PIC}`}
                    fileType="picture"
                    multiple={false}
                    maxCount={1}
                    sizeLimit={20}
                    width={200}
                    onFileUploaded={({ name, path }) => {
                      //form.setFieldsValue({ ["profile_pic"]: path });

                      setProfilePic(path);
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={(10, 10)} className="m-3">
            <Col span={6}></Col>
            <Col>
              <Button onClick={updateUser}>Save Changes</Button>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default UserProfile;
