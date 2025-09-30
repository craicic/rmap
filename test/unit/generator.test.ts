import {randomDirName} from '../../server/services/generator';
import {describe, expect, it, vi} from 'vitest';
import crypto from 'crypto';

describe('randomDirName', () => {
    it('should return a string of default length 6', () => {
        const result = randomDirName();
        expect(result).toHaveLength(6);
    });

    it('should return a string of specified length', () => {
        const length = 10;
        const result = randomDirName(length);
        expect(result).toHaveLength(length);
    });

    it('should only contain alphanumeric characters', () => {
        const result = randomDirName(20);
        expect(result).toMatch(/^[a-zA-Z0-9]+$/);
    });

    it('should generate different values on subsequent calls', () => {
        const result1 = randomDirName();
        const result2 = randomDirName();
        expect(result1).not.toBe(result2);
    });

    it('should handle different length parameters', () => {
        const lengths = [1, 5, 8, 15, 32];
        lengths.forEach(length => {
            const result = randomDirName(length);
            expect(result).toHaveLength(length);
            expect(result).toMatch(/^[a-zA-Z0-9]+$/);
        });
    });

    it('should use crypto.randomBytes for generation', () => {
        const spy = vi.spyOn(crypto, 'randomBytes');
        const length = 8;
        randomDirName(length);
        expect(spy).toHaveBeenCalledWith(length);
        spy.mockRestore();
    });

    it('should remove trailing X, should ', () => {
        const length = 6;
        for (let x = 0; x < 1000; x++) {
            const name = randomDirName(length)
            expect(name).toHaveLength(6)
            const result = (name.slice(0, 1) + name.slice(5, 6)).toLowerCase()
            expect(result).not.toContain('x');
        }
    });
});