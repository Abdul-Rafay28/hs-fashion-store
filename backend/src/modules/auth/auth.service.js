import User from "./auth.model.js";
import { ApiError } from "../../utils/apiError.js";
import { generateToken } from "../../utils/generateToken.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const loginAdmin = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = generateToken({
    userId: user._id,
    role: user.role,
  });

  return {
    token,
    user: sanitizeUser(user),
  };
};

export const getCurrentAdmin = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(404, "Admin account not found.");
  }

  return sanitizeUser(user);
};

export const ensureAdminAccount = async () => {
  const existingAdmin = await User.findOne({ role: "admin" });

  if (existingAdmin) {
    return existingAdmin;
  }

  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!name || !email || !password) {
    console.warn(
      "Admin bootstrap skipped. Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD to create the first admin automatically.",
    );
    return null;
  }

  const admin = await User.create({
    name,
    email,
    password,
    role: "admin",
  });

  console.log(`Admin account created for ${admin.email}.`);
  return admin;
};

