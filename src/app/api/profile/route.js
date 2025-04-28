import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "src/models/user";
import UserInfo from "src/models/UserInfo"; // Use default import

export async function PUT(req) {
  await mongoose.connect(process.env.MONGO_URL);
  const data = await req.json();
  const session = await getServerSession(authOptions);
  const { name, image, ...otherUserInfo } = data;

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;
  
  await User.updateOne({ email }, { name, image });
  await UserInfo.updateOne({ email }, otherUserInfo, { upsert: true });

  return Response.json({ success: true });
}

export async function GET() {
  await mongoose.connect(process.env.MONGO_URL);
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;
  const user = await User.findOne({ email }).lean();
  const userInfo = await UserInfo.findOne({ email }).lean() || {};

  return Response.json({ ...user, ...userInfo });
}