# WEBS — Visionneuse de données de santé

Interface web permettant de visualiser en temps réel les données de capteurs de plusieurs patients et de comparer leurs activités.

## Fonctionnalités

- sélection de deux patients et de leur activité ;
- affichage simultané des capteurs `alx`, `aly`, `alz`, `glx`, `gly` et `glz` ;
- activation ou masquage dynamique des séries ;
- réglage du taux de rafraîchissement ;
- conservation des 50 derniers points dans chaque graphique ;
- démarrage et arrêt indépendants du suivi des patients.

## Technologies

- HTML, CSS et JavaScript ;
- Chart.js et Bootstrap ;
- appels asynchrones à une API de données ;
- Docker et Docker Compose.

## Lancer l'interface

```bash
docker compose up --build
```

L'application est ensuite accessible sur [http://localhost:8080](http://localhost:8080).

## Connexion à l'API

Renseigner l'URL du backend dans `src/js/app.js` :

```js
const API_BASE = "http://localhost:5000";
```

L'interface attend les routes suivantes :

- `GET /start?patient={id}&activity={id}`
- `GET /data?patient={id}`
- `GET /stop?patient={id}`

## Contexte

Projet académique réalisé en L3 MIAGE à l'IDMC — Université de Lorraine.

## Auteur

[Djiby Samba](https://github.com/Djibs123) · [Portfolio](https://djibs123.github.io/portfolio/) · [LinkedIn](https://www.linkedin.com/in/djiby-samba)
