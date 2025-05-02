import mongoose from 'mongoose';

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

export default productModel;
