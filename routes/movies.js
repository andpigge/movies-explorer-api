// Подключаю специальный метод Router для работы с маршрутами
const router = require('express').Router();

// Контроллеры
const { celebrate, Joi } = require('celebrate');
const {
  createMovie,
  getMovie,
  deleteMovie,
} = require('../controllers/movies');

// Валидация тела запроса от клиента

// Подключаю свою функцию валидации url адресса для celebrate
const validUrl = require('../utils/validUrl');

router.get('/', getMovie);
router.post('/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().custom(validUrl),
      trailer: Joi.string().required().custom(validUrl),
      thumbnail: Joi.string().required().custom(validUrl),
      movieId: Joi.string().hex().length(24),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie);
router.delete(
  '/:movieId',
  celebrate({
    body: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  deleteMovie,
);

module.exports = router;
