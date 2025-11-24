import { expect, test, describe } from 'vitest'
import { validateName, validateEmail, validateAlgerianPhoneNumber } from './validation.js'

describe('Validation Functions', () => {
    test('validateName', () => {
        expect(validateName('John')).toBe(true)
        expect(validateName('Jo')).toBe(true)
        expect(validateName('محمد')).toBe(true) // Arabic name
        expect(validateName('علي')).toBe(true)  // Arabic name
        expect(validateName('J')).toBe(false)
        expect(validateName('م')).toBe(false)   // Arabic single letter
        expect(validateName('')).toBe(false)
        expect(validateName(123)).toBe(false)
    })

    test('validateEmail', () => {
        expect(validateEmail('test@example.com')).toBe(true)
        expect(validateEmail('invalid-email')).toBe(false)
        expect(validateEmail('test@.com')).toBe(false)
        expect(validateEmail('@example.com')).toBe(false)
    })

    test('validateAlgerianPhoneNumber', () => {
        // Valid cases
        expect(validateAlgerianPhoneNumber('0550123456')).toBe(true) // Mobilis/Ooredoo/Djezzy prefix
        expect(validateAlgerianPhoneNumber('0660123456')).toBe(true)
        expect(validateAlgerianPhoneNumber('0770123456')).toBe(true)
        expect(validateAlgerianPhoneNumber('+213550123456')).toBe(true)
        expect(validateAlgerianPhoneNumber('00213550123456')).toBe(true)

        // Invalid cases
        expect(validateAlgerianPhoneNumber('0450123456')).toBe(false) // Wrong prefix
        expect(validateAlgerianPhoneNumber('055012345')).toBe(false)  // Too short
        expect(validateAlgerianPhoneNumber('05501234567')).toBe(false) // Too long
        expect(validateAlgerianPhoneNumber('1234567890')).toBe(false)
    })
})
