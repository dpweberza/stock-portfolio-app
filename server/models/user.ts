import * as sequelize from 'sequelize';
import db from '../db';

export interface UserAttributes {
    id?: string,
    firstName: string,
    lastName: string,
    username: string;
    password: string;
    balance: number;
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
    },
    balance: {
        type: sequelize.DOUBLE
    },
};
const User = db.define<UserInstance, UserAttributes>('user', attributes as any);

export default User;