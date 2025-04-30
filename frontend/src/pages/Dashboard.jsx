import { useState } from "react";
import { uploadDoc, downloadUrl } from "../services/doc.service";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [resu, setResu] = useState(null);
  const [loading, setLoad] = useState(false);
  const [dragOver, setDragOver] = useState(false);

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

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && /\.(pdf|docx)$/i.test(dropped.name)) {
      setFile(dropped);
    } else {
      alert("Seuls les fichiers PDF ou DOCX sont acceptés");
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-light mb-6 text-center">
        Bonjour {user?.firstName}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-8 space-y-6"
      >
        <label
          htmlFor="file-upload"
          className={`
            flex flex-col items-center justify-center
            border-2 border-dashed rounded-lg h-40 cursor-pointer
            transition-colors
            ${dragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
            }
          `}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v6m0 0l-3-3m3 3l3-3M16 12l-4-4m-4 4l4-4"
            />
          </svg>
          <span className="text-gray-500">
            {file ? file.name : "Cliquez ou déposez un PDF/DOCX ici"}
          </span>
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Traitement…" : "Uploader & anonymiser"}
        </button>
      </form>

      {resu && (
        <div className="mt-8 space-y-6">
          <p className="text-center text-sm text-gray-500">
            Fichier : <strong>{resu.filename}</strong>
          </p>

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
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Télécharger le fichier anonymisé
          </a>
        </div>
      )}
    </div>
  );
}
