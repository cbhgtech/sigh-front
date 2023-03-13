import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";
import { prisma } from "@/services/prisma";

async function getCurrentUser() {
  const userCookies = cookies();
  const token = userCookies.get("token")?.value;

  if (!token) {
    return null;
  }

  const decoded = jwt.decode(token, { complete: true });

  // @ts-ignore
  const userId = decoded?.payload.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      admin: true,
      athlete: true,
    },
  });

  // @ts-ignore
  delete user.password;
  // @ts-ignore
  delete user?.createdAt;
  // @ts-ignore
  delete user?.updatedAt;
  // @ts-ignore
  delete user?.admin?.createdAt;
  // @ts-ignore
  delete user?.admin?.updatedAt;
  // @ts-ignore
  delete user?.athlete?.createdAt;
  // @ts-ignore
  delete user?.athlete?.updatedAt;

  return user;
}

export { getCurrentUser };
