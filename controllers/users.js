const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Нужен для создания токена

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;

// Ошибки
const BadRequest = require('../errorsHandler/BadRequest');
const Conflict = require('../errorsHandler/Conflict');
const NotFoundError = require('../errorsHandler/NotFoundError');

// * Аутентификация и авторизация
const createUser = (req, res, next) => {
  const body = { ...req.body };

  // Пароль хэшируется в момент сохранения в БД, в моделе, хуком.
  User.create(body)
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      }
      // err.name = MongoError и err.code = 11000
      if (err.name === 'MongoError') {
        return next(new Conflict('Пользователь с таким Email уже существует'));
      }
      return next(err.message);
    });
};

const logIn = (req, res, next) => {
  const { email, password } = req.body;

  // Применил собственный метод
  User.findUserByCredentials(email, password, next)
    .then((user) => {
      // jwt.sign - создать токен. Первый параметр id, для хэша, второй токен, третий время жизни
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      return res.send(token);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      }
      return next(err.message);
    });
};
// *

const getProfile = (req, res, next) => {
  const id = req.user._id;
  // const id = '6128d0b6f36a6d63dc79070e';

  User.findById(id)
    .then((user) => {
      if (user) {
        return res.send({
          email: user.email,
          name: user.name,
        });
      }
      return next(new NotFoundError('Пользователь не существует, либо был удален'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Пользователь не существует, либо был удален'));
      }
      return next(err.message);
    });
};

const updateProfile = (req, res, next) => {
  const id = req.user._id;
  // const id = '6128d0b6f36a6d63dc79070e';

  const { email, name } = req.body;

  User.findByIdAndUpdate(id, { email, name },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: false // если пользователь не найден, он будет создан
    })
    .then((user) => {
      res.send({
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequest('Запрашиваемый пользователь не найден'));
      }
      if (err.name === 'MongoError') {
        return next(new Conflict('Пользователь с таким Email уже существует'));
      }
      return next(err.message);
    });
};

module.exports = {
  createUser,
  logIn,
  getProfile,
  updateProfile,
};