import { z } from "zod";

export const experienceAreaOptions = ["Sales", "Production", "Editorial", "Accounts", "DTP & Designing", "HR"] as const;
export const leadStatusValues = ["new", "reviewing", "contacted", "closed"] as const;

const nameSchema = z.string().trim().min(2).max(120).regex(/^[\p{L}\p{M} .'-]+$/u, "Enter a valid name");
const emailSchema = z.string().trim().min(3).max(254).email().transform((value) => value.toLowerCase());
const mobileSchema = z.string().trim().min(7).max(24).regex(/^\+?[0-9][0-9\s().-]{6,22}[0-9]$/, "Enter a valid mobile number");
const consentSchema = z.literal(true, { error: "Consent is required" });
const honeypotSchema = z.string().max(160).optional().default("");

export const enquirySchema = z.object({
  name: nameSchema,
  email: emailSchema,
  mobile: mobileSchema,
  subject: z.string().trim().min(3).max(180),
  message: z.string().trim().min(10).max(5000),
  productSlug: z.string().trim().max(100).regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/).optional().or(z.literal("")),
  consent: consentSchema,
  website: honeypotSchema,
}).strict();

export const careerFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: z.string().trim().min(5).max(500),
  mobile: mobileSchema,
  experienceArea: z.enum(experienceAreaOptions),
  consent: z.union([z.literal(true), z.literal("true")]).transform(() => true),
  website: honeypotSchema,
}).strict();

export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1).max(256) }).strict();
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1).max(256),
  newPassword: z.string().min(12).max(256).regex(/[a-z]/).regex(/[A-Z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
}).strict();
export const leadStatusSchema = z.object({ status: z.enum(leadStatusValues) }).strict();

export type EnquiryInput = z.infer<typeof enquirySchema>;
export type CareerFormInput = z.infer<typeof careerFormSchema>;
