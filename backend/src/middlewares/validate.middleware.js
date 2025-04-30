import { body, validationResult } from 'express-validator';

export const registerValidation = [
  body('email')
    .isEmail().withMessage('Email invalide'),
  body('password')
    .isLength({ min: 8 }).withMessage('Au moins 8 caractères')
    .matches(/[A-Z]/).withMessage('Doit contenir une majuscule')
    .matches(/\d/).withMessage('Doit contenir un chiffre')
    .matches(/[^A-Za-z0-9]/).withMessage('Doit contenir un caractère spécial'),
  body('firstName')
    .notEmpty().withMessage('Prénom requis'),
  body('lastName')
    .notEmpty().withMessage('Nom requis'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const extracted = {};
      errors.array().forEach(err => {
        if (!extracted[err.param]) extracted[err.param] = err.msg;
      });
      return res.status(400).json({ errors: extracted });
    }
    next();
  }
];

export const loginValidation = [
    body('email')
      .isEmail().withMessage('Email invalide'),
    body('password')
      .notEmpty().withMessage('Mot de passe requis'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const extracted = {};
        errors.array().forEach(err => {
          if (!extracted[err.param]) extracted[err.param] = err.msg;
        });
        return res.status(400).json({ errors: extracted });
      }
      next();
    }
  ];
