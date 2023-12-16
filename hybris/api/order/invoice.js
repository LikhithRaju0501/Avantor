var express = require("express");
const authenticateToken = require("../middleware/middleware");
const orderModel = require("./orderModel");
const invoiceModel = require("./invoiceModel");
const UserModel = require("../user/UserModel");
var router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req?.userId).lean();
    const userInvoices = await invoiceModel
      .findOne({ userId: req?.userId })
      .select({ invoices: { _id: 1, name: 2, paymentDate: 3 } })
      .lean();
    if (userInvoices) {
      return res.status(200).json({
        userId: user?._id,
        userName: user?.username,
        invoices: [...userInvoices?.invoices],
      });
    } else {
      return res.status(200).json({
        userId: user?._id,
        userName: user?.username,
        invoices: [],
      });
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

router.post("/get-invoice", authenticateToken, async (req, res) => {
  try {
    const isSingleInvoice = req?.body?.isSingleInvoice;
    if (isSingleInvoice) {
      const invoiceId = req?.body?.invoiceNumbers?.[0];
      const userInvoice = await invoiceModel
        .findOne(
          { userId: req?.userId, "invoices._id": invoiceId },
          { "invoices.$": 1 }
        )
        .lean();

      if (userInvoice?.invoices?.length > 0) {
        const { invoicePDF } = userInvoice.invoices[0];
        return res.status(200).json({
          invoicePDF,
        });
      }
    } else {
      return res.status(404).json({
        error: "Kaam Chal raha hai",
      });
    }

    return res.status(404).json({
      error: "Invoice not found",
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

module.exports = router;
