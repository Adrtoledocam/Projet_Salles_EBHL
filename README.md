# 💻 Projet d’affichage des événements sur écrans

Ce projet a été développé pour mettre en place un **affichage dynamique de l’occupation des salles de conférences**, remplaçant le système précédent où les plannings étaient **imprimés chaque matin**.

Grâce à cet affichage, les utilisateurs peuvent :
- **Consulter en temps réel le statut d’une salle** (occupée ou disponible)
- **Mettre à jour leur réservation directement depuis leur agenda**

Le système s’appuie sur **deux sources de données distinctes** :
- Les **réservations des sites de Lausanne** et de la **Cité du Genévrier**, extraites depuis la base de données **Medhive**
- Les **réservations du Pôle Grand Âge**, récupérées directement depuis les **calendriers Exchange**

---

## 🖼️ Aperçu du rendu final
<img width="779" height="405" alt="Tablette fixée sur un mur à côté d'une porte de salle de conférence surlaquelle on voit le programme de la salle " src="https://github.com/user-attachments/assets/7ecc3223-bf6d-4af4-a26f-d76e6ff8f410" />

---

## 🚀 Lancement du projet en local

1. **Téléchargez le repository** sur votre machine (via Git ou en téléchargeant l'archive `.zip`)
2. **Installez [Node.js](https://nodejs.org/fr/download)** (version LTS recommandée)
3. **Ouvrez un terminal** et placez-vous dans le répertoire du projet :
   ```bash
   cd ./projet-salles
   ```
4. **Installez les dépendances** :
   ```bash
   npm install
   ```
5. **Démarrez le serveur en mode développement** :
   ```bash
   npm run dev
   ```
   > Cette commande utilise **nodemon** pour relancer automatiquement le serveur à chaque modification du code.

6. **Accédez à l’application** depuis votre navigateur :  
   [http://localhost:3000](http://localhost:3000)

---

## 🧱 Lancement en production

Pour la production, le projet utilise **[PM2](https://pm2.keymetrics.io/)** afin de :
- Redémarrer automatiquement l’application en cas de crash
- Gérer les processus Node.js et centraliser les logs
- Démarrer automatiquement l’application au boot du serveur

Pour lancer le projet en production, utilisez la commande suivante :
```bash
npm run prod
```
Cette commande s’appuie sur le fichier `ecosystem.config.js` pour gérer la configuration des processus PM2.

---

## 🛠 Scripts disponibles (package.json)

| Script         | Description |
|----------------|-------------|
| `npm run dev`  | Démarrage du serveur en développement avec **nodemon** |
| `npm run prod` | Démarrage ou redémarrage du serveur en production avec **PM2** |

---

## 📦 Dépendances principales

- `express` : serveur web
- `mysql2` : connexion à la base de données MySQL
- `node-ical` : lecture des fichiers iCal
- `rrule` : gestion des récurrences d'événements
- `dotenv` : gestion des variables d'environnement
- `helmet` : sécurité HTTP
- `axios` : requêtes HTTP

---

## 👥 Auteurs

- **Adrian TOLEDO**  
- **Mateja VELICKOVIC**

