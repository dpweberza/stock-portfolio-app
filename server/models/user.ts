import * as sequelize from 'sequelize';
import {hashPassword} from "../auth/hash";
import db from '../db';

export interface UserAttributes {
    id?: string,
    firstName: string,
    lastName: string,
    username: string;
    password: string;
}

export interface UserMethods {
    hashPassword: (password: string) => string;
}

type UserInstance = sequelize.Instance<UserAttributes> & UserAttributes & UserMethods;

const attributes: SequelizeAttributes<UserAttributes> = {
    id: {
        type: sequelize.UUID,
        primaryKey: true,
        defaultValue: sequelize.UUIDV4
    },
    firstName: {
        type: sequelize.STRING
    },
    lastName: {
        type: sequelize.STRING
    },
    username: {
        type: sequelize.STRING
    },
    password: {
        type: sequelize.STRING
    }
};
const User = db.define<UserInstance, UserAttributes>('user', attributes as any);

User.sync({force: true}).then(async () => {
    // Table created
    User.create({
        firstName: 'John',
        lastName: 'Doe',
        username: 'john',
        password: await hashPassword('secret1'),
    });
    User.create({
        firstName: 'Jane',
        lastName: 'Doe',
        username: 'jane',
        password: await hashPassword('secret2'),
    });
});

export default User;