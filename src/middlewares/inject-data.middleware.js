module.exports = async (req, res, next) => {
  try {
    res.locals.global = {
      env: process.env.NODE_ENV,
      isCSRFEnabled: process.env.csrf === 'true',
      csrf: req.session.csrf || ''
    }

    next();
  } catch (error) {
    next(error);
  }
}