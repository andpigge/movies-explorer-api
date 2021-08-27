// Модель
const Movie = require('../models/movie');

// Ошибки
const NotFoundError = require('../errorsHandler/NotFoundError');
const BadRequest = require('../errorsHandler/BadRequest');
const Forbidden = require('../errorsHandler/Forbidden');

const createMovie = (req, res, next) => {
  const body = { ...req.body };

  // const id = req.user._id;
  const id = '6127739df86eb7311813699e';

  Movie.create({ ...body, owner: id })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
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
}

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  // const id = req.user._id;
  const id = '6127739df86eb7311813699e';

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Фильм не существует, либо был удален'));
      }

      // Если это карточка пользователя, удалим ее
      if (movie.owner.toString() === id) {
        Movie.findByIdAndRemove(movieId)
          .then((movieRemove) => res.send(movieRemove))
          .catch((err) => {
            if (err.name === 'CastError') {
              return next(new BadRequest('Фильм с указанным _id не найден'));
            }
            return next(err.message);
          });
      } else {
        // Если это карточка не пользователя, выведем ему сообщение
        next(new Forbidden('Нельзя удалить сохраненный фильм другого пользователя'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Фильм с указанным _id не найден'));
      }
      return next(err.message)
    });
};

module.exports = {
  createMovie,
  getMovie,
  deleteMovie,
};
