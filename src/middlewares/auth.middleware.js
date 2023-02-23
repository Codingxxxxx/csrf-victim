/** @type {import('express').Handler} */
module.exports = async (req, res, next) => {
  try {

    const hasSession = req.session.user;

    if (!hasSession) return res.redirect('/login');

    next();
  } catch (error) {
    next(error);
  }
}