import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import User from "./models/user";

//
// Configure express
//
const app = express();
app.set("port", process.env.PORT || 8000);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '..', 'build', 'static')));
}

//
// Routes
//
app.all('/', (req, res, next) => {
    res.send('Hello Server!');
});

app.post('/login', (async (req, res) => {
    const user = await User.findOne({where: {firstName: 'John'}}) as any;
    res.send(user.lastName);
}));

//
// Start the server
//
const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log('express listening on port ' + app.get('port'))
});