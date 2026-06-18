# Projet Bookstore - Architecture Microservices

## Description

Ce projet est une application Bookstore basée sur une architecture microservices avec Docker et LoopBack 4.

L'application permet :

* d'afficher des livres,
* d'ajouter un livre,
* de modifier un livre,
* de supprimer un livre,
* de communiquer entre plusieurs microservices via une API Gateway.

---

# Architecture du projet

Le projet contient plusieurs services :

| Service         | Port  | Description                       |
| --------------- | ----- | --------------------------------- |
| bookstore       | 4000  | Frontend Express + EJS            |
| api-gateway     | 9001  | Gateway centralisant les requêtes |
| bookstore-api   | 3000  | Microservice Inventory / Books    |
| order-service   | 3001  | Microservice Orders               |
| payment-service | 3002  | Microservice Payments             |
| mongo           | 27017 | Base de données MongoDB           |

---

# Technologies utilisées

* Node.js
* Express.js
* LoopBack 4
* MongoDB
* Docker
* Docker Compose
* EJS
* Axios

---

# Lancement du projet

## 1. Cloner le projet

```bash
git clone <repo-url>
cd Projet-Bookstore
```

## 2. Lancer Docker

```bash
docker compose up --build
```

---

# URLs importantes

## Frontend

```txt
http://localhost:4000
```

## API Gateway

```txt
http://localhost:9001
```

## API Explorer Inventory

```txt
http://localhost:3000/explorer
```

## Order Service

```txt
http://localhost:9001/orders/ping
```

## Payment Service

```txt
http://localhost:9001/payments/ping
```

---

# Fonctionnalités

## Gestion des livres

* Ajouter un livre
* Modifier un livre
* Supprimer un livre
* Afficher la liste des livres

## Communication microservices

Les requêtes passent par l'API Gateway :

```txt
Frontend -> API Gateway -> Microservice
```

---

# Docker

Les services sont containerisés avec Docker.

Commande utile :

```bash
docker ps
```

Arrêter les containers :

```bash
docker compose down
```

Rebuild complet :

```bash
docker compose up --build
```

---

# Difficultés rencontrées

## API Gateway

Une difficulté importante concernait le proxy des routes `/inventory`.

Le problème venait du `pathRewrite` du proxy qui devait transformer :

```txt
/inventory/books
```

en :

```txt
/books
```

afin de correspondre aux routes exposées par le microservice LoopBack.

---
# Auteur
Projet réalisé par Selsabil Amairi
