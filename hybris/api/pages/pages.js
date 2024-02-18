var express = require("express");
var router = express.Router();
const pagesModel = require("./pagesModel");

router.post("/", async (req, res) => {
  try {
    const { pathname } = req?.body;

    const currentPage = await pagesModel.findOne({
      pathname,
    });

    return res
      .status(200)
      .json(currentPage ? [...currentPage?.components] : []);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});

router.post("/add-page", async (req, res) => {
  try {
    const { user, pathname, component } = req?.body;
    if (user?.name === "Likki" && user?.safeWord === "Span") {
      try {
        const currentPage = await pagesModel.findOne({
          pathname,
        });
        try {
          if (currentPage) {
            const { _id } = currentPage;
            result = await pagesModel.findOneAndUpdate(
              { _id },
              {
                $push: {
                  components: {
                    ...component,
                  },
                },
              },
              { new: true }
            );
            return res.status(201).json({
              result,
            });
          } else {
            const newComponent = new pagesModel({
              pathname,
              components: [{ ...component }],
            });

            result = await newComponent.save();
            return res.status(201).json({
              result,
            });
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            message: "Something Went Wrong",
          });
        }
      } catch (e) {
        console.error(error);
        return res.status(500).json({
          message: "Something Went Wrong",
        });
      }
    } else {
      return res.status(401).json({
        message:
          "You are not authorized to perform this action, Please contact the Admin.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});

module.exports = router;
