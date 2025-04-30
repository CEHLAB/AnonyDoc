import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/token.js';

const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const hash = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: { email, password: hash, firstName, lastName }
    });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (e) {
    res.status(400).json({ error: 'Email déjà utilisé' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: 'Bad credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: 'Bad credentials' });

  const token = generateToken({ id: user.id, email: user.email });
  res
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 2 // 2 h
    })
    .json({ message: 'Logged in' });
};

export const logout = (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out' });
};

export const me = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, firstName: true, lastName: true }
  });
  res.json(user);
};

export const updateEmail = async (req, res) => {
  const { currentPassword, newEmail } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.sendStatus(404);

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });

  await prisma.user.update({
    where: { id: user.id },
    data: { email: newEmail }
  });
  res.json({ message: 'Email mis à jour' });
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.sendStatus(404);

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });

  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hash }
  });
  res.json({ message: 'Mot de passe mis à jour' });
};


export const deleteAccount = async (req, res) => {
  const { currentPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.sendStatus(404);

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });

  await prisma.user.delete({ where: { id: user.id } });
  res.json({ message: 'Compte supprimé' });
};