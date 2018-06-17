import * as path from "path";
import * as sequelize from 'sequelize';

//
// Connect to the db
//
const db = new sequelize('stock-portfolio', 'app', 'secret', {
    dialect: 'sqlite',
    storage: path.resolve(__dirname, 'db.sqlite')
});
db
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

export default db;