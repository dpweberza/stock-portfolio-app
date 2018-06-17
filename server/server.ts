import * as express from 'express';
import * as http from 'http';
import * as path from 'path';

const app = express();
app.set("port", process.env.PORT || 8000);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '..', 'build', 'static')));
}
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
//
app.all('/*', (req, res, next) => {
    res.send('Hello Server!');
});

const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log('express listening on port ' + app.get('port'))
});