import { describe, expect, it } from "vitest";
import { careerFormSchema, enquirySchema, experienceAreaOptions } from "../shared/lead-contracts";
import { notificationStatuses } from "../drizzle/schema";
import { normalizeEmail, verifyResumeMagic } from "./api";

describe("lead input contracts", () => {
  it("accepts a complete enquiry and normalizes email", () => {
    const parsed = enquirySchema.safeParse({
      name: "Kiran Buyer",
      email: " Buyer@Example.COM ",
      mobile: "+91 98765 43210",
      subject: "Robot cell enquiry",
      message: "Please contact me about a line integration project.",
      productSlug: "5.2m-medium-cobot-range-extender",
      consent: true,
      website: "",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.email).toBe("buyer@example.com");
    if (parsed.success) expect(parsed.data.productSlug).toBe("5.2m-medium-cobot-range-extender");
  });

  it("rejects missing consent, malformed mobile, and extra form properties", () => {
    const parsed = enquirySchema.safeParse({
      name: "Buyer Name", email: "buyer@example.com", mobile: "abc", subject: "Question",
      message: "This message has sufficient length.", consent: false, unexpected: "value",
    });
    expect(parsed.success).toBe(false);
  });

  it("preserves the six public career areas and accepts consent from multipart forms", () => {
    expect(experienceAreaOptions).toEqual(["Sales", "Production", "Editorial", "Accounts", "DTP & Designing", "HR"]);
    expect(careerFormSchema.safeParse({
      name: "Asha Rao", email: "asha@example.com", address: "Delhi, India", mobile: "9876543210",
      experienceArea: "DTP & Designing", consent: "true", website: "",
    }).success).toBe(true);
  });

  it("marks email delivery as not configured until a sender is implemented", () => {
    expect(notificationStatuses).toEqual(["not_configured", "pending", "sent", "failed"]);
  });
});

describe("authentication normalization and resume file signatures", () => {
  it("normalizes admin email consistently", () => expect(normalizeEmail(" Admin@Example.COM ")).toBe("admin@example.com"));
  it("accepts matching PDF, DOC and DOCX signatures only", () => {
    expect(verifyResumeMagic(Buffer.from("%PDF-1.7\nbody"), ".pdf")).toBe(true);
    expect(verifyResumeMagic(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]), ".doc")).toBe(true);
    expect(verifyResumeMagic(Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.from("word/document.xml")]), ".docx")).toBe(true);
    expect(verifyResumeMagic(Buffer.from("not a PDF"), ".pdf")).toBe(false);
    expect(verifyResumeMagic(Buffer.from("%PDF-1.7"), ".docx")).toBe(false);
  });
});
