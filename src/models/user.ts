import { Document, model, Schema } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = model<IUser>("User", userSchema);
export default User;
