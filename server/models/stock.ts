import * as sequelize from 'sequelize';
import db from '../db';
import User from './user';

export interface StockAttributes {
    id?: string,
    userId: string,
    symbol: string,
    count: number;
}

export interface StockMethods {
    hashPassword: (password: string) => string;
}

type StockInstance = sequelize.Instance<StockAttributes> & StockAttributes & StockMethods;

const attributes: SequelizeAttributes<StockAttributes> = {
    id: {
        type: sequelize.UUID,
        primaryKey: true,
        defaultValue: sequelize.UUIDV4
    },
    userId: {
        type: sequelize.UUID,
        references: {
            model: User,
            key: 'id',
        }
    },
    symbol: {
        type: sequelize.STRING
    },
    count: {
        type: sequelize.INTEGER
    }
};
const Stock = db.define<StockInstance, StockAttributes>('stock', attributes as any);

export default Stock;