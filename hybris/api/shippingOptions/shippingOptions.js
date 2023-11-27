var express = require("express");
const { ObjectId } = require("mongodb");
const authenticateToken = require("../middleware/middleware");
const shippingOptionsModel = require("./shippingOptionsModel");
const UserModel = require("../user/UserModel");
var router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req?.userId);
    const getUserAddresses = await shippingOptionsModel.findOne({
      userId: req?.userId,
    });
    if (getUserAddresses) {
      const { addresses } = getUserAddresses;
      return res.status(200).json({
        name: user?.username,
        addresses: [...addresses],
      });
    } else {
      return res.status(200).json({
        name: user?.username,
        addresses: [],
      });
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req?.userId);
    const getUserAddresses = await shippingOptionsModel.findOne({
      userId: req?.userId,
    });
    if (getUserAddresses) {
      //Append the New Address
      const { _id: shippingOptionsId } = getUserAddresses;
      result = await shippingOptionsModel.findOneAndUpdate(
        { _id: shippingOptionsId },
        {
          $push: {
            addresses: {
              ...req?.body,
              isDefault: false,
            },
          },
        }
      );

      return res.status(201).json({
        message: "Added New Address",
      });
    } else {
      //Add New Address
      const userAddress = new shippingOptionsModel({
        userId: user?._id,
        addresses: [{ ...req?.body, isDefault: true }],
      });

      result = await userAddress.save();
      return res.status(201).json({
        message: "Created new address",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

router.put("/make-default", authenticateToken, async (req, res) => {
  try {
    const getUserAddresses = await shippingOptionsModel.findOne({
      userId: req?.userId,
    });
    const { addresses } = getUserAddresses;
    let updatedAddressList = [];
    addresses?.forEach(
      ({ line1, line2, cityProvince, state, country, pinCode, _id }) => {
        const isToBeDefault = String(_id) === req?.body?.addressId;
        updatedAddressList.push({
          line1,
          line2,
          cityProvince,
          state,
          country,
          pinCode,
          _id,
          isDefault: isToBeDefault,
        });
      }
    );
    result = await shippingOptionsModel.findOneAndUpdate(
      { userId: req?.userId },
      {
        $set: {
          addresses: [...updatedAddressList],
        },
      },
      { new: true }
    );
    return res.status(201).json({
      message: "Changed Default",
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

router.delete("/", authenticateToken, async (req, res) => {
  try {
    const getUserAddresses = await shippingOptionsModel.findOne({
      userId: req?.userId,
    });
    const { addresses } = getUserAddresses;
    const getAddress = addresses?.find(
      (address) => String(address?._id) === req?.body?.addressId
    );
    if (getAddress) {
      if (getAddress?.isDefault) {
        return res.status(400).json({
          message: "Default Address cannot be deleted.",
        });
      } else {
        let updatedAddressList = addresses?.filter(
          (address) => String(address?._id) !== req?.body?.addressId
        );

        result = await shippingOptionsModel.findOneAndUpdate(
          { userId: req?.userId },
          {
            $set: {
              addresses: [...updatedAddressList],
            },
          },
          { new: true }
        );
        return res.status(201).json({
          message: "Removed Address",
        });
      }
    } else {
      return res.status(404).json({
        message: "Address not found.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

module.exports = router;
