/**
 * Validation Schemas
 * Zod schemas for server-side validation of enquiry forms.
 */

import { z } from "zod";

export const enquirySchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "Full name contains invalid characters"),
  companyName: z
    .string()
    .max(150, "Company name must not exceed 150 characters")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Invalid email address")
    .max(254, "Email must not exceed 254 characters"),
  telephone: z
    .string()
    .max(30, "Telephone number too long")
    .regex(/^[\d\s+().-]*$/, "Telephone contains invalid characters")
    .optional()
    .or(z.literal("")),
  componentDescription: z
    .string()
    .min(10, "Please provide a more detailed description (at least 10 characters)")
    .max(5000, "Description must not exceed 5000 characters"),
  materialGrade: z.string().max(100, "Material grade too long").optional().or(z.literal("")),
  approximateWeight: z
    .string()
    .max(50, "Weight specification too long")
    .optional()
    .or(z.literal("")),
  requiredQuantity: z
    .string()
    .max(50, "Quantity specification too long")
    .optional()
    .or(z.literal("")),
  additionalRequirements: z
    .string()
    .max(5000, "Additional requirements must not exceed 5000 characters")
    .optional()
    .or(z.literal("")),
  honeypot: z.string().max(0, "Spam detected").optional(),
});

export const contactSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "Full name contains invalid characters"),
  companyName: z
    .string()
    .max(150, "Company name must not exceed 150 characters")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Invalid email address")
    .max(254, "Email must not exceed 254 characters"),
  telephone: z
    .string()
    .max(30, "Telephone number too long")
    .regex(/^[\d\s+().-]*$/, "Telephone contains invalid characters")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must not exceed 200 characters"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(5000, "Message must not exceed 5000 characters"),
  honeypot: z.string().max(0, "Spam detected").optional(),
});

export function validateEnquiry(data) {
  return enquirySchema.safeParse(data);
}

export function validateContact(data) {
  return contactSchema.safeParse(data);
}

export function sanitizeString(input) {
  return String(input || "")
    .trim()
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "");
}

export function sanitizeEnquiryInput(data) {
  return {
    fullName: sanitizeString(data.fullName),
    companyName: sanitizeString(data.companyName),
    email: String(data.email || "").toLowerCase().trim(),
    telephone: sanitizeString(data.telephone),
    componentDescription: sanitizeString(data.componentDescription),
    materialGrade: data.materialGrade ? sanitizeString(data.materialGrade) : "",
    approximateWeight: data.approximateWeight ? sanitizeString(data.approximateWeight) : "",
    requiredQuantity: data.requiredQuantity ? sanitizeString(data.requiredQuantity) : "",
    additionalRequirements: data.additionalRequirements || data.message ? sanitizeString(data.additionalRequirements || data.message) : "",
    honeypot: "",
  };
}
