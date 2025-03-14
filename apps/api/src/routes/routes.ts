import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from "bcryptjs";

import { authenticateJWT } from '../middlewares/auth';
import prisma from '../client';
import { generateToken } from '../services/jwt';

export const configureRoutes = (router: Router): Router => {
  router.get('/api', (req, res) => {
    res.send({ message: 'Welcome to api!' });
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ token });
  });

  router.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'This is a protected route', user: 'req.user' });
  });

  return router;
};
