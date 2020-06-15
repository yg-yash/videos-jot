const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
require('./db/mongoose');
const bodyParser = require('body-parser');
const method_override = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const IdeaRoute = require('./routes/ideas');
const UserRoute = require('./routes/user');
const passport = require('passport');
const app = express();
const keys = require('./config/keys/keys');

//flash middleware
app.use(flash());

//hanlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//bodyparser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//method override middleware
app.use(method_override('_method'));

//session middleware
app.use(
  session({
    secret: keys.SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//globals varibales
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//index route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title,
  });
});

//about route
app.get('/about', (req, res) => {
  res.render('about');
});

//routes
app.use('/ideas', IdeaRoute);
app.use('/users', UserRoute);

//passport config
require('./config/passport')(passport);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is up on ${PORT}`);
});
