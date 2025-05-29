import mongoose from "mongoose";

const ethWithdrawalRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    ethAddress: {
      type: String,
      required: true
    },
    nairaAmount: {
      type: Number,
      required: true
    },
    ethEquivalent: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Processed", "Rejected"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("EthWithdrawalRequest", ethWithdrawalRequestSchema);
