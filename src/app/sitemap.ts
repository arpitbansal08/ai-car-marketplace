import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL! || "https://localhost:3000";
  const cars = await prisma.car.findMany({
    select: { id: true, updatedAt: true },
  });

  const carsUrl: MetadataRoute.Sitemap = cars.map((car) => ({
    url: `${baseUrl}/cars/${car.id}`,
    lastModified: new Date(car.updatedAt),
    changeFrequency: "yearly",
    priority: 1,
  }));
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: baseUrl + "/about",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    ...carsUrl,
  ];
}
export const dynamic = "force-dynamic";
