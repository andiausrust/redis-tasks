const express = require('express');
const logger = require('morgan');
const redis = require('redis');
const bodyParser = require('body-parser');
const path = require('path');
const colors = require('colors');

const app = express();

// create client
const client = redis.createClient();
client.on('connect', () => {
    console.log('redis server connected'.red.inverse)
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const title = 'task list';

    client.lrange('tasks', 0, -1, (err, reply) => {
        res.render('index', {
            title,
            tasks: reply
        });
    });


});

app.listen(3000, () => console.log('server started on port 3000'));

module.exports = app;
