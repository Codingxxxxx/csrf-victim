const CSRFService = require('./../services/csrf.service');

/**
 * Check csrf token every request except GET method
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = async (req, res, next) => {
  try {
    // check csrf token in session store, if not created, create a new one.
    
    if (!req.session.csrf) {
      const csrfToken = CSRFService.generateCSRF();
      req.session.csrf = csrfToken;
    }

    if (req.method.toLowerCase() === 'post') {

      if (req.session.csrf !== req.body.csrf) return res.status(403).send('Hey, Stranger Invalid CSRF Token');
    }

    next();
  } catch (error) {
    next(error);
  }
}