# Jeu de Conversation

Ce projet est un jeu de conversation interactif avec différents thèmes.

## Configuration de l'environnement de développement

Ce projet utilise une installation locale de Node.js pour fonctionner sans droits d'administrateur.

### Pour les utilisateurs sans droits d'administrateur :

1. Clonez le dépôt :
   ```
   git clone https://github.com/votre-nom/conversation-game.git
   cd conversation-game
   ```

2. Utilisez le fichier `start.bat` pour lancer le serveur :
   ```
   start.bat
   ```

3. Pour installer des dépendances ou exécuter des scripts npm, utilisez le fichier `npm.cmd` :
   ```
   npm.cmd install
   npm.cmd start
   ```

### Pour les utilisateurs avec une installation globale de Node.js :

1. Clonez le dépôt :
   ```
   git clone https://github.com/votre-nom/conversation-game.git
   cd conversation-game
   ```

2. Installez les dépendances :
   ```
   npm install
   ```

3. Lancez le serveur :
   ```
   npm start
   ```

## Accéder au jeu

Une fois le serveur lancé, ouvrez votre navigateur et allez à l'adresse :
http://localhost:3000

## Développement

- Les fichiers du jeu se trouvent dans le dossier racine du projet.
- Le serveur API est dans le dossier `api/`.
- Les données des thèmes sont stockées dans `data/themes.json`.

## Contribution

Les contributions sont les bienvenues ! Veuillez créer une issue ou une pull request pour toute amélioration ou correction de bug.

## Licence

[non statué encore - a insérer ici...]