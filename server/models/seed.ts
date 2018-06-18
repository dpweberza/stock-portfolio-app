import {hashPassword} from '../auth/hash';
import Stock from './stock';
import User from './user';

export default () => {
    User.sync({force: true}).then(async () => {
        const john = await User.create({
            firstName: 'John',
            lastName: 'Doe',
            username: 'john',
            password: await hashPassword('secret1'),
            balance: 1500,
        });
        const jane = await User.create({
            firstName: 'Jane',
            lastName: 'Doe',
            username: 'jane',
            password: await hashPassword('secret2'),
            balance: 45000,
        });

        Stock.sync({force: true}).then(async () => {
            Stock.create({
                userId: john.id!,
                symbol: 'GOOG',
                count: 20,
            });
            Stock.create({
                userId: john.id!,
                symbol: 'DOW',
                count: 50,
            });
            Stock.create({
                    userId: jane.id!,
                symbol: 'DOW',
                count: 8,
            });
        });
    });
};