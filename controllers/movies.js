// Модель
const Movie = require('../models/movie');

// Ошибки
const NotFoundError = require('../errorsHandler/NotFoundError');
const BadRequest = require('../errorsHandler/BadRequest');
const Forbidden = require('../errorsHandler/Forbidden');

//* Сообщения ошибок
const { errorMessage } = require('../utils/constants');

const {
  movies: {
    invalidDataСreatingMovie,
    movieNotExists,
    movieByIdNotFound,
    movieAnotherUserNotDelete,
  },
} = errorMessage;
//*

const createMovie = (req, res, next) => {
  const body = { ...req.body };

  const id = req.user._id;
  // const id = '6128d0b6f36a6d63dc79070e';

  Movie.create({ ...body, owner: id })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(invalidDataСreatingMovie));
      }
      next(err.message);
    });
};

const getMovie = (req, res, next) => {
  // Вместо id вставляю модель users, с помощью метода populate, который принимает ссылку на модель
  Movie.find({})
    .populate('user')
    .then((movies) => res.send(movies))
    .catch((err) => next(err.message));
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  const id = req.user._id;
  // const id = '6128d0b6f36a6d63dc79070e';

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        // Круто. Спасибо. Оставлю на будущее return чтоб подсматреть
        return next(new NotFoundError(movieNotExists));
        // return;
      }

      // То что нужно. Спасибо
      return movie;
    })
    .then((movie) => {
      // Если это карточка пользователя, удалим ее
      if (movie.owner.toString() === id) {
        Movie.findByIdAndRemove(movieId)
          .then((movieRemove) => res.send(movieRemove));
      } else {
        // Если это карточка не пользователя, выведем ему сообщение
        next(new Forbidden(movieAnotherUserNotDelete));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest(movieByIdNotFound));
      }
      return next(err.message);
    });
};

module.exports = {
  createMovie,
  getMovie,
  deleteMovie,
};
