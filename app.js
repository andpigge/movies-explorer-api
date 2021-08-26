const mongoose = require('mongoose');
const express = require('express');
const app = express();

// dotenv позволяет писать конструкции
require('dotenv').config();

// Мидлвэа, центральный обработчик ошибок
const errHandler = require('./middlewares/errHandler');

// Ошибки
const NotFoundError = require('./errorsHandler/NotFoundError');

// Обработка ошибок в routes
const { errors } = require('celebrate');

// Маршруты
const routerAuth = require('./routes/auth');
const routerUsers = require('./routes/users');

const { PORT = 3000 } = process.env;

// Подключение к БД
// options отвечают за обновление mongoose
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Подключение встроенного парсера в express, чтобы вытаскивать из тела данные
app.use(express.json());

// Маршруты
app.use('/', routerAuth);
app.use('/users', routerUsers);
// Если нет корректного маршрута
app.use((req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

// Обработка ошибок celebrate
app.use(errors());

// Подключаю ко всем маршрутам, центральный обработчик ошибок. В конце файла
app.use(errHandler);

app.listen( PORT );
