/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import expressSession, { SessionOptions } from 'express-session';
import * as path from 'path';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import passport from './configs/passport';
import { authRoutes, ordersRoutes, productsRoutes } from './routes/routes';

dotenv.config(); // TODO CHECK hogy szükséges-e?

const app = express();

// Middleware-ek
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const sessionOptions: SessionOptions = {
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
};

app.use(expressSession(sessionOptions) as any);
app.use(passport.initialize() as any);
app.use(passport.session());

const port = process.env.PORT || 3333;

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/api/auth/', authRoutes(express.Router()));
app.use('/api/products/', productsRoutes(express.Router()));
app.use('/api/orders/', ordersRoutes(express.Router()));

app.get("/", (_req, res) => {
  res.send("API is running 🚀");
});

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
