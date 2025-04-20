const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    productName: String,
    brandName: String,
    category: String,
    productImage: [String],
    pricing: [
      {
        currency: String,
        faceValues: [
          {
            faceValue: String,
            sellingPrice: Number,
            description: String,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;
