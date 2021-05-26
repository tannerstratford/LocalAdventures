const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');


const MongoDBURI = 'mongodb+srv://tannerstratford:FTC2A30MkMz2Ar0O@cluster0.4lvcu.mongodb.net/shop?retryWrites=true&w=majority'

const app = express();
const store = new MongoDBStore({
  uri: MongoDBURI,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false, store: store}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
     req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

const corsOptions = {
  origin: "https://<your_app_name>.herokuapp.com/",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://tannerstratford:FTC2A30MkMz2Ar0O@cluster0.4lvcu.mongodb.net/shop?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URL, options)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          username: 'tannerstratford',
          email: 'tannerstratford1@gmail.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    })

    app.listen(PORT);
  }).catch(err => {
    console.log(err);
  });



