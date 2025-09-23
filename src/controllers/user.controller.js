import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user data from frontend
  const { username, fullName, password, email } = req.body;

  console.log("email", email);

  //validate user data
  if (
    [username, fullName, password, email].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists: username, email
  const existingUser = User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this username or email");
  }

  // check for images, check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  //upload images to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath, "avatar");

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  // upload images to cloudinary, coverImage
  const coverImage = await uploadOnCloudinary(
    coverImageLocalPath,
    "coverImage"
  );

  // create user object - create entry in database
  const user = await User.create({
    username: username.toLowerCase(),
    avatar: avatar.url,
    fullName,
    password,
    email,
    coverImage: coverImage?.url || "",
  });

  // remove password and refresh token from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  // return response
  return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
