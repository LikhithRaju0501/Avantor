const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  pathname: {
    required: false,
    type: String,
  },
  components: [
    {
      type: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: function () {
          return this.type === "ParagraphComponent";
        },
      },
      slides: {
        type: [
          {
            title: {
              type: String,
              required: true,
            },
            description: {
              type: String,
              required: true,
            },
            imgSrc: {
              type: String,
              required: true,
            },
            isButton: {
              type: Boolean,
              required: false,
            },
            buttonTitle: {
              type: String,
              required: function () {
                return this.isButton;
              },
            },
            btnUrl: {
              type: String,
              required: function () {
                return this.isButton;
              },
            },
          },
        ],
        required: function () {
          return this.type === "CarouselComponent";
        },
      },
      accordionItems: {
        type: [
          {
            title: {
              type: String,
              required: true,
            },
            description: {
              type: String,
              required: true,
            },
          },
        ],
        required: function () {
          return this.type === "AccordionComponent";
        },
      },
    },
  ],
});

module.exports = mongoose.model("pages", dataSchema);
