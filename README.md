# 🍳 RecipeAI - Générateur de Recettes avec IA

> Application web moderne pour générer des recettes de cuisine personnalisées avec l'intelligence artificielle Gemini.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Database-green)
![Gemini](https://img.shields.io/badge/Gemini-2.0--flash-orange)

---

## 📖 Table des matières

1. [Pourquoi ce projet ?](#-pourquoi-ce-projet-)
2. [Ce que j'ai appris](#-ce-que-jai-appris)
3. [Architecture de l'application](#-architecture-de-lapplication)
4. [Stack technique détaillée](#-stack-technique-détaillée)
5. [Structure du projet](#-structure-du-projet)
6. [Fonctionnalités](#-fonctionnalités)
7. [Installation et configuration](#-installation-et-configuration)
8. [Concepts clés expliqués](#-concepts-clés-expliqués)
9. [Rappels pédagogiques](#-rappels-pédagogiques)
10. [Prochaines étapes](#-prochaines-étapes)

---

## 🎯 Pourquoi ce projet ?

J'ai créé RecipeAI pour :

- **Apprendre les fondamentaux** de React, TypeScript et Next.js en 30 minutes
- **Comprendre l'intégration d'IA** dans une application web moderne
- **Maîtriser l'authentification** et la gestion de base de données
- **Créer une application complète** de A à Z avec une vraie valeur ajoutée
- **Résoudre un problème réel** : générer des idées de recettes à partir d'ingrédients disponibles

C'était mon **premier projet** avec ces technologies, et j'ai choisi de construire quelque chose d'utile et visuellement attrayant plutôt qu'un simple tutoriel.

---

## 🧠 Ce que j'ai appris

### **React & Composants**

- ✅ Comment créer des **composants réutilisables** (Navbar)
- ✅ Gérer l'**état local** avec `useState`
- ✅ Exécuter du code au **chargement** avec `useEffect`
- ✅ Passer des **données entre composants** avec props
- ✅ Comprendre le **cycle de vie** d'un composant React

### **TypeScript**

- ✅ Typer mes variables et fonctions pour **éviter les bugs**
- ✅ Créer des **interfaces** et **types personnalisés**
- ✅ Utiliser les **génériques** (`useState<Type>`)
- ✅ Comprendre `!` (non-null assertion) et `?.` (optional chaining)

### **Next.js**

- ✅ Système de **routing basé sur les fichiers** (App Router)
- ✅ Différence entre **'use client'** et composants serveur
- ✅ Créer des **API routes** pour le backend
- ✅ Gérer la **navigation** avec `useRouter`
- ✅ Utiliser les **variables d'environnement**

### **Intégration IA**

- ✅ Utiliser le SDK officiel **Google Gemini**
- ✅ Implémenter le **Structured Output** (forcer un format JSON)
- ✅ Gérer les **appels asynchrones** avec async/await
- ✅ Parser et valider les **réponses JSON**

### **Authentification & Base de données**

- ✅ Mettre en place **Supabase Auth** (inscription, connexion, déconnexion)
- ✅ Sécuriser avec **Row Level Security (RLS)**
- ✅ Faire du **CRUD** (Create, Read, Delete)
- ✅ Gérer les **relations** entre tables (Foreign Keys)

### **UI/UX Moderne**

- ✅ Utiliser **shadcn/ui** pour des composants pré-stylés
- ✅ Styliser avec **Tailwind CSS** (classes utilitaires)
- ✅ Implémenter des **toast notifications** (Sonner)
- ✅ Créer une interface **responsive** (mobile + desktop)
- ✅ Remplacer les emojis par des **icônes professionnelles** (Lucide React)

---

## 🏗️ Architecture de l'application

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Page       │  │   Page       │  │   Page       │      │
│  │  Accueil     │  │  Mes         │  │  Paramètres  │      │
│  │              │  │  Recettes    │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                   ┌────────▼─────────┐                       │
│                   │   Navbar         │                       │
│                   │   (composant     │                       │
│                   │    partagé)      │                       │
│                   └──────────────────┘                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
┌────────────────┐ ┌──────────────┐ ┌──────────────┐
│   Supabase     │ │  API Route   │ │   Gemini     │
│   Auth + DB    │ │  /api/       │ │   AI API     │
│                │ │  generate    │ │              │
│  - Users       │ │              │ │  - Structured│
│  - Recipes     │ │  - Auth      │ │    Output    │
│  - Settings    │ │  - User API  │ │  - JSON      │
│  - RLS         │ │  - Gemini    │ │    Parsing   │
└────────────────┘ └──────────────┘ └──────────────┘
```

### **Flow de génération de recette :**

1. **Utilisateur connecté** entre ingrédients + type de plat
2. **Frontend** envoie requête POST à `/api/generate`
3. **API Route** :
   - Vérifie l'authentification (token JWT)
   - Récupère la clé API Gemini de l'utilisateur (ou utilise la clé globale)
   - Appelle Gemini avec structured output
4. **Gemini** génère la recette au format JSON
5. **API Route** retourne la recette
6. **Frontend** affiche et permet de sauvegarder dans Supabase

---

## 🛠️ Stack technique détaillée

### **Frontend**

| Technologie      | Version | Rôle            | Pourquoi ce choix ?                                               |
| ---------------- | ------- | --------------- | ----------------------------------------------------------------- |
| **Next.js**      | 16.0    | Framework React | Routing automatique, optimisations built-in, API routes intégrées |
| **React**        | 19.x    | Bibliothèque UI | Composants réutilisables, gestion d'état efficace                 |
| **TypeScript**   | 5.0     | Langage         | Sécurité du typage, autocomplétion, détection d'erreurs           |
| **Tailwind CSS** | 3.4     | Styling         | Classes utilitaires, pas de CSS à écrire, responsive facile       |
| **shadcn/ui**    | Latest  | Composants UI   | Composants React pré-stylés, personnalisables, accessibles        |
| **Lucide React** | Latest  | Icônes          | 1000+ icônes Material Design, légères, optimisées React           |
| **Sonner**       | Latest  | Notifications   | Toast modernes, animations fluides, API simple                    |

### **Backend & Services**

| Service           | Rôle                              | Configuration                                                                     |
| ----------------- | --------------------------------- | --------------------------------------------------------------------------------- |
| **Supabase**      | Auth + Base de données PostgreSQL | - Tables : `recipes`, `user_settings`<br>- Auth : Email/Password<br>- RLS activé  |
| **Google Gemini** | Intelligence Artificielle         | - Modèle : `gemini-2.0-flash-exp`<br>- Structured Output : schéma JSON forcé      |
| **Vercel**        | Hébergement & déploiement         | - Déploiement automatique depuis GitHub<br>- Variables d'environnement sécurisées |

---

## 📁 Structure du projet

```
recipe-ai/
│
├── app/                          # App Router Next.js
│   ├── layout.tsx               # Layout global (Toaster)
│   ├── page.tsx                 # Page d'accueil (formulaire génération)
│   │
│   ├── auth/                    # Authentification
│   │   └── page.tsx            # Page login/signup
│   │
│   ├── recipe/                  # Affichage recette
│   │   └── page.tsx            # Détails + sauvegarde
│   │
│   ├── my-recipes/              # Liste recettes sauvegardées
│   │   └── page.tsx            # CRUD recettes utilisateur
│   │
│   ├── settings/                # Paramètres utilisateur
│   │   └── page.tsx            # Configuration clé API Gemini
│   │
│   └── api/                     # API Routes (Backend)
│       └── generate/
│           └── route.ts        # Endpoint génération avec Gemini
│
├── components/                  # Composants réutilisables
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── textarea.tsx
│   │
│   └── navbar.tsx              # Barre de navigation globale
│
├── lib/                         # Utilitaires
│   └── supabase.ts             # Client Supabase
│
├── .env.local                   # Variables d'environnement (secret)
├── package.json                 # Dépendances npm
├── tsconfig.json               # Configuration TypeScript
├── tailwind.config.ts          # Configuration Tailwind
└── next.config.js              # Configuration Next.js
```

### **Fichiers clés expliqués :**

#### **`app/layout.tsx`** - Layout global

```typescript
// Point d'entrée de l'application
// Contient le Toaster pour les notifications globales
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster /> {/* Notifications toast globales */}
      </body>
    </html>
  );
}
```

#### **`lib/supabase.ts`** - Client Supabase

```typescript
// Crée le client Supabase pour l'auth et la DB
// Utilise les variables d'environnement
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

#### **`components/navbar.tsx`** - Navigation

```typescript
// Composant réutilisé sur toutes les pages
// Gère : navigation active, état utilisateur, responsive
export function Navbar() {
  const [user, setUser] = useState(null);
  // Vérifie l'authentification
  // Affiche les liens appropriés
  // Menu hamburger sur mobile
}
```

---

## ✨ Fonctionnalités

### **1. 🔐 Authentification complète**

- Inscription avec email/mot de passe
- Connexion sécurisée (JWT)
- Déconnexion
- Protection des routes (redirection si non connecté)
- Affichage de l'email utilisateur

### **2. 🤖 Génération de recettes avec IA**

- Saisie d'ingrédients disponibles
- Choix du type de plat (entrée, plat, dessert)
- Appel à Gemini avec **Structured Output** (garantit format JSON)
- Parsing automatique de la réponse
- Affichage détaillé :
  - Titre de la recette
  - Temps de préparation
  - Niveau de difficulté
  - Liste d'ingrédients
  - Étapes numérotées

### **3. 💾 Sauvegarde et gestion**

- Bouton "Sauvegarder" sur chaque recette générée
- Page "Mes recettes" avec toutes les recettes sauvegardées
- Affichage en grille (responsive)
- Suppression de recettes
- Visualisation des détails

### **4. 🧪 Mode test (sans API)**

- 3 recettes statiques pré-chargées :
  - Poulet Basquaise
  - Quiche Lorraine
  - Tarte Tatin
- Génération aléatoire pour tester l'interface
- Fonctionne sans clé API ni quota

### **5. ⚙️ Gestion des clés API personnelles**

- Page paramètres dédiée
- Chaque utilisateur peut configurer sa propre clé Gemini
- Validation du format de la clé
- Suppression possible
- Affichage du statut (configurée ou non)
- Lien direct vers Google AI Studio

### **6. 🧭 Navigation professionnelle**

- Navbar unifiée sur toutes les pages
- Mise en surbrillance de la page active
- Menu responsive (hamburger sur mobile)
- Icônes Lucide React professionnelles
- Transitions fluides

### **7. 📱 Design responsive**

- Mobile-first approach
- Grille adaptative (1 col mobile, 2-3 cols desktop)
- Menu hamburger sur petit écran
- Touch-friendly sur mobile

### **8. 🔔 Notifications toast**

- Toast de succès (vert)
- Toast d'erreur (rouge)
- Toast de chargement (avec spinner)
- Disparition automatique
- Empilage si plusieurs notifications

---

## 🚀 Installation et configuration

### **Prérequis**

- Node.js 18+ installé
- Un compte Supabase (gratuit)
- Une clé API Google Gemini (gratuite)

### **1. Cloner le projet**

```bash
git clone https://github.com/ton-username/recipe-ai.git
cd recipe-ai
```

### **2. Installer les dépendances**

```bash
npm install
```

### **3. Configuration Supabase**

#### **a) Créer un projet Supabase**

- Va sur https://supabase.com
- Crée un nouveau projet
- Note ton **Project URL** et **anon key**

#### **b) Créer les tables**

Dans l'éditeur SQL de Supabase, exécute :

```sql
-- Table des recettes
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  temps TEXT,
  difficulte TEXT,
  ingredients JSONB,
  etapes JSONB
);

-- Table des paramètres utilisateur
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  gemini_api_key TEXT
);

-- Activer Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Politiques pour recipes
CREATE POLICY "Users can insert their own recipes"
ON recipes FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own recipes"
ON recipes FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes"
ON recipes FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Politiques pour user_settings
CREATE POLICY "Users can insert their own settings"
ON user_settings FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own settings"
ON user_settings FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
ON user_settings FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings"
ON user_settings FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON user_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

#### **c) Configurer l'authentification**

- Va dans **Authentication** > **Providers** > **Email**
- Active le provider
- (Optionnel) Désactive "Confirm email" pour les tests

### **4. Obtenir une clé Gemini**

- Va sur https://aistudio.google.com/apikey
- Crée une clé API (gratuite)
- Copie la clé (commence par `AIza...`)

### **5. Variables d'environnement**

Crée un fichier `.env.local` à la racine :

```bash
# Gemini AI
GEMINI_API_KEY=ta_cle_gemini_ici

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ta_anon_key_ici
```

⚠️ **Important :** Les variables `NEXT_PUBLIC_*` sont accessibles côté client (nécessaire pour Supabase Auth).

### **6. Lancer l'application**

```bash
npm run dev
```

Ouvre http://localhost:3000 🎉

### **7. Déploiement sur Vercel**

```bash
# 1. Pousse ton code sur GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Va sur vercel.com
# 3. Importe ton repo GitHub
# 4. Ajoute les variables d'environnement
# 5. Deploy !
```

N'oublie pas d'ajouter ton URL Vercel dans Supabase :

- **Authentication** > **URL Configuration**
- Ajoute `https://ton-app.vercel.app` dans Site URL et Redirect URLs

---

## 🧩 Concepts clés expliqués

### **1. React - Composants**

Un composant = une fonction qui retourne du JSX (HTML + JavaScript).

```typescript
// Composant simple
export default function MaPage() {
  return (
    <div>
      <h1>Bonjour !</h1>
    </div>
  );
}

// Composant avec props (données passées)
function Card({ titre, description }) {
  return (
    <div>
      <h2>{titre}</h2>
      <p>{description}</p>
    </div>
  );
}

// Utilisation
<Card titre="Ma carte" description="Contenu" />;
```

### **2. useState - Gérer l'état local**

`useState` crée une "mémoire" pour le composant.

```typescript
import { useState } from "react";

function Compteur() {
  // [valeurActuelle, fonctionPourChanger] = useState(valeurInitiale)
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Compteur : {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

**Quand utiliser :**

- Formulaires (texte saisi par l'utilisateur)
- Toggle (ouvert/fermé, actif/inactif)
- Données chargées depuis une API
- Tout ce qui peut changer et doit être affiché

### **3. useEffect - Exécuter du code au chargement**

`useEffect` lance du code quand le composant apparaît.

```typescript
import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Ce code s'exécute une fois au chargement
    async function loadUser() {
      const data = await fetchUser();
      setUser(data);
    }
    loadUser();
  }, []); // [] = juste au montage, pas à chaque render

  return <div>{user?.name}</div>;
}
```

**Le tableau de dépendances `[]` :**

- `[]` vide = une seule fois au chargement
- `[count]` = à chaque fois que `count` change
- Pas de tableau = à chaque render (attention !)

### **4. TypeScript - Typage**

TypeScript = JavaScript avec vérification des types.

```typescript
// Variables typées
const name: string = "Alice";
const age: number = 25;
const isActive: boolean = true;

// Tableaux typés
const numbers: number[] = [1, 2, 3];
const names: string[] = ["Alice", "Bob"];

// Objets typés (interface)
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
};

// Fonctions typées
function greet(name: string): string {
  return `Hello ${name}`;
}

// Type personnalisé
type Recipe = {
  titre: string;
  temps: string;
  difficulte: "facile" | "moyen" | "difficile"; // Union type
  ingredients: string[];
  etapes: string[];
};
```

**Pourquoi typer ?**

- ✅ Évite les bugs (impossible de passer un nombre où on attend un texte)
- ✅ Autocomplétion dans l'éditeur
- ✅ Refactoring plus sûr
- ✅ Documentation automatique

### **5. Next.js - App Router**

Next.js transforme la structure de dossiers en routes.

```
app/
├── page.tsx           → / (accueil)
├── about/
│   └── page.tsx      → /about
├── recipe/
│   └── page.tsx      → /recipe
└── api/
    └── generate/
        └── route.ts  → /api/generate (endpoint API)
```

**'use client' vs Server Component :**

```typescript
// Server Component (défaut)
// S'exécute côté serveur, pas d'interactivité
export default function Page() {
  return <div>Statique</div>;
}

// Client Component
// S'exécute côté navigateur, peut utiliser useState, onClick, etc.
("use client");
export default function Page() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**Quand utiliser 'use client' :**

- useState, useEffect, useRouter
- Event handlers (onClick, onChange)
- Accès au localStorage, window
- Bibliothèques nécessitant le navigateur

### **6. Async/Await - Opérations asynchrones**

Quand une opération prend du temps (API, base de données), on utilise `async/await`.

```typescript
// Sans async/await (Promises chaînées - old school)
fetch("/api/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

// Avec async/await (moderne et lisible)
async function loadData() {
  try {
    const response = await fetch("/api/data");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

**Règles importantes :**

- `await` ne marche que dans une fonction `async`
- Toujours utiliser `try/catch` pour gérer les erreurs
- `await` "met en pause" jusqu'à ce que la promesse se résolve

### **7. Supabase - Row Level Security (RLS)**

RLS = Sécurité au niveau des lignes. Chaque utilisateur ne voit que SES données.

```sql
-- Sans RLS (DANGER !)
-- Tout le monde voit tout

-- Avec RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Policy : les utilisateurs ne voient que leurs recettes
CREATE POLICY "Users view own recipes"
ON recipes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

**En pratique :**

- User A (id=123) ne peut voir que les recettes où `user_id = 123`
- User B (id=456) ne peut voir que les recettes où `user_id = 456`
- Impossible de tricher, c'est géré par PostgreSQL

### **8. Structured Output - Gemini**

Forcer l'IA à répondre dans un format précis.

```typescript
// Définir le schéma attendu
const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    titre: { type: Type.STRING },
    temps: { type: Type.STRING },
    difficulte: { type: Type.STRING },
    ingredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    etapes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
};

// Utiliser dans l'appel
const response = await ai.models.generateContent({
  model: "gemini-2.0-flash-exp",
  contents: prompt,
  config: {
    responseMimeType: "application/json",
    responseSchema: recipeSchema, // ← Force le format
  },
});

// Gemini retourne TOUJOURS un JSON valide qui respecte le schéma
const recipe = JSON.parse(response.text);
```

**Avantages :**

- ✅ Pas besoin de parser/nettoyer la réponse
- ✅ Toujours valide (pas de ```json ou texte superflu)
- ✅ Plus fiable que les prompts seuls

---

## 📚 Rappels pédagogiques

### **Architecture d'une application web moderne**

```
┌─────────────────────────────────────────────┐
│  FRONTEND (Ce que l'utilisateur voit)       │
│  - Next.js (React)                          │
│  - Interface graphique                      │
│  - Gestion d'état (useState)                │
│  - Routing (navigation)                     │
└────────────┬────────────────────────────────┘
             │
             │ HTTP Requests (fetch)
             │
┌────────────▼────────────────────────────────┐
│  BACKEND (Serveur)                          │
│  - API Routes (/api/*)                      │
│  - Logique métier                           │
│  - Authentification                         │
│  - Appels vers services externes            │
└────────────┬────────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
┌──────────┐  ┌──────────┐
│ DATABASE │  │ EXTERNAL │
│ Supabase │  │   APIs   │
│          │  │  Gemini  │
└──────────┘  └──────────┘
```

### **Flow d'une requête complète**

```
1. USER ACTION
   └─> Utilisateur clique sur "Générer une recette"

2. FRONTEND
   └─> État loading activé (setLoading(true))
   └─> fetch('/api/generate', { method: 'POST', body: {...} })

3. API ROUTE (/api/generate/route.ts)
   └─> Vérifier authentification
   └─> Récupérer clé API de l'utilisateur depuis Supabase
   └─> Appeler Gemini avec structured output
   └─> Parser la réponse JSON
   └─> Retourner au frontend

4. FRONTEND (suite)
   └─> Réception de la réponse
   └─> Sauvegarder dans localStorage
   └─> Naviguer vers /recipe
   └─> Afficher la recette

5. PAGE RECETTE
   └─> Charger depuis localStorage
   └─> Afficher avec composants UI
   └─> Bouton "Sauvegarder" → INSERT dans Supabase
```

### **Concepts React à retenir**

#### **1. Le rendu conditionnel**

```typescript
// Afficher différentes choses selon l'état
function Page() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Si loading, afficher spinner
  if (loading) {
    return <div>Chargement...</div>;
  }

  // Si pas de data, afficher message
  if (!data) {
    return <div>Aucune donnée</div>;
  }

  // Sinon, afficher les données
  return <div>{data.name}</div>;
}
```

#### **2. Les listes et .map()**

```typescript
// Afficher une liste dynamique
function RecipeList({ recipes }) {
  return (
    <div>
      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <h2>{recipe.titre}</h2>
          <p>{recipe.temps}</p>
        </div>
      ))}
    </div>
  );
}
```

⚠️ **Toujours mettre une `key` unique** dans les listes !

#### **3. Les événements**

```typescript
function Form() {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche rechargement de la page
    console.log("Texte soumis:", text);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

### **Pattern de gestion d'erreur**

Toujours utiliser ce pattern pour les appels API :

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

async function fetchData() {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch("/api/data");

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`);
    }

    const data = await response.json();
    // Faire quelque chose avec data
  } catch (err) {
    setError(err.message);
    console.error("Erreur:", err);
  } finally {
    setLoading(false); // Toujours exécuté
  }
}
```

### **TypeScript - Astuces pratiques**

```typescript
// Optional chaining (?.): évite les erreurs si null/undefined
const name = user?.profile?.name; // undefined si user ou profile n'existe pas

// Nullish coalescing (??): valeur par défaut
const displayName = user?.name ?? "Anonyme"; // 'Anonyme' si name est null/undefined

// Non-null assertion (!): "je suis sûr que ça existe"
const apiKey = process.env.API_KEY!; // Force TypeScript à accepter

// Type guard (vérification de type)
if (typeof value === "string") {
  // TypeScript sait que value est une string ici
  console.log(value.toUpperCase());
}

// As (cast de type)
const input = document.getElementById("myInput") as HTMLInputElement;
```

### **Next.js - Variables d'environnement**

```bash
# .env.local

# ❌ PRIVÉE (uniquement serveur)
API_SECRET=secret123

# ✅ PUBLIQUE (client + serveur)
NEXT_PUBLIC_API_URL=https://api.example.com
```

```typescript
// Côté serveur (API Route)
const secret = process.env.API_SECRET; // ✅ Accessible

// Côté client (composant 'use client')
const url = process.env.NEXT_PUBLIC_API_URL; // ✅ Accessible
const secret = process.env.API_SECRET; // ❌ undefined !
```

### **Supabase - Patterns courants**

```typescript
const supabase = createClient();

// INSERT (créer)
const { data, error } = await supabase
  .from("recipes")
  .insert({ titre: "Ma recette", user_id: userId });

// SELECT (lire tout)
const { data, error } = await supabase.from("recipes").select("*");

// SELECT avec filtre
const { data, error } = await supabase
  .from("recipes")
  .select("*")
  .eq("user_id", userId) // WHERE user_id = userId
  .order("created_at", { ascending: false }); // ORDER BY

// UPDATE (modifier)
const { data, error } = await supabase
  .from("recipes")
  .update({ titre: "Nouveau titre" })
  .eq("id", recipeId);

// DELETE (supprimer)
const { data, error } = await supabase
  .from("recipes")
  .delete()
  .eq("id", recipeId);

// Authentification
const { data, error } = await supabase.auth.signUp({ email, password });
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
const {
  data: { user },
} = await supabase.auth.getUser();
await supabase.auth.signOut();
```

---

## 🐛 Problèmes rencontrés et solutions

### **1. Variables d'environnement non chargées**

**Problème :** `process.env.NEXT_PUBLIC_SUPABASE_URL` est undefined

**Solution :**

- ✅ Redémarrer le serveur (`Ctrl+C` puis `npm run dev`)
- ✅ Vérifier que `.env.local` est à la racine
- ✅ Pas d'espaces ni de guillemets dans `.env.local`
- ✅ Variables publiques commencent par `NEXT_PUBLIC_`

### **2. Erreur 403 Forbidden avec Supabase**

**Problème :** Requêtes bloquées par RLS

**Solution :**

- ✅ Vérifier que l'utilisateur est bien authentifié
- ✅ Vérifier les policies RLS (utiliser `auth.uid()`)
- ✅ Utiliser `.maybeSingle()` au lieu de `.single()` pour éviter les erreurs si 0 résultats

### **3. JSON invalide de Gemini**

**Problème :** Gemini retourne du texte au lieu de JSON pur

**Solution :**

- ✅ Utiliser **Structured Output** (responseSchema)
- ✅ Nettoyer avec regex : ` text.replace(/```json\n?/g, '') `
- ✅ Wrapper dans `try/catch` lors du `JSON.parse()`

### **4. Recette non sauvegardée**

**Problème :** Bouton "Sauvegarder" ne fait rien

**Solution :**

- ✅ Vérifier que `user_id` est bien passé
- ✅ Logs dans la console : `console.log('Saving:', recipe)`
- ✅ Vérifier les policies RLS pour INSERT

### **5. Navigation ne fonctionne pas**

**Problème :** `router.push()` ne change pas de page

**Solution :**

- ✅ Importer depuis `next/navigation` (pas `next/router`)
- ✅ Utiliser `'use client'` dans le composant
- ✅ Appeler `router.refresh()` si besoin

---

## 🚀 Prochaines étapes & Améliorations

### **Court terme (1-2h)**

- [ ] **Images de recettes** : Générer avec DALL-E ou Stable Diffusion
- [ ] **Favoris/Notes** : Système de notation (⭐⭐⭐⭐⭐)
- [ ] **Recherche** : Barre de recherche dans "Mes recettes"
- [ ] **Filtres** : Par difficulté, temps, ingrédients
- [ ] **Export PDF** : Télécharger une recette en PDF

### **Moyen terme (1-2 jours)**

- [ ] **Partage** : Lien public pour partager une recette
- [ ] **Collections** : Organiser en dossiers (desserts, plats, etc.)
- [ ] **Mode sombre** : Theme switcher light/dark
- [ ] **Impression** : CSS optimisé pour impression
- [ ] **Historique** : Voir toutes les recettes générées (même non sauvegardées)

### **Long terme (1 semaine+)**

- [ ] **Liste de courses** : Générer automatiquement depuis plusieurs recettes
- [ ] **Planning de repas** : Calendrier de la semaine
- [ ] **Mode hors-ligne** : PWA avec Service Workers
- [ ] **Suggestions** : "Recettes similaires" basé sur les ingrédients
- [ ] **Import recettes** : Scanner une recette papier (OCR)
- [ ] **Communauté** : Partager et découvrir des recettes d'autres utilisateurs

### **Optimisations techniques**

- [ ] **Caching** : Mettre en cache les recettes générées côté serveur
- [ ] **Pagination** : Charger les recettes par batch de 20
- [ ] **Lazy loading** : Images et composants chargés à la demande
- [ ] **SEO** : Métadonnées, sitemap, open graph
- [ ] **Analytics** : Suivre l'utilisation avec Vercel Analytics
- [ ] **Tests** : Jest + React Testing Library
- [ ] **CI/CD** : GitHub Actions pour tests automatiques

---

## 📖 Ressources pour aller plus loin

### **Documentation officielle**

- [React](https://react.dev) - Docs officielles React
- [Next.js](https://nextjs.org/docs) - Guide complet Next.js
- [TypeScript](https://www.typescriptlang.org/docs) - Handbook TypeScript
- [Tailwind CSS](https://tailwindcss.com/docs) - Toutes les classes utilitaires
- [Supabase](https://supabase.com/docs) - Auth, Database, Storage
- [Gemini API](https://ai.google.dev/gemini-api/docs) - Documentation IA

### **Tutoriels et cours**

- [Next.js 15 Tutorial](https://nextjs.org/learn) - Cours officiel Next.js
- [React Beta Docs](https://react.dev/learn) - Apprendre React moderne
- [TypeScript for Beginners](https://www.totaltypescript.com) - Exercices TypeScript
- [Tailwind Play](https://play.tailwindcss.com) - Tester Tailwind en ligne

### **Outils utiles**

- [shadcn/ui](https://ui.shadcn.com) - Tous les composants disponibles
- [Lucide Icons](https://lucide.dev) - Rechercher des icônes
- [Vercel Templates](https://vercel.com/templates) - Templates Next.js
- [Supabase Examples](https://github.com/supabase/supabase/tree/master/examples) - Exemples de code

---

## 🙏 Remerciements

Ce projet a été créé dans un objectif d'apprentissage intensif. Merci à :

- **Anthropic** pour Claude qui m'a guidé pas à pas
- **Vercel** pour Next.js et l'hébergement gratuit
- **Supabase** pour l'infrastructure backend
- **Google** pour l'API Gemini gratuite
- La communauté **open-source** pour tous les outils utilisés

---

## 📝 Licence

MIT License - Libre d'utilisation, modification et distribution.

---

## 📧 Contact

Si tu as des questions sur ce projet ou son implémentation :

- GitHub : [@pluton-1321](https://github.com/Pltn-1321)
- Email : pierre.pluton@outlook.fr

---

**Fait avec ❤️ et beaucoup de ☕ en 1h chrono !**

_Ce README est aussi un aide-mémoire pour moi-même - n'hésite pas à t'en inspirer pour tes propres projets !_ 🚀
