import { useState } from "react";
import { uploadDoc, downloadUrl } from "../services/doc.service";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [resu, setResu] = useState(null);
  const [loading, setLoad] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoad(true);
    setResu(null);
    try {
      const { data } = await uploadDoc(file);
      setResu(data);
    } catch {
      alert("Erreur de traitement");
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-light mb-6 text-center">
        Bonjour {user?.firstName}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-8 space-y-4"
      >
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm border rounded-lg"
          required
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Traitement…" : "Uploader & anonymiser"}
        </button>
      </form>

      {resu && (
        <div className="mt-6 space-y-6">
          <section>
            <h2 className="font-semibold mb-2">Texte original</h2>
            <pre className="bg-gray-100 p-4 rounded max-h-64 overflow-auto whitespace-pre-wrap">
              {resu.original}
            </pre>
          </section>

          <section>
            <h2 className="font-semibold mb-2 text-green-700">
              Texte anonymisé
            </h2>
            <pre className="bg-green-50 p-4 rounded max-h-64 overflow-auto whitespace-pre-wrap">
              {resu.anonymized}
            </pre>
          </section>

          <a
            href={downloadUrl(resu.id)}
            target="_blank"
            className="inline-block text-blue-600 underline"
          >
            Télécharger le fichier anonymisé
          </a>
        </div>
      )}
    </div>
  );
}
