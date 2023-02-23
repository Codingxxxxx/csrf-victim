const router = require('express').Router();
const UserService = require('./../services/user.service');
const checkAuth = require('./../middlewares/auth.middleware');
const AuthService = require('./../services/auth.service');

router.get('/register', async (req, res, next) => {
  try {
    res.render('pages/registration.html');
  } catch (error) {
    next(error);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UserService.createUser({
      username,
      password: AuthService.hashPassword(password)
    });

    req.session.user = {
      id: user._id,
      username: user.username,
      balance: user.balance
    }

    res.redirect('/dashboard');
  } catch (error) {
    next(error);
  }
});

router.get('/dashboard', checkAuth, async (req, res, next) => {
  try {
    res.render('pages/dashboard.html', {
      page: {
        username: req.session.user.username,
        balance: req.session.user.balance
      }
    })
  } catch (error) {
    next(error);
  }
});

router.get('/login', async (req, res, next) => {
  try {
    if (req.session.user) return res.redirect('/dashboard');
    res.render('pages/login.html');
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {

    const { username, password } = req.body;

    const hashedPassword = AuthService.hashPassword(password); 

    const user = await UserService.getUserByUsernameAndPassword(username, hashedPassword);

    if (!user) return res.render('pages/login.html', {
      page: {
        error: 'USER_NOT_FOUND',
        data: {
          username
        }
      }
    });

    req.session.user = {
      id: user._id,
      username: user.username,
      balance: user.balance
    };

    res.redirect('/dashboard');
  } catch (error) {
    next(error);
  }
})

router.get('/logout', async (req ,res, next) => {
  try {
    req.session.destroy(() => {
      res.redirect('/login');
    })
  } catch (error) {
    next(error);
  }
});

router.post('/acc/delete', checkAuth, async (req, res, next) => {
  try {
    await UserService.deleteUser(req.session.user.id)

    // destroy session
    req.session.destroy(() => {
      res.redirect('/login');
    });
  } catch (error) {
    next(error);
  }
});

router.post('/acc/balance/transfer', async (req, res, next) => {
  try {
    const { receiver, balance } = req.body;
    const currentUser = await UserService.getUserByUsername(req.session.user.username);
    const receiverUser = await UserService.getUserByUsername(receiver);

    const remainingBalance = currentUser.balance - Number(balance);
    const updatedReceiverBalance = Number(balance) + receiverUser.balance;

    // update sender money
    await UserService.updateUserBalance(req.session.user.username, remainingBalance); 

    // update user balance in session
    req.session.user.balance = remainingBalance;

    // update receiver money
    await UserService.updateUserBalance(receiver, updatedReceiverBalance); 

    return res.redirect('/dashboard');
  } catch (error) {
    next(error);
  }
})

module.exports = router;