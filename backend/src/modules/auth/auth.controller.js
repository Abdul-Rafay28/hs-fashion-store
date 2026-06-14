import { getAuthCookieOptions } from "../../utils/cookieOptions.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getCurrentAdmin, loginAdmin } from "./auth.service.js";

export const login = asyncHandler(async (req, res) => {
  const { token, user } = await loginAdmin(req.body);

  res.cookie("token", token, getAuthCookieOptions());

  res.json({
    success: true,
    message: "Login successful.",
    data: user,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const cookieOptions = getAuthCookieOptions();
  res.clearCookie("token", {
    httpOnly: cookieOptions.httpOnly,
    sameSite: cookieOptions.sameSite,
    secure: cookieOptions.secure,
  });

  res.json({
    success: true,
    message: "Logged out successfully.",
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await getCurrentAdmin(req.user._id);

  res.json({
    success: true,
    data: user,
  });
});
