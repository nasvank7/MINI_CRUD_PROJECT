var express = require('express');
var router = express.Router();
var session = require('express-session');
const adminHelper = require('../helpers/admin-helper');
const userHelper = require('../helpers/user-helper');
var a = 0, regEmail = false, regUsername = false;


// ADMIN DETAILS
function adminValidation(adminBody) {
  if (adminBody.Username === 'admin@gmail.com' && adminBody.Password === '1234') {
    return true;
  } else {
    return false;
  }
}

const isLoggedIn = (req, res, next) => {
  if (req.session.adminlog) {
    return next();
  }else{
  res.redirect('/admin/login')
  }
}


/////////////////////////////// GET ADMIN listing. //////////////////
router.get('/',isLoggedIn, async (req, res, next) => {
  
  let admin = adminLog = req.session.adminlog;

  if (admin) {
    res.render('admin/admin-index.hbs', { admin, adminLog })
  } else {
    res.redirect('/admin/login');
  }
});


//////////////////////////// LOGin //////////////////////////

router.get('/login', (req, res, next) => {
  var adminLog = req.session.adminlog;
  if (adminLog) {
    res.redirect('/admin');
  } else {
    res.render('admin/admin-login.hbs', { admin: true, adminLog, err: a });
    a = 0;
  }

});


router.post('/login', (req, res, next) => {
  req.session.adminlog = adminValidation(req.body);
  if (req.session.adminlog) {
    res.redirect('/admin');
  } else {
    a = 1;
    res.redirect('/admin/login')
  }
})

///////////////////////////////////// LOGOUT //////////////////////////////////

router.get('/logout', (req, res, next) => {
  req.session.adminlog = false;
  res.redirect('/admin');
})


/////////////////////////////////// USER MANAGEMENT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\

router.get('/users', async (req, res, next) => {
  try {
    // const user = await db.get().collection(collection.USER_COLLECTION).find({}).toArray()
    const user = await adminHelper.findUsers();
    // console.log(user);
    let adminLog = req.session.adminlog;
    if (adminLog) {
      res.render('admin/userManagement.hbs', { admin: true, userpage: true, adminLog, user });
    } else {
      res.redirect('/admin');
    }
  } catch (err) {
    console.log(err);
  }
})


///////////////////////////////// PRODUCTS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\

router.get('/products', (req, res, next) => {
  res.redirect('/admin');
})




///////////////////////////////////// EDIT USER //////////////////////////////////

router.get('/editUser/:id', async (req, res, next) => {
  try {
    let adminLog = req.session.adminlog;
    if (adminLog) {
      let id = req.params.id;
      const user = await adminHelper.getUserById(id);
      res.render('admin/user-edit.hbs', { admin: true, user, adminLog })
    } else {
      res.redirect('/admin');
    }
  } catch (error) {
    console.log(error);
  }
})



router.post('/edituser/:id', async (req, res, next) => {
  try {
    let id = req.params.id;
    let user = req.body;
    await adminHelper.updateUser(id, user);
    res.redirect('/admin/users');
  } catch (error) {
    console.log(error);
  }

})


////////////////////////////////// DELETE USER //////////////////////////////////

router.get('/deleteUser/:id', async (req, res, next) => {
  try {
    if (req.session.adminlog) {
      let id = req.params.id;
      await adminHelper.deleteUser(id);
      res.redirect('/admin/users');
    } else {
      res.redirect('/admin');
    }
  } catch (err){
    console.log(err);
  }
})


//////////////////////////////////////////// ADD USER //////////////////////////////////////////

router.get('/addUser', (req, res, next) => {
  let adminLog = req.session.adminlog;
  if (adminLog) {
    res.render('admin/newUser.hbs', { admin: true, adminLog });
  } else {
    res.redirect('/admin');
  }

  regEmail = false;
  regUsername = false;
})



router.post('/addUser', async (req, res, next) => {
  let user = req.body;
  regEmail = await userHelper.checkEmail(user.email);
  regUsername = await userHelper.checkUsername(user.username);
    if(regEmail){
      regEmail = false;
      res.render('./admin/newUser.hbs', {errE:'Email already in use', user, admin:true});
    } else if(regUsername){
      regUsername = false;
      res.render('./admin/newUser.hbs', {errU:'Username is not available', user, admin:true});
    } else {
      await userHelper.doSignup(user).then((response) => {
      res.redirect('/admin/users');
    })
  }
})


/////////////////////////////////////// SEARCH //////////////////////////////////

router.post('/search', async (req, res) => {
  let char = req.body.searchChar;
  let adminLog = req.session.adminlog;
  // console.log(char);
  // console.log(adminLog);
  if (adminLog) {
    let user = await adminHelper.searchUser(char);
    // console.log(user);
    res.render('admin/userManagement.hbs', { admin: true, userpage: true, adminLog, user });
  } else {
    res.redirect('/admin');
  }
})

router.get('/search', (req, res, next) => {
  res.redirect('/admin/users');
})



module.exports = router;
