const mongoose = require('mongoose');
const express = require('express');
const app = express();

const { PORT = 3000 } = process.env;

// Подключение к БД
// options отвечают за обновление mongoose
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen( PORT );
