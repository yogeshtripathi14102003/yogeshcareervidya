import { z } from "zod";

export const createBannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  linkUrl: z.string().optional(),
  promotionId: z.string().optional(),
  position: z.enum(["HERO", "STRIP"]),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  isActive: z.boolean().optional(),
});

export const updateBannerSchema = createBannerSchema.partial();
