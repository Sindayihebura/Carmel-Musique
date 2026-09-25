# 🎵 Mes Musiques - Plateforme de Streaming

Une application web moderne de streaming musical avec lecteur audio avancé, gestion de bibliothèque, commentaires et statistiques.

## ✨ Fonctionnalités

### Lecteur Audio
- ▶️ Lecture/Pause avec raccourcis clavier (Espace)
- 🎚️ Barre de progression cliquable
- 🔊 Contrôle du volume
- ⏮️ ⏭️ Piste précédente/suivante
- 🔀 Lecture aléatoire (touche S)
- 🔁 Répétition (touche R) : tout / un morceau / désactivé
- 📊 Visualiseur audio en temps réel

### Gestion de Bibliothèque
- 📤 Téléversement de morceaux (glisser-déposer)
- 📥 Téléchargement de chaque morceau
- 🗑️ Suppression de morceaux
- ❤️ Système de likes (un like par visiteur)
- 💬 Commentaires sur chaque morceau

### Recherche et Tri
- 🔍 Recherche en temps réel (titre et artiste)
- 📊 Tri par : plus récents, plus anciens, plus aimés, plus écoutés, A-Z

### Statistiques
- 📈 Nombre total de morceaux
- ▶️ Nombre total de lectures
- ❤️ Nombre total de likes
- ⬇️ Nombre total de téléchargements

### Design
- 🌙 Thème sombre moderne
- 🎨 Couvertures d'album générées automatiquement avec dégradés uniques
- 📱 Design responsive (mobile et desktop)
- ⌨️ Raccourcis clavier complets

### Formats Audio Supportés
MP3, WAV, OGG, M4A, FLAC, AAC, WebM

## 🚀 Déploiement sur Vercel

### Méthode 1 : Via GitHub (Recommandé)

1. **Créer un dépôt GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USERNAME/mes-musiques.git
   git push -u origin main
   ```

2. **Connecter à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec GitHub
   - Cliquez sur "New Project"
   - Sélectionnez votre dépôt `mes-musiques`
   - Vercel détectera automatiquement Vite
   - Cliquez sur "Deploy"

3. **Déploiement automatique**
   - Chaque push sur `main` déclenchera un nouveau déploiement
   - Vous obtiendrez une URL comme `https://mes-musiques.vercel.app`

### Méthode 2 : Via Vercel CLI

1. **Installer Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Se connecter**
   ```bash
   vercel login
   ```

3. **Déployer**
   ```bash
   vercel
   ```

4. **Déployer en production**
   ```bash
   vercel --prod
   ```

### Méthode 3 : Importer directement sur Vercel

1. Allez sur [vercel.com/new](https://vercel.com/new)
2. Glissez-déposez votre dossier de projet
3. Cliquez sur "Deploy"

## 🛠️ Développement Local

### Installation
```bash
npm install
```

### Lancer le serveur de développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5173`

### Build pour production
```bash
npm run build
```

### Prévisualiser le build
```bash
npm run preview
```

## 📁 Structure du Projet

```
mes-musiques/
├── src/
│   ├── components/
│   │   ├── Header.tsx          # En-tête avec recherche et tri
│   │   ├── TrackCard.tsx       # Carte de morceau
│   │   ├── Player.tsx          # Lecteur audio avec visualiseur
│   │   ├── UploadModal.tsx     # Modal de téléversement
│   │   ├── CommentsPanel.tsx   # Panneau de commentaires
│   │   ├── QueuePanel.tsx      # File d'attente
│   │   └── Stats.tsx           # Statistiques
│   ├── App.tsx                 # Composant principal
│   ├── main.tsx                # Point d'entrée
│   ├── types.ts                # Types TypeScript
│   ├── store.ts                # Gestion du localStorage
│   └── index.css               # Styles globaux
├── public/                     # Assets statiques
├── index.html                  # HTML principal
├── vercel.json                 # Configuration Vercel
├── package.json                # Dépendances
└── README.md                   # Ce fichier
```

## ⌨️ Raccourcis Clavier

- `Espace` : Lecture/Pause
- `←` : Reculer de 5 secondes
- `→` : Avancer de 5 secondes
- `Shift + ←` : Piste précédente
- `Shift + →` : Piste suivante
- `S` : Activer/Désactiver la lecture aléatoire
- `R` : Changer le mode de répétition

## 🔧 Technologies

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS 4** - Styling utilitaire
- **LocalStorage** - Persistance des données

## 📝 Notes Importantes

- Les données sont stockées localement dans le navigateur (localStorage)
- Les fichiers audio sont encodés en base64 et stockés dans le navigateur
- Pas de backend nécessaire - application 100% client-side
- Limite de stockage : ~5-10 MB selon le navigateur

## 🐛 Problèmes Connus

- Les gros fichiers audio peuvent ralentir l'application
- Le localStorage a une limite de taille (généralement 5-10 MB)
- Les données sont perdues si vous videz le cache du navigateur

## 📄 Licence

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

Créé avec ❤️ en utilisant React, TypeScript et Tailwind CSS
