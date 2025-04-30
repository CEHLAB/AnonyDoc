import { useState } from 'react';
import { updateEmail, updatePassword, deleteAccount } from '../services/auth.service';
import { EMAIL_REGEX, PASS_REGEX } from '../utils/validation';

export default function Settings() {
  const [step, setStep] = useState('email'); 
  const [current, setCurrent] = useState('');
  const [newVal, setNewVal] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const reset = () => { setCurrent(''); setNewVal(''); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');

    // Validation front
    if (!current) { setError('Entrez votre mot de passe'); return; }
    if (step === 'email' && !EMAIL_REGEX.test(newVal)) {
      setError('Email invalide'); return;
    }
    if (step === 'password' && !PASS_REGEX.test(newVal)) {
      setError('8+ chars, 1 maj, 1 chiffre, 1 spécial'); return;
    }

    try {
      if (step === 'email') {
        await updateEmail(current, newVal);
        setMessage('Email mis à jour');
      }
      if (step === 'password') {
        await updatePassword(current, newVal);
        setMessage('Mot de passe mis à jour');
      }
      if (step === 'delete') {
        await deleteAccount(current);
        // Optionnel : rediriger après suppression
        window.location.href = '/login';
        return;
      }
      reset();
    } catch (e) {
      const msg = e.response?.data?.error || 'Erreur';
      setError(msg);
    }
  };

  const label = {
    email: ['Nouvel email', 'Mettre à jour'],
    password: ['Nouveau mot de passe', 'Changer le mot de passe'],
    delete: ['Entrez votre mot de passe pour confirmer', 'Supprimer mon compte']
  }[step];

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Paramètres avancés</h1>

      <div className="flex gap-4 mb-6">
        {['email','password','delete'].map(s => (
          <button
            key={s}
            onClick={() => { setStep(s); reset(); setMessage(''); }}
            className={`px-3 py-1 rounded ${
              step === s ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            {s === 'email' && 'Changer email'}
            {s === 'password' && 'Changer mot de passe'}
            {s === 'delete' && 'Supprimer compte'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        {step !== 'delete' && (
          <div>
            <label className="block mb-1 font-medium">{label[0]}</label>
            <input
              type={step === 'email' ? 'email' : 'password'}
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">
            {step === 'delete' ? label[0] : 'Mot de passe actuel'}
          </label>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}

        <button
          type="submit"
          className={`w-full py-2 rounded ${
            step==='delete'
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {label[1]}
        </button>
      </form>
    </div>
  );
}
