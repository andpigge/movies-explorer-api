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

// Логи ошибок, запись ошибок в файл
const { requestLogger, errorLoger } = require('./middlewares/logger');

//* Защита приложения
  // Позволяет без капчи зашитится от автоматических входов
  const rateLimit = require('express-rate-limit');
//*

// Маршруты
const routerAuth = require('./routes/auth');
const routerUsers = require('./routes/users');
const routerMovies = require('./routes/movies');

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

// Логгер запросов подключаю до всех маршрутов.
// Подключается перед limiter, так как тот не записывает запросы в log, которые отклонил
app.use(requestLogger);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});
app.use(limiter);

// Маршруты
app.use('/', routerAuth);
app.use('/users', routerUsers);
app.use('/movies', routerMovies);
// Если нет корректного маршрута
app.use((req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

// Логгер ошибок. Подключаю после всех маршрутов, но до обработки ошибок
app.use(errorLoger);

// Обработка ошибок celebrate
app.use(errors());

// Подключаю ко всем маршрутам, центральный обработчик ошибок. В конце файла
app.use(errHandler);

app.listen( PORT );
