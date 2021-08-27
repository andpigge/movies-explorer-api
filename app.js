const mongoose = require('mongoose');
const express = require('express');

const app = express();

// dotenv позволяет писать конструкции
require('dotenv').config();

// Обработка ошибок в routes
const { errors } = require('celebrate');

//* Защита приложения
// Защита заголовков
const helmet = require('helmet');

app.use(helmet());

// Зашитится от автоматических входов
const limiter = require('./utils/limiter');
//*

// Логи ошибок, запись ошибок в файл
const { requestLogger, errorLoger } = require('./middlewares/logger');

// Мидлвэа, центральный обработчик ошибок
const errHandler = require('./middlewares/errHandler');

// Мидлвэа, обработчика CORS
// const handlerCors = require('./middlewares/handlerCors');

// app.use(handlerCors);

// routes
const routerApp = require('./routes/index');

const { PORT = 3000 } = process.env;

// Подключение к БД
// options отвечают за обновление mongoose
mongoose.connect('mongodb://localhost:27017/moviesdb', {
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

app.use(limiter);

// routes
app.use(routerApp);

// Логгер ошибок. Подключаю после всех маршрутов, но до обработки ошибок
app.use(errorLoger);

// Обработка ошибок celebrate
app.use(errors());

// Подключаю ко всем маршрутам, центральный обработчик ошибок. В конце файла
app.use(errHandler);

app.listen(PORT);
