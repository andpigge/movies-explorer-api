// const allowedCors = [
//   'http://movies-diploma-api.nomoredomains.monster',
//   'https://movies-diploma-api.nomoredomains.monster',
// ];

// Обработка CORS
module.exports = (req, res, next) => {
  // const { origin } = req.headers;
  // const { method } = req;
  // const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS';
  // const requestHeaders = req.headers['access-control-request-headers'];

  // res.header('Access-Control-Allow-Origin', origin);
  // if (allowedCors.includes(origin)) {
  //   res.header('Access-Control-Allow-Origin', origin);
  // }

  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Accept,Authorization,Origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', true);

  // if (method === 'OPTIONS') {
  //   res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  //   res.header('Access-Control-Allow-Headers', requestHeaders);
  //   return res.end();
  // }
  return next();
};
