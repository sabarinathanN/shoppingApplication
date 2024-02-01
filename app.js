const path = require('path');
const {ObjectId} = require('mongodb')

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById(ObjectId('65a6e2da42da1fe371885135'))
    .then(user => {
      if (!user) {
        console.log('User not found.');
        req.user = null; // Set req.user to null if user is not found
      } else {
        const { name, email, cart, _id } = user;
        req.user = new User(name, email, cart, _id);
      }
      next();
    })
    .catch(err => {
      console.log('Error fetching user:', err);
      next(err);
    });
});



app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});
