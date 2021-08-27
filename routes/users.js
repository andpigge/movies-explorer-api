// Подключаю специальный метод Router для работы с маршрутами
const router = require('express').Router();

// Контроллеры
const { celebrate, Joi } = require('celebrate');
const { getProfile, updateProfile } = require('../controllers/users');

// Валидация тела запроса от клиента

router.get('/me', getProfile);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateProfile,
);

module.exports = router;
