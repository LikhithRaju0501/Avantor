var express = require("express");
const authenticateToken = require("../middleware/middleware");
const cartModel = require("../cart/cartModel");
const orderModel = require("./orderModel");
const UserModel = require("../user/UserModel");
var router = express.Router();
const moment = require("moment-timezone");
const nodemailer = require("nodemailer");
const { getPaginatedData } = require("../search/resuableMethods");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req?.userId).lean();
    const currentPage = parseInt(req?.query?.currentPage) || 0;
    const pageSize = parseInt(req?.query?.pageSize) || 10;
    const sort = req?.query?.sort || "createdAt-desc";
    const userOrders = await orderModel
      .findOne({ userId: req?.userId })
      .select("orders");
    if (userOrders) {
      const totalResults = userOrders?.orders?.length;
      const totalPages = Math.ceil(totalResults / pageSize);
      const paginatedOrders = getPaginatedData(
        normalizeOrders(userOrders?.orders, sort),
        currentPage,
        pageSize,
        totalPages,
        totalResults
      );

      return res.status(200).json({
        ...userOrders?.toObject(),
        orders: [...paginatedOrders?.entries],
        pagination: { ...paginatedOrders?.pagination },
        sorts: [...generateSorts(sort)],
        type: "OrderWSDTO",
      });
    } else {
      return res.status(200).json({
        userId: user?._id,
        userName: user?.username,
        orders: [],
        sorts: [...generateSorts(sort)],
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
        address,
        primaryEmailAddress,
        secondaryEmailAddress,
      } = userCart?.toObject();
      const order = {
        entries: [...entries] || [],
        totalPrice: { ...totalPrice } || {},
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
        const deleteCart = await cartModel.deleteOne({ _id: userCart?._id });
        sendMails(
          user?.username,
          entries,
          totalPrice,
          primaryEmailAddress,
          secondaryEmailAddress
        );

        return res.status(201).json({
          message: "Orders exists, Added order",
        });
      } else {
        const currentOrder = new orderModel({
          userId: user?._id,
          userName: user?.username,
          orders: [{ ...order }],
        });

        result = await currentOrder.save();
        const deleteCart = await cartModel.deleteOne({ _id: userCart?._id });
        sendMails(
          user?.username,
          entries,
          totalPrice,
          primaryEmailAddress,
          secondaryEmailAddress
        );
        return res.status(201).json({
          message: "Created New Order",
        });
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

const generateSorts = (sort) => {
  return [
    {
      id: "createdAt-asc",
      title: "Date Placed (0 - 1)",
      selected: sort === "createdAt-asc",
    },
    {
      id: "createdAt-desc",
      title: "Date Placed (1 - 0)",
      selected: sort === "createdAt-desc",
    },
    {
      id: "numberOfItems-asc",
      title: "Number Of Items(0-1)",
      selected: sort === "numberOfItems-asc",
    },
    {
      id: "numberOfItems-desc",
      title: "Number Of Items(1-0)",
      selected: sort === "numberOfItems-desc",
    },
    {
      id: "totalPrice-asc",
      title: "Total Price(0-1)",
      selected: sort === "totalPrice-asc",
    },
    {
      id: "totalPrice-desc",
      title: "Total Price(1-0)",
      selected: sort === "totalPrice-desc",
    },
  ];
};

const normalizeOrders = (orders, sort = "createdAt-desc") => {
  const sortParams = sort?.split("-");
  return orders?.sort((a, b) => {
    if (sortParams?.[0] === "totalPrice") {
      return sortParams?.[1] === "desc"
        ? b?.totalPrice?.value - a?.totalPrice?.value
        : a?.totalPrice?.value - b?.totalPrice?.value;
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
    <p class="total-price">Total Price: ${totalPrice?.formattedValue} </p>
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
