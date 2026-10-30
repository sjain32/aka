// WhatsApp number in international format, digits only (no +, spaces or dashes).
// e.g. India +91 98765 43210 -> '919876543210'
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '8854812375';

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hi Akash! I came across your portfolio and I'd like to book a call to discuss a project.";

export function getWhatsAppUrl(message: string = WHATSAPP_DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
