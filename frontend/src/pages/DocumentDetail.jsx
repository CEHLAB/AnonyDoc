import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoc, downloadUrl } from "../services/doc.service";

export default function DocumentDetail() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    getDoc(id).then(({ data }) => setDoc(data));
  }, [id]);

  if (!doc) return <p className="p-8">Chargement…</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <h1 className="text-xl font-semibold">{doc.originalname}</h1>

      <section>
        <h3 className="font-semibold mb-2">Texte original</h3>
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap max-h-96 overflow-auto">
          {doc.original}
        </pre>
      </section>

      <section>
        <h3 className="font-semibold mb-2 text-green-700">Texte anonymisé</h3>
        <pre className="bg-green-50 p-4 rounded whitespace-pre-wrap max-h-96 overflow-auto">
          {doc.anonymized}
        </pre>
      </section>

      <a
        href={downloadUrl(doc.id)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-6-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Télécharger le fichier anonymisé
      </a>
    </div>
  );
}
