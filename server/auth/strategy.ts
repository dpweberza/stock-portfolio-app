import {ExtractJwt, Strategy, StrategyOptions} from 'passport-jwt';
import User from '../models/user';

export interface JwtPayload {
    userId: string;
}

export const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: 'secret', // TODO config
};

const strategy = new Strategy(jwtOptions, async (payload: JwtPayload, next) => {
    const user = await User.findById(payload.userId);
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

export default strategy;