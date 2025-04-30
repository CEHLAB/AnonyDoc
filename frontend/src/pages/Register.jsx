import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth.service';
import { EMAIL_REGEX, PASS_REGEX } from '../utils/validation';

export default function Register() {
  const nav = useNavigate();
  const [form, setForm]       = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors]   = useState({});

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (!form.firstName.trim()) err.firstName = 'Prénom requis';
    if (!form.lastName.trim())  err.lastName  = 'Nom requis';
    if (!EMAIL_REGEX.test(form.email))
      err.email = 'Email invalide (ex : a@b.com)';
    if (!PASS_REGEX.test(form.password))
      err.password =
        '8 + caract., 1 majuscule, 1 chiffre, 1 caractère spécial';
    return err;
  };

  const submit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    try {
      await register(form);
      nav('/login');
    } catch (e) {
      // gérer erreur 400 du backend si besoin
      const data = e.response?.data?.errors;
      if (data) setErrors(data);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Inscription</h2>

        <form onSubmit={submit} className="space-y-4">
          {/* Prénom */}
          <div>
            <label className="block mb-1">Prénom</label>
            <input
              name="firstName"
              className="w-full border rounded px-3 py-2"
              value={form.firstName}
              onChange={onChange}
            />
            {errors.firstName && (
              <p className="text-red-600 text-sm">{errors.firstName}</p>
            )}
          </div>

          {/* Nom */}
          <div>
            <label className="block mb-1">Nom</label>
            <input
              name="lastName"
              className="w-full border rounded px-3 py-2"
              value={form.lastName}
              onChange={onChange}
            />
            {errors.lastName && (
              <p className="text-red-600 text-sm">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1">Email</label>
            <input
              name="email"
              type="email"
              className="w-full border rounded px-3 py-2"
              value={form.email}
              onChange={onChange}
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block mb-1">Mot de passe</label>
            <input
              name="password"
              type="password"
              className="w-full border rounded px-3 py-2"
              value={form.password}
              onChange={onChange}
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password}</p>
            )}
          </div>

          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
            S’inscrire
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
