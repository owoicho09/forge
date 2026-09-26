/**
 * Normalizes a phone/WhatsApp number to E.164 (e.g. "+2348031234567") for
 * storage and matching. Numbers without a country code are assumed to be
 * Nigerian: "0803 123 4567", "803-123-4567", "2348031234567" and
 * "+234 (0)803 123 4567" all normalize to the same value. Other countries need
 * a leading "+" or "00". Returns null if it can't be a real number.
 */
export function normalizePhone(raw: string | null | undefined): string | null {
  const input = raw?.trim()
  if (!input) return null
  if (!/^\+?[\d\s\-().]+$/.test(input)) return null

  let digits = input.replace(/\D/g, '')
  if (!input.startsWith('+')) {
    if (digits.startsWith('00')) {
      digits = digits.slice(2)
    } else if (/^0\d{10}$/.test(digits)) {
      digits = `234${digits.slice(1)}` // Nigerian local format, 0XXXXXXXXXX
    } else if (/^[789]\d{9}$/.test(digits)) {
      digits = `234${digits}` // Nigerian mobile without the leading 0
    } else if (digits.startsWith('0')) {
      return null // Local number from somewhere else: needs a country code.
    }
  }

  // "+234 0803…" — drop the trunk 0 after the Nigerian country code.
  if (/^2340\d{10}$/.test(digits)) digits = `234${digits.slice(4)}`
  if (digits.startsWith('234') && digits.length !== 13) return null

  if (digits.length < 8 || digits.length > 15 || digits.startsWith('0')) return null
  return `+${digits}`
}
