import express from 'express';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import postRoutes from './routes/post.js';
import userRoutes from './routes/user.routes.js';
import AuthRouter from './routes/Auth.routes.js';
import AdminRouter from './routes/Admin.routes.js';
import ApiRouter from './routes/Api.routes.js';
import expressEjsLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import _ from 'lodash';

// to use import instead of require : Change "type": "module" in package-lock.json

// Application Set up

const App = express();
dotenv.config();

// Session
App.use(cookieParser());
App.use(session({
  secret: "Shh, its a secret!",
	resave: true,
	saveUninitialized: true
}));

App.use(fileUpload({
  createParentPath: true
}));

// BodyParser 
App.use(bodyParser.json({ limit: "30mb", extended: true }));
App.use(bodyParser.urlencoded({ limit: "30mb", extended:true }));
App.use(morgan('dev'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
App.use('/',AuthRouter);

//For set layouts of html view

App.set('views', path.join(__dirname, 'views'));
App.set('view engine', 'ejs');
App.use(expressEjsLayouts);



App.use('/public', express.static('public'));
App.get('/layouts/', function(req, res) {
    res.render('view');
  });

  App.use('/',AdminRouter);
// Cors 
App.use(cors());

// Set Routes

App.use('/users',userRoutes);
App.use('/posts',postRoutes);
App.use('/api',ApiRouter);

// Db Connection
const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL,{ useNewUrlParser: true })
.then(()=> App.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
.catch((error)=>console.log(error.message));
// Trent jeo account
// mongoose.set('useFindAndModify', false);
