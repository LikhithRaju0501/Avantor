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
          isSingleInvoice,
          invoicePDF,
        });
      }
    } else {
      const invoiceIds = req?.body?.invoiceNumbers;
      const { invoices } = await invoiceModel
        .findOne({ userId: req?.userId })
        .lean();

      const filteredInvoices = filterInvoices([...invoices], [...invoiceIds]);

      return res
        .status(200)
        .json({ isSingleInvoice, invoices: [...filteredInvoices] });
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

const filterInvoices = (invoices, invoiceIds) => {
  try {
    let base64PDFs = [];
    invoices?.filter((invoice) => {
      if (invoiceIds?.includes(String(invoice?._id))) {
        base64PDFs = [
          ...base64PDFs,
          {
            name: invoice?.name,
            invoicePDF: invoice?.invoicePDF,
          },
        ];
      }
    });
    return base64PDFs;
  } catch (error) {
    console.log(error);
  }
};

module.exports = router;
