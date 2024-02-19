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
    if (user?.name === "Likki" && user?.safeWord === "Span") {
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
    if (user?.name === "Likki" && user?.safeWord === "Span") {
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
