/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import dotenv from "dotenv";
import passport from './configs/passport';

dotenv.config(); // TODO CHECK hogy szükséges-e?

const app = express();

// Middleware-ek
app.use(express.json());
app.use(passport.initialize());

const port = process.env.PORT || 3333;

app.use('/assets', express.static(path.join(__dirname, 'assets')));

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
