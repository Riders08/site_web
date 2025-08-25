# Mon Site Web

Ce projet a pour but de créer un site web retraçant un ensemble d'information me concernant, accompagner des divers documents liés à ces informations. On pourra également y trouver des informations générales de tous types.

## Comment lancer ce site ?

Pour ouvrir ce site, il faut réaliser des étapes pour le moins communes:

#### Recupérer le projet via Git

Que vous soyez sur Windows ou Linux et que vous ayez trouvez ce dépot sur Github ou Gitlab, il suffit d'ouvrir un terminal et de "git clone" le projet de cette façon:
```bash 
git clone nom-du-projet
```
Bien sur le "nom-du-projet" ce récupère dans le dépot Git en question.   Penser également à avoir Git au préalable bien sûr.

#### Compiler le projet 

Après avoir récupérer le projet, il suffit de l'ouvrir comme n'importe quel projet Maven car effectivement ce projet a été réalisé via Maven(4.0.0). Donc, lancer les commandes suivantes:

```bash 
cd Site
mvn compile
mvn spring-boot:run
```

Une fois cela fait vous n'aurez plus qu'a vous rendre sur l'adresse suivante: "http://localhost:8888"

## Informations complémentaire 

- Ce projet a été testé sur Windows et Linux, donc rien ne garanti à 100% que ce projet ne présente pas plus de bug qu'il en est déjà sur cette Environnement.
- Dans ce projet, les languages qui ont été utilisé sont le langage JAVA, TypeScript, HTML, CSS(a savoir que je veux en appliquer d'autres afin de m'y familiariser tels que le PHP par exemple).
