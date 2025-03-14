import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { authenticateJWT } from '../middlewares/auth';
import prisma from '../client';
import passport from '../configs/passport';

export const configureRoutes = (router: Router): Router => {
  router.get('/api', (req: Request, res) => {
    res.send({ message: 'Welcome to api!' });
  });

  router.get('/protected', authenticateJWT, (req: Request, res) => {
    res.json({ message: 'This is a protected route', user: 'req.user' });
  });

  router.post('/register', async (req: Request, res) => {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, name, role: 'USER' },
    });

    res.status(201).json({ message: 'User registered successfully' });
  });

  router.post('/login', passport.authenticate('local'), (req: Request, res) => {
    res.json({ message: 'Logged in successfully', user: req.user });
  });

  // 🔹 3. JWT token generálása
  router.post('/login-jwt', async (req: Request, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.json({ token });
  });

  router.post('/logout', (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      req.logout((error) => {
        if (error) {
          console.log(error);
          res.status(500).send('Internal server error.');
        }
        res.status(200).send('Successfully logged out.');
      });
    } else {
      res.status(500).send('User is not logged in.');
    }
  });

  return router;
};
