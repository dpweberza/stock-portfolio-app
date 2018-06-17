import {comparePassword, hashPassword} from '../auth/hash';

describe('test', () => {
    it('should', async () => {
        const password = 'secret';
        const hashedPassword = await hashPassword(password);
        const matches = await comparePassword(password, hashedPassword);
        expect(matches).toBeTruthy();
    });
});