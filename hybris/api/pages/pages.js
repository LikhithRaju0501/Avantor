var express = require("express");
var router = express.Router();
const pagesModel = require("./pagesModel");
const UserModel = require("../user/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { PAGE_TYPES } = require("./constants");
require("dotenv").config();

router.post("/", async (req, res) => {
  try {
    const { pathname } = req?.body;
    if (pathname === process.env.CMSUSERPAGESADMIN) {
      const token = req.header("Authorization");
      if (!token) {
        return res.status(401).json([]);
      }

      jwt.verify(token, "your-secret-key", async (err, decoded) => {
        if (err) {
          return res.status(401).json([]);
        }
        const user = await UserModel.findById(decoded?.userId).lean();
        if (user?.username === process.env.CMSUSERNAME) {
          const passwordMatch = await bcrypt.compare(
            process.env.CMSUSERSAFEWORD,
            user?.password
          );
          if (passwordMatch) {
            const currentPage = await pagesModel.findOne({
              pathname,
            });

            return res
              .status(200)
              .json(currentPage ? [...currentPage?.components] : []);
          } else {
            return res.status(200).json([]);
          }
        } else {
          return res.status(200).json([]);
        }
      });
    } else {
      const currentPage = await pagesModel.findOne({
        pathname,
      });

      return res
        .status(200)
        .json(currentPage ? [...currentPage?.components] : []);
    }
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
    if (!pageTypeCheckerHandler(component)) {
      return res.status(402).json({
        message: "Invalid Page Type",
      });
    }

    if (
      user?.name === process.env.CMSUSERNAME &&
      user?.safeWord === process.env.CMSUSERSAFEWORD
    ) {
      try {
        const currentPage = await pagesModel
          .findOne({
            pathname,
          })
          .lean();
        try {
          if (currentPage) {
            const { _id, components: currentComponents } = currentPage;
            if (
              currentComponents?.some(
                (currentComponent) =>
                  currentComponent?.priority === component?.priority
              )
            ) {
              return res.status(400).json({
                message:
                  "Priority already exists, please change the priorities to adjust the order",
              });
            }
            const newComponents = [
              ...currentComponents,
              { ...component },
            ]?.sort((a, b) => a?.priority - b?.priority);

            result = await pagesModel.findOneAndUpdate(
              { _id },
              {
                $set: {
                  components: [...newComponents],
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
            error,
          });
        }
      } catch (e) {
        console.error(error);
        return res.status(500).json({
          message: "Something Went Wrong",
          error,
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

router.delete("/", async (req, res) => {
  try {
    const { user, pathname, id } = req?.body;
    if (
      user?.name === process.env.CMSUSERNAME &&
      user?.safeWord === process.env.CMSUSERSAFEWORD
    ) {
      try {
        const currentPage = await pagesModel
          .findOne({
            pathname,
          })
          .lean();

        try {
          if (currentPage) {
            const { _id, components } = currentPage;
            const newComponents = components?.filter(({ _id: componentId }) => {
              return String(componentId) !== String(id);
            });
            if (!newComponents?.length) {
              const result = await pagesModel.deleteOne({ _id });
              return res.status(201).json({
                result,
              });
            } else {
              result = await pagesModel.updateOne(
                { _id },
                {
                  $set: {
                    components: [...newComponents],
                  },
                }
              );
              return res.status(201).json({
                result,
              });
            }
          } else {
            return res.status(404).json({
              message: "CMS Page not Found",
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

router.put("/", async (req, res) => {
  try {
    const {
      user,
      pathname,
      componentId,
      component: updatedComponent,
    } = req?.body;
    if (!pageTypeCheckerHandler(updatedComponent)) {
      return res.status(402).json({
        message: "Invalid Page Type",
      });
    }
    if (
      user?.name === process.env.CMSUSERNAME &&
      user?.safeWord === process.env.CMSUSERSAFEWORD
    ) {
      try {
        const currentPage = await pagesModel.findOne({
          pathname,
        });
        try {
          if (currentPage) {
            const { _id: currentPageId, components: currentComponents } =
              currentPage;
            const index = currentComponents.findIndex(
              (component) => String(component?.id) === String(componentId)
            );
            let newComponents = [...currentComponents];
            if (index !== -1) {
              newComponents[index] = { ...updatedComponent };
              result = await pagesModel.findOneAndUpdate(
                { _id: currentPageId },
                {
                  $set: {
                    components: [...newComponents],
                  },
                },
                { new: true }
              );
              return res.status(201).json({
                result,
              });
            } else {
              return res.status(404).json({
                message: "No Such Component with the ID found.",
              });
            }
          } else {
            return res.status(404).json({
              message: "No Such Component found.",
            });
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            message: "Something Went Wrong",
            error,
          });
        }
      } catch (e) {
        console.error(error);
        return res.status(500).json({
          message: "Something Went Wrong",
          error,
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

const pageTypeCheckerHandler = (component) => {
  return PAGE_TYPES?.some((pageType) => {
    return pageType === component?.type;
  });
};

module.exports = router;
