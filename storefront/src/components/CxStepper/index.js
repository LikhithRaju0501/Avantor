import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const CxStepper = ({ activeStep, steps, ...rest }) => {
  return (
    <Box sx={{ width: "100%" }} {...rest}>
      <Stepper activeStep={Number(activeStep)} alternativeLabel>
        {steps?.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default CxStepper;
