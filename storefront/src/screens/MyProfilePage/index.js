import React, { useEffect } from "react";
import { useUserDetails } from "../../api/user";
import { CxSpinner } from "../../components";
import { Button, Form, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";

const MyProfilePage = () => {
  const { data: userData, isLoading: isUserDataLoading } = useUserDetails();
  const {
    register: registerUserDetails,
    handleSubmit: handleUserDetails,
    setValue: setUserDetails,
    watch: watchUserDetails,
    formState: { errors: errorsUserDetails },
  } = useForm();

  useEffect(() => {
    if (!isUserDataLoading) {
      const { username, email } = userData?.data;
      setUserDetails("username", username);
      setUserDetails("email", email);
    }
  }, [userData]);

  return isUserDataLoading ? (
    <CxSpinner />
  ) : (
    <div id="edit-profile" className="container">
      <h2>Personal Info</h2>
      <div className="text-break mb-3">
        To update your profile, simply change the information below and click
        the "Submit" button.
      </div>
      <div className="d-flex justify-content-around align-items-center">
        <div className="mb-2">
          <Image
            src={userData?.data?.profilePic?.userProfilePic}
            style={{ height: "200px", width: "250px", borderRadius: "50%" }}
          />
        </div>
        <div className="w-50 text-center">
          <div className="mb-2">
            Press on Submit to apply changes (Removing existing profile pic will
            provide you with a random avatar)
          </div>
          <div className="row justify-content-around">
            <Button className="col-5" variant="success">
              Update Profile Pic
            </Button>
            <Button className="col-5" variant="danger">
              Remove Profile Pic
            </Button>
          </div>
        </div>
      </div>
      <div className="row justify-content-between">
        <div className="col-5">
          <Form.Group className="mb-3">
            <Form.Label>
              Username <span className="small text-danger">*</span>
            </Form.Label>
            <Form.Control type="text" {...registerUserDetails("username")} />
            {/* <div className="text-danger">
                {errorsEmail?.password?.message}
              </div> */}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="text" {...registerUserDetails("number")} />
            {/* <div className="text-danger">
                {errorsEmail?.password?.message}
              </div> */}
          </Form.Group>
        </div>
        <div className="col-5">
          <Form.Group className="mb-3">
            <Form.Label>
              Email ID <span className="small text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              disabled
              {...registerUserDetails("email")}
            />
            {/* <div className="text-danger">
                {errorsEmail?.password?.message}
              </div> */}
          </Form.Group>
        </div>
      </div>
      <div className="mb-3">
        <h3>Data Privacy Settings</h3>
        <span>
          <Form.Check
            type="switch"
            id="custom-switch"
            label={
              <span>
                Yes, I would like to enhance my shopping experience through the
                use of my personal shopping data.{" "}
                <a href="/privacy-policy">Privacy Policy</a>
              </span>
            }
          />
        </span>
      </div>
      <div className="row w-50 justify-content-between mb-3">
        <Button className="col-5">Submit</Button>
        <Button variant="outline-secondary" className="col-5">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default MyProfilePage;
