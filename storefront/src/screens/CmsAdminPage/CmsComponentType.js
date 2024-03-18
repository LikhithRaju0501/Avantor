import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useGlobalMessage } from "../../components/GlobalMessageService/GlobalMessageService";

const CmsComponentType = ({
  type,
  currentPageData,
  setCurrentStep,
  setCMSComponentRequest,
}) => {
  const currentPagePriorities =
    currentPageData?.map(({ priority }) => priority) || [];
  const { addMessage } = useGlobalMessage();

  const paragraphComponentValidations = {
    title: { required: "Title is required" },
    description: {
      required: "Description is required",
    },
    priority: { required: "Priority is required" },
  };

  const {
    register: registerFlexComponent,
    handleSubmit: handleFlexComponentSubmit,
    formState: { errors: errorsFlexComponent },
  } = useForm();

  const {
    register: registerParagraphComponent,
    handleSubmit: handleParagraphComponentSubmit,
    formState: { errors: errorsParagraphComponent },
  } = useForm();

  const pageParagraphComponentSubmit = (data) => {
    if (parseInt(data?.priority) < 0) {
      addMessage("Priority Cannot be less than 0", "error");
      return;
    }
    if (currentPagePriorities?.includes(parseInt(data?.priority))) {
      addMessage("Priority Already Exists", "error");
      return;
    }
    setCMSComponentRequest({
      type,
      ...data,
      priority: parseInt(data?.priority),
    });
    setCurrentStep(4);
  };
  const pageFlexComponentSubmit = (data) => {
    if (parseInt(data?.priority) < 0) {
      addMessage("Priority Cannot be less than 0", "error");
      return;
    }
    if (currentPagePriorities?.includes(parseInt(data?.priority))) {
      addMessage("Priority Already Exists", "error");
      return;
    }
    setCMSComponentRequest({
      type,
      ...data,
      priority: parseInt(data?.priority),
    });
    setCurrentStep(4);
  };
  return (
    <>
      <span className="fw-bold">Type: </span>
      {type}
      {type === "FlexComponent" && (
        <>
          <Form
            className="mt-2"
            onSubmit={handleFlexComponentSubmit(pageFlexComponentSubmit)}
          >
            <Form.Label htmlFor="basic-url">Priority</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                {...registerFlexComponent("priority", {
                  required: "Priority is required",
                })}
              />
            </InputGroup>
            {currentPagePriorities?.length ? (
              <span className="small">
                *Priority cannot be among{" "}
                {currentPagePriorities?.map(
                  (priority, index) =>
                    `${priority}${
                      index !== currentPagePriorities?.length - 1 ? "," : ""
                    }`
                )}{" "}
                as they already exist.
              </span>
            ) : null}

            <div className="text-danger small">
              {errorsFlexComponent?.priority?.message}
            </div>
            <Button type="submit" className="w-100 mt-3">
              Next
            </Button>
          </Form>
        </>
      )}

      {type === "ParagraphComponent" && (
        <>
          <Form
            className="mt-2"
            onSubmit={handleParagraphComponentSubmit(
              pageParagraphComponentSubmit
            )}
          >
            <Form.Label htmlFor="basic-url">Title</Form.Label>
            <InputGroup>
              <Form.Control
                {...registerParagraphComponent(
                  "title",
                  paragraphComponentValidations.title
                )}
              />
            </InputGroup>
            <div className="text-danger small">
              {errorsParagraphComponent?.title?.message}
            </div>
            <Form.Label htmlFor="basic-url">Description</Form.Label>
            <InputGroup>
              <Form.Control
                {...registerParagraphComponent(
                  "description",
                  paragraphComponentValidations.description
                )}
              />
            </InputGroup>
            <div className="text-danger small">
              {errorsParagraphComponent?.description?.message}
            </div>

            <Form.Label htmlFor="basic-url">Priority</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                {...registerParagraphComponent(
                  "priority",
                  paragraphComponentValidations.priority
                )}
              />
            </InputGroup>
            {currentPagePriorities?.length ? (
              <span className="small">
                *Priority cannot be among{" "}
                {currentPagePriorities?.map(
                  (priority, index) =>
                    `${priority}${
                      index !== currentPagePriorities?.length - 1 ? "," : ""
                    }`
                )}{" "}
                as they already exist.
              </span>
            ) : null}
            <div className="text-danger small">
              {errorsParagraphComponent?.priority?.message}
            </div>
            <Button type="submit" className="w-100 mt-3">
              Next
            </Button>
          </Form>
        </>
      )}
      <Button
        variant="outline-dark"
        className="w-100 mb-2 mt-2"
        onClick={() => setCurrentStep(2)}
      >
        Back
      </Button>
    </>
  );
};

export default CmsComponentType;
