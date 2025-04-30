import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, getMe } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import { EMAIL_REGEX } from '../utils/validation';

export default function Login() {
  const nav = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerError('');
  };

  const validate = () => {
    const err = {};
    if (!EMAIL_REGEX.test(form.email)) {
      err.email = 'Email invalide';
    }
    if (!form.password.trim()) {
      err.password = 'Mot de passe requis';
    }
    return err;
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError('');
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    try {
      await login(form);
      const { data } = await getMe();
      setUser(data);
      nav('/dashboard');
    } catch (e) {
      const resp = e.response?.data;
      if (resp?.errors) {
        setErrors(resp.errors);
      } else {
        setServerError('Email ou mot de passe incorrect');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Connexion</h2>

        <form onSubmit={submit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mot de passe
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Erreur d'authentification */}
          {serverError && (
            <p className="text-red-600 text-center text-sm">{serverError}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          T’as pas de compte ?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
