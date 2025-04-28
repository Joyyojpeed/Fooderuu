import { isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { User } from "src/models/user";
import UserInfo from "src/models/UserInfo"; // Add this import
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    
    if (!(await isAdmin())) {
      return Response.json([], { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const _id = searchParams.get('_id');
    
    if (_id) {
      // Return single user if _id is provided
      const user = await User.findById(_id).select('-password');
      if (!user) {
        return Response.json({ error: 'User not found' }, { status: 404 });
      }
      // Get user info from UserInfo collection
      const userInfo = await UserInfo.findOne({ email: user.email }).lean() || {};
      return Response.json({ ...user.toObject(), ...userInfo });
    } else {
      // Return all users if no _id is provided
      const users = await User.find().select('-password');
      return Response.json(users);
    }
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    
    if (!(await isAdmin())) {
      return Response.json({}, { status: 401 });
    }

    const { _id, ...updateData } = await req.json();
    
    // Remove _id from update data to avoid modification error
    delete updateData._id;

    // Update User collection
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { name: updateData.name, image: updateData.image, admin: updateData.admin },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // Update UserInfo collection
    const { name, image, admin, ...userInfoData } = updateData;
    await UserInfo.updateOne(
      { email: updatedUser.email },
      userInfoData,
      { upsert: true }
    );

    // Get updated user info
    const userInfo = await UserInfo.findOne({ email: updatedUser.email }).lean() || {};
    
    return Response.json({ ...updatedUser.toObject(), ...userInfo });
    
  } catch (error) {
    console.error('Error updating user:', error);
    return Response.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}