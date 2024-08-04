var express = require("express");
const authenticateToken = require("../middleware/middleware");
const cartModel = require("../cart/cartModel");
const orderModel = require("./orderModel");
const invoiceModel = require("./invoiceModel");
const UserModel = require("../user/UserModel");
const offerModel = require("../offers/offerModel");
var router = express.Router();
const moment = require("moment-timezone");
const nodemailer = require("nodemailer");
const { getPaginatedData } = require("../search/resuableMethods");
const pdf = require("html-pdf");
const { offersHandler } = require("../offers/offer");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req?.userId).lean();
    const currentPage = parseInt(req?.query?.currentPage) || 0;
    const pageSize = parseInt(req?.query?.pageSize) || 10;
    const sort = req?.query?.sort || "createdAt-desc";
    const orderedDate = req?.query?.orderedDate || "";
    const userOrders = await orderModel
      .findOne({ userId: req?.userId })
      .select("orders");
    if (userOrders) {
      const normalizedOrders = normalizeOrders(
        userOrders?.orders,
        sort,
        orderedDate
      );
      const totalResults = normalizedOrders?.length;
      const totalPages = Math.ceil(totalResults / pageSize);
      const paginatedOrders = getPaginatedData(
        normalizedOrders,
        currentPage,
        pageSize,
        totalPages,
        totalResults
      );

      return res.status(200).json({
        ...userOrders?.toObject(),
        orders: [...paginatedOrders?.entries],
        pagination: { ...paginatedOrders?.pagination },
        facets: [...generateFacets(sort, orderedDate)],
        breadcrumbs: [...generateBreadcrumbs(sort, orderedDate)],
        type: "OrderWSDTO",
      });
    } else {
      return res.status(200).json({
        userId: user?._id,
        userName: user?.username,
        orders: [],
        facets: [...generateFacets(sort, orderedDate)],
        breadcrumbs: [...generateBreadcrumbs(sort, orderedDate)],
        pagination: {
          currentPage: 0,
          pageSize: 0,
          totalPages: 0,
          totalResults: 0,
        },
        type: "OrderWSDTO",
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
    const userCart = await cartModel.findOne({
      userId: req?.userId,
    });
    if (userCart) {
      const userOrders = await orderModel.findOne({
        userId: req?.userId,
      });
      const {
        entries,
        totalPrice,
        subTotalPrice,
        address,
        primaryEmailAddress,
        secondaryEmailAddress,
        offer,
      } = userCart?.toObject();
      const order = {
        entries: [...entries] || [],
        totalPrice: { ...totalPrice } || {},
        subTotalPrice: { ...subTotalPrice } || {},
        address: { ...address } || {},
        emailAddresses: [primaryEmailAddress, ...secondaryEmailAddress] || [],
        numberOfItems: entries?.length || 0,
        orderStatus: "Placed",
        createdAt: moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
      };
      if (userOrders) {
        result = await orderModel.findOneAndUpdate(
          { _id: userOrders?._id },
          {
            $push: {
              orders: { ...order },
            },
          },
          { new: true }
        );
        const orderId = result?.orders[result?.orders?.length - 1]?._id;
        createInvoice(
          orderId,
          entries,
          totalPrice,
          subTotalPrice,
          address,
          req?.userId,
          user?.username,
          res
        );
        await deleteOffer(req?.userId, offer);
        const deleteCart = await cartModel.deleteOne({ _id: userCart?._id });
        sendMails(
          user?.username,
          entries,
          totalPrice,
          subTotalPrice,
          primaryEmailAddress,
          secondaryEmailAddress
        );

        res.status(201).json({
          message: "Orders exists, Added order",
        });
      } else {
        const currentOrder = new orderModel({
          userId: user?._id,
          userName: user?.username,
          orders: [{ ...order }],
        });

        result = await currentOrder.save();
        const orderId = result?._id;
        createInvoice(
          orderId,
          entries,
          totalPrice,
          subTotalPrice,
          address,
          req?.userId,
          user?.username,
          res
        );
        await deleteOffer(req?.userId, offer);
        const deleteCart = await cartModel.deleteOne({ _id: userCart?._id });
        sendMails(
          user?.username,
          entries,
          totalPrice,
          subTotalPrice,
          primaryEmailAddress,
          secondaryEmailAddress
        );

        res.status(201).json({
          message: "Created New Order",
        });

        try {
          await offersHandler({ ...req, userId: req?.userId }, res, false);
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      return res.status(404).json({
        message: "Cart not found.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

const createInvoice = async (
  orderId,
  entries,
  totalPrice,
  subTotalPrice,
  address,
  userId,
  userName,
  res
) => {
  try {
    const userInvoices = await invoiceModel.findOne({
      userId,
    });

    const invoiceHtml = `
  <html>
<head>
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
  }
  .container {
    width: 80%;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  .shipping-address{
    margin: 10px;
    padding: 10px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  th, td {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
  th {
    background-color: #f2f2f2;
  }
  .total-price{
    text-align: right;
  }
  .text-break{
    word-wrap: text-break;
  }
  .contact-us{
    color: red;
    font-size: 10px;
  }
</style>
</head>
<body>
<div class="container">
<h3>Ammijan</h3>
<div class="shipping-address">
<h5>Shipping Address:</h5>
<div className="text-break">
    ${address?.line1}
  </div>
  <div className="text-break">
    ${address?.line2}
  </div>
  <div className="text-break">
    ${address?.cityProvince},
    ${address?.state}
  </div>
  <div className="text-break">
    ${address?.pinCode}
  </div>
</div>
<p>This is your list of orders:</p>
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Quantity</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      ${generateTableRows(entries)}
    </tbody>
  </table>
  <p class="total-price">Total Price: ${subTotalPrice?.formattedValue} </p>
  <p class="total-price">Payment Date: ${moment()
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD HH:mm:ss")} </p>
  <p class="contact-us text-break">*Please visit contact us section of our site for more queries.</p>
</div>
</body>
</html>
  `;
    const pdfBase64 = await convertHTMLToPDF(invoiceHtml);
    const invoice = {
      name: `${orderId}.pdf`,
      invoicePDF: pdfBase64,
      paymentDate: moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
    };
    if (userInvoices) {
      const result = await invoiceModel.findOneAndUpdate(
        { _id: userInvoices?._id },
        {
          $push: {
            invoices: { $each: [{ ...invoice }], $position: 0 },
          },
        },
        { new: true }
      );
      return result;
    } else {
      const currentInvoice = new invoiceModel({
        userId,
        userName,
        invoices: [{ ...invoice }],
      });
      const result = currentInvoice?.save();
      return result;
    }
  } catch (error) {
    console.log(error);
    // return res.status(500).json({
    //   error,
    // });
  }
};

const deleteOffer = async (userId, offer) => {
  await offerModel.findOneAndUpdate(
    { userId },
    {
      $pull: {
        offers: { _id: offer?._id },
      },
    },
    { new: true }
  );
  return;
};

const convertHTMLToPDF = async (html) => {
  return new Promise((resolve, reject) => {
    pdf.create(html).toBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        const base64String = buffer.toString("base64");
        resolve(base64String);
      }
    });
  });
};

const generateFacets = (sort, orderedDate) => {
  return [
    { type: "sorts", values: [...generateSorts(sort)] },
    { type: "dateRange", values: [...generateDateFacets(orderedDate)] },
  ];
};

const generateBreadcrumbs = (sort, orderedDate) => {
  const dateRangeOptions = ["today", "last7days", "last30days"];
  const sortOptions = [
    "createdAt-asc",
    "createdAt-desc",
    "numberOfItems-asc",
    "numberOfItems-desc",
    "totalPrice-asc",
    "totalPrice-desc",
  ];
  const translations = {
    "createdAt-asc": "Date Placed (Low-High)",
    "createdAt-desc": "Date Placed (High-Low)",
    "numberOfItems-asc": "Number Of Items(Low-High)",
    "numberOfItems-desc": "Number Of Items(High-Low)",
    "totalPrice-asc": "Total Price(Low-High)",
    "totalPrice-desc": "Total Price(High-Low)",
    today: "Today",
    last7days: "Last 7 Days",
    last30days: "Last 30 Days",
  };
  return [
    {
      id: sortOptions?.includes(sort) ? sort : "createdAt-desc",
      type: "sort",
      title: translations?.[sort] || "Date Placed (High-Low)",
      isDefault: sort === "createdAt-desc" ? true : false,
    },
    {
      id: dateRangeOptions?.includes(orderedDate) ? orderedDate : "all",
      type: "orderedDate",
      title: translations?.[orderedDate] || "All",
      isDefault: !dateRangeOptions?.includes(orderedDate) ? true : false,
    },
  ];
};

const generateSorts = (sort) => {
  return [
    {
      id: "createdAt-asc",
      title: "Date Placed (Low-High)",
      selected: sort === "createdAt-asc",
    },
    {
      id: "createdAt-desc",
      title: "Date Placed (High-Low)",
      selected: sort === "createdAt-desc",
    },
    {
      id: "numberOfItems-asc",
      title: "Number Of Items(Low-High)",
      selected: sort === "numberOfItems-asc",
    },
    {
      id: "numberOfItems-desc",
      title: "Number Of Items(High-Low)",
      selected: sort === "numberOfItems-desc",
    },
    {
      id: "totalPrice-asc",
      title: "Total Price(Low-High)",
      selected: sort === "totalPrice-asc",
    },
    {
      id: "totalPrice-desc",
      title: "Total Price(High-Low)",
      selected: sort === "totalPrice-desc",
    },
  ];
};

const generateDateFacets = (orderedDate) => {
  const dateRangeOptions = ["today", "last7days", "last30days"];
  return [
    {
      id: "all",
      title: "All",
      selected: !dateRangeOptions?.includes(orderedDate),
    },
    {
      id: "today",
      title: "Today",
      selected: orderedDate === "today",
    },
    {
      id: "last7days",
      title: "Last 7 Days",
      selected: orderedDate === "last7days",
    },
    {
      id: "last30days",
      title: "Last 30 Days",
      selected: orderedDate === "last30days",
    },
  ];
};

const normalizeOrders = (orders, sort = "createdAt-desc", orderedDate = "") => {
  const dateFilteredOrders = getDateRangeOrders(orders, orderedDate);
  const sortParams = sort?.split("-");
  return dateFilteredOrders?.sort((a, b) => {
    if (sortParams?.[0] === "totalPrice") {
      return sortParams?.[1] === "desc"
        ? b?.subTotalPrice?.value - a?.subTotalPrice?.value
        : a?.subTotalPrice?.value - b?.subTotalPrice?.value;
    } else if (sortParams?.[0] === "createdAt") {
      return sortParams?.[1] === "desc"
        ? new Date(b?.createdAt) - new Date(a?.createdAt)
        : new Date(a?.createdAt) - new Date(b?.createdAt);
    } else {
      return sortParams?.[1] === "desc"
        ? b?.[sortParams[0]] - a?.[sortParams[0]]
        : a?.[sortParams[0]] - b?.[sortParams[0]];
    }
  });
};

const getDateRangeOrders = (orders = [], orderedDate = "") => {
  if (orderedDate === "today") {
    return orders?.filter((order) => {
      return (
        order?.createdAt?.getDate() === new Date().getDate() &&
        order?.createdAt?.getMonth() === new Date().getMonth() &&
        order?.createdAt?.getFullYear() === new Date().getFullYear()
      );
    });
  } else if (orderedDate === "last7days") {
    const sevenDaysAgo = new Date(
      new Date()?.getTime() - 7 * 24 * 60 * 60 * 1000
    );
    return orders?.filter((order) => {
      return order?.createdAt >= sevenDaysAgo && order?.createdAt <= new Date();
    });
  } else if (orderedDate === "last30days") {
    const last30Days = new Date(
      new Date()?.getTime() - 30 * 24 * 60 * 60 * 1000
    );
    return orders?.filter((order) => {
      return order?.createdAt >= last30Days && order?.createdAt <= new Date();
    });
  } else return orders;
};

const generateTableRows = (entries) => {
  let tableRows = "";
  for (let i = 0; i < entries?.length; i++) {
    tableRows += `
      <tr>
        <td>${entries[i]?.product}</td>
        <td>${entries[i]?.quantity}</td>
        <td>${entries[i]?.price?.formattedValue}</td>
      </tr>
    `;
  }
  return tableRows;
};

const sendMails = (
  username,
  entries,
  totalPrice,
  subTotalPrice,
  primaryEmailAddress,
  secondaryEmailAddress
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "lgrajutwitter@gmail.com",
      pass: "hcnj xnre xfqy kmtg",
    },
  });

  const mailOptions = {
    from: "Ammijan",
    subject: "Thank you for Shopping from Ammijan",
    html: `
    <html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    }
    .container {
      width: 80%;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
    }
    th {
      background-color: #f2f2f2;
    }
    .total-price{
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="container">
  <h1>Hi ${username}, Thank you for Shopping with us</h1>
  <p>This is your list of orders:</p>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${generateTableRows(entries)}
      </tbody>
    </table>
    <p class="total-price">Total Price: ${subTotalPrice?.formattedValue} </p>
  </div>
</body>
</html>
    `,
  };

  [primaryEmailAddress, ...secondaryEmailAddress]?.forEach((email) => {
    mailOptions.to = email;
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending email to ${email}:`, error);
      } else {
        console.log(`Email sent successfully to ${email}:`, info.response);
      }
    });
  });
};

module.exports = router;
