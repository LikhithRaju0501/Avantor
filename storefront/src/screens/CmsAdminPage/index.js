import React, { useState } from "react";
import { CxSpinner, CxStepper } from "../../components";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useGetCMSPage, useCreateCMSPage } from "../../api/pages";
import CmsComponentType from "./CmsComponentType";
import { useNavigate } from "react-router-dom";
import { useGlobalMessage } from "../../components/GlobalMessageService/GlobalMessageService";

const CmsAdminPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [CMSPageData, setCMSPageData] = useState([]);
  const [CMSPageURL, setCMSPageURL] = useState("");
  const [CMSComponentType, setCMSComponentType] = useState("FlexComponent");
  const [CMSComponentRequest, setCMSComponentRequest] = useState({});
  const steps = [
    "Page URL",
    "Component Type",
    "Fill Component Details",
    "Credentials",
  ];
  const componentTypes = [
    "FlexComponent",
    "ParagraphComponent",
    "CarouselComponent",
    "AccordionComponent",
  ];
  const { addMessage } = useGlobalMessage();

  const validations = {
    name: { required: "Name is required" },
    safeWord: {
      required: "Password is required",
    },
  };
  const { register: registerPageURL, handleSubmit: handlePageURLSubmit } =
    useForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let navigate = useNavigate();

  const formSubmit = (data) => {
    const CMSPayload = {
      user: {
        ...data,
      },
      pathname: CMSPageURL,
      component: {
        ...CMSComponentRequest,
      },
    };
    createCMSPage(CMSPayload);
  };

  const onFetchPageSuccess = (data) => {
    setCurrentStep(2);
    setCMSPageData([...data?.data]);
  };

  const onCreatePageSuccess = () => {
    addMessage("Page/Component created", "success");
    navigate(`${CMSPageURL}`);
  };
  const onCreatePageError = () => {
    addMessage("Something went wrong, please try again later", "error");
  };
  const { isLoading: isFetchCMSPageLoading, mutate: getCurrentPage } =
    useGetCMSPage(onFetchPageSuccess);

  const { isLoading: isCreateCMSPageLoading, mutate: createCMSPage } =
    useCreateCMSPage(onCreatePageSuccess, onCreatePageError);

  const pageURLFormSubmit = (data) => {
    getCurrentPage(`/${data?.pageURL}`);
    setCMSPageURL(`/${data?.pageURL}`);
  };

  return !isFetchCMSPageLoading && !isCreateCMSPageLoading ? (
    <div className="container">
      <CxStepper steps={steps} activeStep={currentStep} className="mb-4" />
      <div className="mx-auto col-md-6">
        {currentStep === 1 && (
          <Form onSubmit={handlePageURLSubmit(pageURLFormSubmit)}>
            <Form.Label htmlFor="basic-url">CMS Page URL</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">/</InputGroup.Text>
              <Form.Control
                aria-label="CMS Page URL"
                aria-describedby="basic-addon1"
                {...registerPageURL("pageURL")}
              />
            </InputGroup>
            <Button type="submit" className="w-100">
              Next
            </Button>
          </Form>
        )}

        {currentStep === 2 && (
          <>
            <h3>Current Components:</h3>
            {CMSPageData?.length ? (
              CMSPageData?.map(({ _id, type, ...rest }) => (
                <div key={_id}>
                  <Button variant="light" className="w-100 mb-2">
                    {type}
                  </Button>
                </div>
              ))
            ) : (
              <span className="text-center">Empty Page</span>
            )}
            <hr />
            <h4>Select Component Type: </h4>
            <Form.Select
              value={CMSComponentType}
              onChange={(event) => setCMSComponentType(event?.target?.value)}
              className="mt-3 mb-3 cursor-pointer"
            >
              {componentTypes?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
            <Button
              variant="secondary"
              className="w-100 mb-2"
              onClick={() => setCurrentStep(3)}
            >
              Add
            </Button>

            <Button
              variant="outline-dark"
              className="w-100 mb-2"
              onClick={() => setCurrentStep(1)}
            >
              Back
            </Button>
          </>
        )}

        {currentStep === 3 && (
          <>
            <div>
              <span className="fw-bold">Type: </span>
              {CMSComponentType}
              <CmsComponentType
                type={CMSComponentType}
                currentPageData={CMSPageData}
                setCurrentStep={setCurrentStep}
                setCMSComponentRequest={setCMSComponentRequest}
              />
            </div>
          </>
        )}

        {currentStep === 4 && (
          <Form onSubmit={handleSubmit(formSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                placeholder="Enter name"
                autoComplete="off"
                {...register("name", validations.name)}
              />
              <div className="text-danger small">{errors?.name?.message}</div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                autoComplete="off"
                {...register("safeWord", validations.safeWord)}
              />
              <div className="text-danger small">
                {errors?.safeWord?.message}
              </div>
            </Form.Group>
            <Button variant="success" type="submit" className="w-100 mb-2">
              Create
            </Button>
            <Button
              variant="outline-dark"
              className="w-100 mb-2"
              onClick={() => setCurrentStep(3)}
            >
              Back
            </Button>
          </Form>
        )}
      </div>
    </div>
  ) : (
    <CxSpinner />
  );
};

export default CmsAdminPage;
