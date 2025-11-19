import connect from "../../db/mongodb";
import User from "../../models/User";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { uid, address, billingAddress } = body;

  if (!uid) {
    return { error: "UID required" };
  }

  await connect();

  const updateFields = {
    phone: address.phone,
    pincode: address.pincode,
    house: address.house,
    area: address.area,
    city: address.city,
    state: address.state,

  };

  const updatedUser = await User.findOneAndUpdate(
    { uid },
    { $set: updateFields },
    { new: true }
  );

  return { success: true, user: updatedUser };
});
