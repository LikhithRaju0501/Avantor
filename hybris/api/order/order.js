var express = require("express");
const authenticateToken = require("../middleware/middleware");
const cartModel = require("../cart/cartModel");
const orderModel = require("./orderModel");
const UserModel = require("../user/UserModel");
var router = express.Router();
const moment = require("moment-timezone");
const nodemailer = require("nodemailer");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req?.userId);
    const userOrders = await orderModel.findOne({ userId: req?.userId });
    if (userOrders) {
      return res.status(200).json({
        ...userOrders?.toObject(),
        type: "OrderWSDTO",
      });
    } else {
      return res.status(200).json({
        userId: user?._id,
        userName: user?.username,
        orders: [],
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
    //Need to implement sending mails
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
