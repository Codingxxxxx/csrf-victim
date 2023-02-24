require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const path = require('path');
const session = require('express-session');
const { default: mongoose } = require('mongoose');
const RedisStore = require('connect-redis')(session);
const currency = require('currency.js');

// redis@v4
const { createClient } = require("redis")
const redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error)


app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.query());
app.use(express.urlencoded({
  extended: true
}));
nunjucks.configure(path.join(__dirname, '../public'), {
  express: app,
  dev: process.env.NODE_ENV !== 'develoment',
  noCache: process.env.NODE_ENV === 'development'
})
.addFilter('currency', (money) => {
  return currency(money).format();
});

app.set('view engine', 'html');

app.use(session({
  saveUninitialized: false,
  secret: '12324',
  resave: false,
  store: new RedisStore({ client: redisClient })
}));

if (process.env.CSRF === 'true') app.use(require('./middlewares/csrf.middleware'));

app.use(require('./middlewares/inject-data.middleware'));
app.use(require('./routes'));

console.log('Connecting to database');
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    app.listen(3000, '127.0.0.1', () => {
      console.log('Server started');
    });
  });