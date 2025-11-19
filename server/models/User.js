import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: String,
  name: String,
  createdAt: { type: Date, default: Date.now },

  phone: String,
  pincode: String,
  house: String,
  area: String,
  city: String,
  state: String,

});

export default mongoose.model("User", UserSchema);