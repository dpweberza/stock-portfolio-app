import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';

import * as path from 'path';
import {comparePassword} from './auth/hash';
import strategy, {jwtOptions, JwtPayload} from './auth/strategy';
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
    app.use(express.static(path.join(__dirname, '..', 'build', 'static')));
}

//
// Routes
//
app.all('/', (req, res, next) => {
    res.send('Hello Server!');
});

app.post('/login', (async (req, res) => {
    const {username, password} = req.body;
    console.log(username, password);
    const user = await User.findOne({where: {username}});
    if (user && await comparePassword(password, user.password)) {
        const payload: JwtPayload = {userId: user.id!};
        const token = jwt.sign(payload, jwtOptions.secretOrKey as string);
        res.json({token});
    } else {
        res.sendStatus(401);
    }
}));

//
// Start the server
//
const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log('express listening on port ' + app.get('port'))
});