import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  location: String,
  potentialRevenue: {
    value: Number,
    percentage: Number,
  },
  competitorProcessingVolume: {
    value: Number,
    percentage: Number,
  },
  competitorMerchant: Number,
  revenuePerAccount: Number,
  marketShareByRevenue: Number,
  commercialDDAs: Number,
  type: String,
  parentLocation: String,
});

export const Location = mongoose.model("Location", locationSchema);
