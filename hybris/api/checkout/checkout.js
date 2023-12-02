var express = require("express");
const authenticateToken = require("../middleware/middleware");
const cartModel = require("../cart/cartModel");
const shippingOptionsModel = require("../shippingOptions/shippingOptionsModel");
var router = express.Router();

router.get("/:checkoutStep", authenticateToken, async (req, res) => {
  try {
    const checkoutStep = Number(req?.params?.checkoutStep);
    if (isValidStep(checkoutStep)) {
      const { address, primaryEmailAddress } = await cartModel.findOne({
        userId: req?.userId,
      });
      if (checkoutStep === 1) {
        //Validate Shipping Mode
        if (address && validateAddress(address)) {
          return res.status(200).json({
            message: "Valid Step(1)",
          });
        } else {
          return res.status(403).json({
            message:
              "Invalid Step(1),Please provide a Shipping Address from Shipping Options page",
          });
        }
      } else if (checkoutStep === 2) {
        if (primaryEmailAddress) {
          return res.status(200).json({
            message: "Valid Step(2)",
          });
        } else {
          return res.status(403).json({
            message: "Invalid Step(2), Primary Email Address required",
          });
        }
      }
    } else {
      return res.status(404).json({
        message: "Invalid Step",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

router.post("/addEmailAddress", authenticateToken, async (req, res) => {
  try {
    if (req?.body?.email) {
      const { primaryEmailAddress, secondaryEmailAddress } =
        await cartModel.findOne({
          userId: req?.userId,
        });
      if (
        isSecondaryMailExists(secondaryEmailAddress, req?.body?.email) ||
        primaryEmailAddress === req?.body?.email
      ) {
        return res.status(403).json({
          message: "Email Address already exists",
        });
      } else {
        result = await cartModel.findOneAndUpdate(
          { userId: req?.userId },
          {
            $push: {
              secondaryEmailAddress: req?.body?.email,
            },
          },
          { new: true }
        );
        return res.status(200).json({
          message: "Successfully added Email Address",
        });
      }
    } else {
      return res.status(500).json({
        message: "Email Address is required",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});
router.delete("/removeEmailAddress", authenticateToken, async (req, res) => {
  try {
    if (req?.body?.email) {
      const { secondaryEmailAddress } = await cartModel.findOne({
        userId: req?.userId,
      });
      if (
        secondaryEmailAddress?.length > 0 &&
        isSecondaryMailExists(secondaryEmailAddress, req?.body?.email)
      ) {
        result = await cartModel.findOneAndUpdate(
          { userId: req?.userId },
          {
            $set: {
              secondaryEmailAddress: secondaryEmailAddress?.filter(
                (address) => address !== req?.body?.email
              ),
            },
          },
          { new: true }
        );
        return res.status(200).json({
          message: "Successfully removed Email Address",
        });
      } else {
        return res.status(403).json({
          message: "Email Address doesn't exist",
        });
      }
    } else {
      return res.status(500).json({
        message: "Email Address is required",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

router.put("/updateCartAddress", authenticateToken, async (req, res) => {
  try {
    const { addressId } = req?.body;
    const { addresses: shippingOptions } = await shippingOptionsModel.findOne({
      userId: req?.userId,
    });
    const isAddressExists = shippingOptions?.find(
      (shippingOption) => String(shippingOption?._id) === addressId
    );
    if (isAddressExists) {
      const {
        cityProvince,
        country,
        isDefault,
        line1,
        line2,
        pinCode,
        state,
        _id: addressId,
      } = isAddressExists;

      result = await cartModel.findOneAndUpdate(
        { userId: req?.userId },
        {
          $set: {
            address: {
              cityProvince,
              country,
              isDefault,
              line1,
              line2,
              pinCode,
              state,
              _id: addressId,
            },
          },
        },
        { new: true }
      );
      return res.status(201).json({
        message: "Updated cart address",
      });
    } else {
      return res.status(404).json({
        message: "You are not authorized to access this address",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

const isSecondaryMailExists = (secondaryEmailAddresses, newMailId) => {
  for (const secondaryEmailAddress of secondaryEmailAddresses) {
    if (secondaryEmailAddress === newMailId) return true;
  }
  return false;
};

const isValidStep = (step) => (step === 1 || step === 2 ? true : false);

const validateAddress = (address) => {
  if (
    !address?.line1 ||
    !address?.line2 ||
    !address?.cityProvince ||
    !address?.pinCode ||
    !address?.state ||
    !address?.country ||
    !String(address?.isDefault)
  ) {
    return false;
  } else {
    return true;
  }
};

module.exports = router;
