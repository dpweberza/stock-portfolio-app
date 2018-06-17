import * as bcrypt from 'bcrypt';
import * as sequelize from 'sequelize';
import db from '../db';

const User = db.define('user', {
    firstName: {
        type: sequelize.STRING
    },
    lastName: {
        type: sequelize.STRING
    },
    password: {
        type: sequelize.STRING
    }
});

User.sync().then(() => {
    // Table created
    User.create({
        firstName: 'John',
        lastName: 'Doe',
        password: bcrypt.hashSync('secret1', 10),
    });
    User.create({
        firstName: 'Jane',
        lastName: 'Doe',
        password: bcrypt.hashSync('secret2', 10),
    });
});

export default User;