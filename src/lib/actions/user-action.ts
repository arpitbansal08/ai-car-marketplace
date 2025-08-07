"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { unstable_cache as cache } from "next/cache";
export const getMyProfile = cache(
  async (email: string | undefined) => {
    try {
      if (!email) return null;
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) return null;
      return user;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  },
  [],
  {
    revalidate: 60 * 60 * 24, // Revalidate every 24 hours // means the data will be fresh for 24 hours // i.e the data will be fetched from the database every 24 hours
  }
);

export const getBookmarkCars = async () => {
  const session = await auth();
  const authUser = session?.user;
  if (!authUser) return null;
  const user = await getMyProfile(authUser.email!);
  if (!user) return null;
  const cars = await prisma.car.findMany({
    where: {
      savedBy: {
        some: {
          id: user.id,
        },
      },
    },
    include: {
      specification: true,
      savedBy: {
        select: {
          id: true,
        },
      },
    },
  });
  return cars;
};
