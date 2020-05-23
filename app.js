const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});


app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  autoIndex: true,
});

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use(requestLogger);
app.use(errors());

/*app.use((req, res) => {
  res.status(404).send({ message: 'Not found' });
});*/
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});
app.listen(3000);
