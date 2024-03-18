import React, { useState } from "react";
import { CxSpinner, CxStepper } from "../../components";
import { useGetCMSPage, useCreateCMSPage } from "../../api/pages";
import CmsComponentType from "./CmsComponentType";
import { useNavigate } from "react-router-dom";
import { useGlobalMessage } from "../../components/GlobalMessageService/GlobalMessageService";
import CmsAdminPageURLHandler from "./CmsAdminPageURLHandler";
import CmsAdminPageComponentTypeHandler from "./CmsAdminPageComponentTypeHandler";
import CmsAdminCredentialsHandler from "./CmsAdminCredentialsHandler";

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

  let navigate = useNavigate();

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
          <CmsAdminPageURLHandler pageURLFormSubmit={pageURLFormSubmit} />
        )}

        {currentStep === 2 && (
          <CmsAdminPageComponentTypeHandler
            CMSPageData={CMSPageData}
            CMSComponentType={CMSComponentType}
            setCMSComponentType={setCMSComponentType}
            componentTypes={componentTypes}
            setCurrentStep={setCurrentStep}
          />
        )}

        {currentStep === 3 && (
          <CmsComponentType
            type={CMSComponentType}
            currentPageData={CMSPageData}
            setCurrentStep={setCurrentStep}
            setCMSComponentRequest={setCMSComponentRequest}
          />
        )}

        {currentStep === 4 && (
          <CmsAdminCredentialsHandler
            createCMSPage={createCMSPage}
            CMSPageURL={CMSPageURL}
            CMSComponentRequest={CMSComponentRequest}
          />
        )}
      </div>
    </div>
  ) : (
    <CxSpinner />
  );
};

export default CmsAdminPage;
