# Application d’Anonymisation de Documents

Ce projet permet de :

- S’inscrire et se connecter (authentification sécurisée JWT)
- Uploader un document texte (PDF ou Word)
- Anonymiser le contenu via l’API OpenAI
- Afficher et télécharger le résultat au format d’origine
- Consulter un historique personnel des documents traités

---
# Architecture et Patterns du Projet

Le projet est organisé selon une architecture logicielle en couches (Layered Architecture), qui découple bien les responsabilités côté backend et côté frontend, et applique plusieurs patterns architecturaux courants pour la robustesse, la maintenabilité et la testabilité.

## 🏗️ Côté Backend

1. Couche Routes (Routing Layer)
Dossier : src/routes/

Responsabilité : définir les endpoints HTTP et brancher les middlewares (authentification, validation, upload Multer).

Pattern : Front Controller (un routeur unique /api/... délègue vers les controllers).

2. Couche Controllers (Controller Layer)
Dossier : src/controllers/

Responsabilité : recevoir les requêtes validées, orchestrer l’appel aux services, formater la réponse.

Pattern : MVC Controller — chaque controller (auth.controller.js, doc.controller.js) implémente la logique métier d’un domaine.

3. Couche Services (Service Layer)
Dossier : src/services/

extract.service.js (texte brut)

openai.service.js (anonymisation via OpenAI API)

generate.service.js (création PDF/DOCX)



Responsabilité : encapsuler la logique technique/réutilisable (Appels externes, traitement de fichiers, génération de documents).

Pattern :

Facade pour exposer une API simple aux controllers.

Strategy implicite pour la génération (choisir PDF vs DOCX selon l’extension).

4. Couche Middlewares
Dossier : src/middlewares/

auth.middleware.js (vérification JWT )

validate.middleware.js (express-validator)

upload.middleware.js (Multer config)

Responsabilité : intercepter les requêtes pour appliquer authentification, autorisation, validation ou parsing avant les controllers.

Pattern : Chain of Responsibility — chaque middleware enchaîne son traitement puis appelle next().

5. Couche Accès aux Données
Technologie : Prisma Client

Dossier : prisma/schema.prisma + prisma/seed.js

Responsabilité : mapping objet-javascript, transactions et requêtes CRUD sur SQLite.

Pattern : Repository / Data Mapper — Prisma Client isole ton code de la base, tu manipules des objets JavaScript.

6. Configuration & Bootstrap
Fichier : src/server.js

Responsabilité : charger dotenv, initialiser Express, brancher cors, cookie-parser, routes, lancer l’écoute.

Pattern : Bootstrapper / Composition Root — point d’entrée qui assemble tous les composants.

## 🖥️ Côté Frontend

1. Structure Par Pages & Composants
Dossier : src/pages/ (composants routés : Login.jsx, Register.jsx, Dashboard.jsx, History.jsx, Settings.jsx, etc.)

Dossier : src/components/ (unitaires : Navbar.jsx, HistoryItem.jsx, etc.)

Responsabilité :

Pages orchestrent la logique de chargement de données & affichage.

Components fournissent des briques réutilisables d’UI.

2. Services API
Dossier : src/services/auth.service.js, doc.service.js, ai.service.js

Responsabilité : isoler tous les appels HTTP (axios) vers le backend, centraliser les URLs et la gestion des tokens.

Pattern : Module / Facade — façade unique par domaine pour l’accès réseau.

3. Contexte d’Authentification
Fichier : src/context/AuthContext.jsx

Responsabilité : stocker l’état global de l’utilisateur (user, signIn, signOut), accessible via useAuth().

Pattern : Context / Provider (inspiration Flux) — gestion centralisée de l’état utilisateur.

4. Routing & Protection de Routes
Technologie : React Router v7

Component : PrivateRoute

Responsabilité : interdire l’accès aux pages sans authentification, rediriger vers /login.

Pattern : Higher-Order Component (HOC) ou wrapper — encapsule la logique d’autorisation.

5. Gestion du State Local & Effets
Hooks React : useState, useEffect

Responsabilité : chargement des données, réactions aux événements (drag-n-drop), rafraîchissement automatique après actions (refresh()).

Pattern : Custom Hook implicite (on pourrait extraire useFetchDocs() pour plus de réutilisation).

## 🎯 Patterns Architecturaux Globaux

Layered Architecture

Séparation nette : Présentation (frontend) ↔ Application (controllers/services) ↔ Données (Prisma).

Separation of Concerns

Chaque dossier/module a une seule responsabilité déclarée.

Dependency Injection (implicite)

Les modules ne font pas new PrismaClient() à plusieurs endroits, on importe une instance partagée.

Facade / Module Pattern

Pour les services externes (OpenAI ...), on expose une interface simple.

Chain of Responsibility

Middlewares Express pour la validation/auth avant d’atteindre les controllers.

Context API (Flux-like)

Pour l’authentification côté React, on utilise un provider global.

Cette architecture modulaire et ces patterns garantissent une application :

Testable : chaque controller/service peut être mocké et testé isolément.

Extensible : on peut ajouter de nouveaux services (ex. stockage S3, nouvelle API IA) sans tout casser.

Maintenable : la structure claire guide tout nouveau contributeur vers la bonne couche.



# 🚀 Lancer l’application sans Docker

## 🚀 Prérequis

- Node.js >= 18.x (utilisation recommandée de nvm pour gérer la version)
- npm ou yarn
- Git
- SQLite installé pour inspecter la base




## ⚙️ Installation et exécution

### 1. Cloner le dépôt

```bash
git clone https://github.com/CEHLAB/AnonyDoc.git
cd AnonyDoc
```

### 2. Configuration Backend

1. Se positionner dans le dossier et **Créer** le fichiers env :


2. **Définir** dans `backend/.env` les attributs suivants (sans fournir les valeurs ici) :
   - `DATABASE_URL`
   - `PORT`
   - `FRONTEND_URL`
   - `OPENAI_API_KEY`


3. **Installer** les dépendances :
   ```bash
   npm install
   ```

4. **Générer** le client Prisma et initialiser la BD (création de `dev.db` si nécessaire) :
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **(Optionnel)** Peupler la base avec des données de test :
   ```bash
   npm run seed
   ```

6. **Lancer** le serveur en mode développement :
   ```bash
   npm run dev
   ```

Le backend sera disponible sur `http://localhost:PORT`

### 3. Configuration Frontend

Se positionner dans le dossier et **Créer** le fichiers env 
//contenu .env
VITE_API_URL=http://localhost:PORT_SERVER/api


npm install                   # installe les dépendances
npm run dev                   # démarre Vite (http://localhost:5173)
```

- Le frontend est disponible sur `http://localhost:5173`

---

## ✅ Fonctionnalités principales

1\. **Authentification**  
   - Inscription / Login  
   - JWT + cookie HttpOnly + `requireAuth` middleware  
   - Déconnexion via menu “Mon compte”  

2\. **Upload & Anonymisation**  
   - Zone Drag’n’Drop + click pour PDF/.docx  
   - Extraction texte (`pdf-parse`, `mammoth`)  
   - Appel OpenAI pour anonymisation  
   - Génération `.pdf` ou `.docx` anonymisé  
   - Téléchargement du fichier anonymisé  

3\. **Historique**  
   - Liste des documents de l’utilisateur  
   - Extraits avant/après + lien “Voir détail”  
   - Suppression du fichier original et/ou de la ligne  

4\. **Paramètres avancées**  
   - Page dédiée (mise à jour email/mdp ...)  

5\. **Prisma Studio**  
   - Accessible sur `http://localhost:5555`   

---

# 🚀 Lancer l’application avec Docker

Cette application est prête à être exécutée en conteneurs Docker pour simplifier le déploiement et garantir la cohérence des environnements.

---

## Prérequis

- **Docker Engine** (v20+)
- **Docker Compose** (v1.29+ ou v2 intégrée)

Installez Docker Desktop sur Windows ou macOS, ou Docker CE sur Linux.

---

## Étapes d’exécution

1. **Cloner le dépôt**
   ```bash
   https://github.com/CEHLAB/AnonyDoc.git
   cd AnonyDoc
   ```

2. **Configurer les variables d’environnement**

   - Copier les exemples d’env :
     ```bash
     cp backend/.env.example backend/.env
     cp frontend/.env.example frontend/.env
     ```
   - **backend/.env** : définir les clés suivantes (nom de variable seulement)
     - `DATABASE_URL`
     - `PORT`
     - `FRONTEND_URL`
     - `OPENAI_API_KEY`
   - **frontend/.env** : définir
     - `VITE_API_URL` (ex. `http://localhost:PORT_SERVER/api`)

3. **Démarrer les conteneurs**
   ```bash
   docker-compose up --build
   ```



## Persistance des données

- Le **fichier SQLite** (`backend/prisma/dev.db`) et le **dossier uploads** (`backend/uploads`) sont montés en volumes Docker, garantissant la conservation des fichiers et de la base entre les redémarrages.

---





