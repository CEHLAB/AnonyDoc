import { anonymizeText } from '../services/openai.service.js';

export const anonymize = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Texte manquant' });

  try {
    const clean = await anonymizeText(text);
    res.json({ anonymized: clean });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Échec anonymisation' });
  }
};
