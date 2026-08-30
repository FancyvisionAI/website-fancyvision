import { z } from "zod";

const honeypot = z.string().max(0).optional();

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(150).optional(),
  subject: z.string().trim().max(160).optional(),
  message: z.string().trim().min(20).max(5000),
  website: honeypot,
});

export const appointmentSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(150).optional(),
  sector: z.string().trim().max(120).optional(),
  sectorOther: z.string().trim().max(120).optional(),
  organizationSize: z.string().trim().max(60).optional(),
  topic: z.string().trim().min(2).max(160),
  preferredDate: z.string().datetime().optional().or(z.literal("")),
  message: z.string().trim().max(3000).optional(),
  website: honeypot,
});

export const eventRegistrationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(150).optional(),
  message: z.string().trim().max(1000).optional(),
  // Envoyée par le client (useLocale()) pour permettre à l'API — hors du
  // routing next-intl car sous /api — de répondre une erreur dans la bonne
  // langue. Purement indicative, jamais persistée.
  locale: z.enum(["fr", "en"]).optional(),
  website: honeypot,
});

export const adminContentSchema = z.object({
  module: z.enum([
    "services",
    "trainings",
    "articles",
    "team",
    "case-studies",
    "faq",
    "testimonials",
    "pages",
    "media",
    "contacts",
    "appointments",
    "settings",
    "menus",
    "seo",
  ]),
  id: z.string().optional(),
  data: z.record(z.unknown()),
});
