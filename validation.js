/**
 * Validates a name.
 * Must be a string with at least 2 characters.
 * @param {string} name
 * @returns {boolean}
 */
export function validateName(name) {
    if (typeof name !== 'string') return false;
    return name.trim().length >= 2;
}

/**
 * Validates an email address.
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates an Algerian phone number.
 * Supports formats:
 * - 05/06/07xxxxxxxx (10 digits)
 * - +2135/6/7xxxxxxxx
 * - 002135/6/7xxxxxxxx
 * @param {string} phone
 * @returns {boolean}
 */
export function validateAlgerianPhoneNumber(phone) {
    // Regex breakdown:
    // ^(?:00213|\+213|0) -> Starts with 00213, +213, or 0
    // (5|6|7)            -> Followed by 5, 6, or 7 (Mobile prefixes)
    // [0-9]{8}$          -> Followed by exactly 8 digits
    const dzPhoneRegex = /^(?:00213|\+213|0)(5|6|7)[0-9]{8}$/;
    return dzPhoneRegex.test(phone);
}
