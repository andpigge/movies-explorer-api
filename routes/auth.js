// Подключаю специальный метод Router для работы с маршрутами
const router = require('express').Router();

// Валидация тела запроса от клиента
const { celebrate, Joi } = require('celebrate');

// Контроллеры
const {
  createUser, logIn,
} = require('../controllers/users');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  logIn,
);

module.exports = router;
