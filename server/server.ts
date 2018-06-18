import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';

import * as path from 'path';
import {comparePassword} from './auth/hash';
import strategy, {jwtOptions, JwtPayload} from './auth/strategy';
import seed from './models/seed';
import Stock from './models/stock';
import User from './models/user';


//
// Configure passport auth
//
passport.use(strategy);

//
// Configure express
//
const app = express();
app.use(passport.initialize());
app.use(bodyParser.json());
app.set('port', process.env.PORT || 8000);

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../build')));
}

//
// Routes
//
app.all('/', (req, res, next) => {
    res.send('Hello Server!');
});

app.post('/login', (async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({where: {username}});
    if (user && await comparePassword(password, user.password)) {
        const payload: JwtPayload = {userId: user.id!};
        const token = jwt.sign(payload, jwtOptions.secretOrKey as string);
        res.json({token, user: {firstName: user.firstName, lastName: user.lastName, id: user.id, balance: user.balance}});
    } else {
        res.sendStatus(401);
    }
}));

app.get('/stocks', passport.authenticate('jwt', {session: false}), (async (req, res) => {
    const user = req.user!;
    const stocks = await Stock.findAll({where: {userId: user.id}});
    res.json({
        stocks: stocks.map((stock) => ({
            symbol: stock.symbol,
            count: stock.count
        }))
    });
}));

app.post('/stocks', passport.authenticate('jwt', {session: false}), (async (req, res) => {
    const user = req.user!;
    const {count, symbol, price} = req.body;
    if (!symbol || !price) {
        res.sendStatus(400);
    } else {
        const updatedUser = await User.findById(user.id);
        if (!updatedUser) {
            res.sendStatus(404);
        } else {
            const totalPurchase = price * count;
            if (totalPurchase > 0 && updatedUser.balance < totalPurchase) {
                res.sendStatus(400);
            } else {
                // Update or create the stock holding
                let stock = await Stock.find({where: {userId: user.id, symbol}});
                if (!stock) {
                    stock = await Stock.create({userId: user.id, symbol, count});
                } else {
                    stock.count += count;
                    await stock.save();
                }

                // Update the user's cash balance
                if (updatedUser) {
                    updatedUser.balance -= totalPurchase;
                    await updatedUser.save();
                }

                res.json({balance: updatedUser.balance});
            }
        }
    }
}));

app.get('/balance', passport.authenticate('jwt', {session: false}), (async (req, res) => {
    const user = req.user!;
    const updatedUser = await User.findById(user.id);
    if (updatedUser) {
        res.json({
            balance: updatedUser.balance,
        });
    } else {
        res.sendStatus(404);
    }
}));

app.post('/balance', passport.authenticate('jwt', {session: false}), (async (req, res) => {
    const user = req.user!;
    const {amount} = req.body;
    const updatedUser = await User.findById(user.id);
    if (updatedUser) {
        updatedUser.balance += amount;
        await updatedUser.save();
        res.json({
            balance: updatedUser.balance,
        });
    } else {
        res.sendStatus(404);
    }
}));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname + '/../build/index.html'));
    });
}

//
// Seed the db
//
seed();

//
// Start the server
//
const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log('express listening on port ' + app.get('port') + ', env: ' + process.env.NODE_ENV)
});