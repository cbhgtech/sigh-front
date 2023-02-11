import { ReactNode } from "react";
import Image from "next/image";
import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";
import { prisma } from "@/services/prisma";
import { validateUserSession } from "@/services/validateUserSession";
import { AsideMenu } from "@/components/AsideMenu";

async function getUser() {
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

  return user;
}

const AppLayout = async ({ children }: { children: ReactNode }) => {
  await validateUserSession();

  const user = await getUser();

  return (
    <div className="grid grid-cols-5 grid-rows-[64px_1fr] overflow-y-hidden w-full h-screen bg-light-surface-1">
      <header className="flex items-center justify-between px-4 col-span-5 bg-light-surface-1">
        <Image
          className="object-contain"
          src="/images/cbhg-logo.png"
          width={80}
          height={45}
          alt="Logo da Federação nacional de hoquei sobre grama"
        />
        <h1 className="text-xl text-light-on-surface-variant">Dashboard</h1>
        <button
          type="button"
          className="w-auto h-9 rounded-full flex gap-4 items-center text-light-on-surface-variant"
        >
          {user?.name}
          <Image
            // src={user?.photoUrl || USER_NOT_FOUND_IMG}
            src="/images/user-img.jpg"
            alt={user?.name || "Usuário não encontrado"}
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
        </button>
      </header>

      <aside className="absolute duration-200 ease-in-out lg:translate-x-0 lg:p-4 top-0 left-0 z-10 w-full min-h-screen h-full lg:relative lg:w-full lg:col-span-1 bg-light-surface-1">
        <div className="bg-light-surface-1 overflow-y-auto flex flex-col min-h-screen h-full p-4 lg:rounded-3xl md:pb-20">
          <div className="flex justify-between mb-4 lg:hidden">
            <Image
              className="object-contain"
              src="/images/cbhg-logo.png"
              width={80}
              height={45}
              alt="Logo da Federação nacional de hoquei sobre grama"
            />
          </div>
          <AsideMenu />
        </div>
      </aside>

      <main className="col-span-5 lg:col-span-4 h-full overflow-y-auto">
        <div className=" p-4 bg-light-surface-1 mb-24">
          <div className="bg-light-surface p-6 rounded-2xl">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;