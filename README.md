# Mon Site Web

Ce projet a pour but de créer un site web retraçant un ensemble d'information me concernant, accompagner des divers documents liés à ces informations. On pourra également y trouver des informations générales de tous types.

## Mon objectif personnel

A l'origine je souhaitais uniquement créer un petit site d'une page réunissant toutes les informations me concernant, mais après un auto-révisions de ma part je souhaitais également en profiter pour réaliser différentes tâches que je n'ai pas eu l'occasion de faire ou de finaliser

## Comment lancer ce site ?

Pour ouvrir ce site, il faut réaliser des étapes pour le moins communes:

#### Recupérer le projet via Git

Que vous soyez sur Windows ou Linux, à partir du moment où vous avez trouvez ce dépot sur Github, il suffit d'ouvrir un terminal et de "git clone" le projet de cette façon:
```bash 
git clone nom-du-projet
```
Bien sur le "nom-du-projet" ce récupère dans le dépot Git en question.   Penser également à avoir Git au préalable bien sûr.

#### Compiler le projet 

Après avoir récupérer le projet, il suffit de l'ouvrir comme n'importe quel projet Maven car effectivement ce projet a été réalisé via Maven(4.0.0). Donc, lancer les commandes suivantes:

```bash 
cd Site #L'objectif est d'être dans le dossier où se trouve le pom.xml
mvn compile
mvn spring-boot:run
```

Une fois cela fait vous n'aurez plus qu'a vous rendre sur l'adresse suivante: "http://localhost:8888"

## Informations complémentaire 

- Ce projet a été testé sur Windows et Linux, donc rien ne garanti à 100% que ce projet ne présente pas plus de bug qu'il en est déjà sur MacOS.
- Dans ce projet, les languages qui ont été utilisé sont le langage JAVA, TypeScript, HTML, CSS(à savoir que je cherche surtout a découvrir de nouvelle choses afin de m'y familiariser tels que découvrir des api par exemple).


### Creation de base de données

Sans surprise, ce projet est accompagné de plusieurs bases de données. Afin de pouvoir accéder à tout cela et donc de ne pas se retrouver avec un site vide, il faut modifier un léger détail:

#### Avec un environnement de travail

Si vous avez un environnement de travail tels que IntelliJ IDEA ou encore Visual Studio Code (VSC), vous pouvez :

- Vous rendre dans le fichier application.properties 
```bash
# Modifier dans la section DATABASE :
spring.datasource.password=${DB_PASSWORD}
# En : 
spring.datasource.password=Riders08
```

#### Full terminal

Si vous êtes uniquement sur un terminal il vous suffit de : 
```bash
cd Site;
cd src;
cd main;
cd resources;
nano application.properties
# Modifier dans la section DATABASE :
spring.datasource.password=${DB_PASSWORD}
# En : 
spring.datasource.password=Riders08
```

Pour la création des tables on peut y retrouver les commandes qui ont été exécutées dans le fichier Base.sql

## Note Importante

Etant donnée que ce projet a été réalisé en full autonomie en complement de mes études, je tiens à préciser dans cette section que divers points méritent d'être soulevées:

- Ma section Loisirs est incomplète voire démarrée en raison de son objectif consistant à relever en détails l'ensemble de tous les loisirs qui me plaisent retracés l'année découverte, en affiliant une note à ce dernier, etc...(Réaliser cette section est pour moi, un projet dans un projet)
- Ma database commentaire n'est pas optimale, actuellement j'ai un léger souci qui pourrait être réglé facilement, consistant à transformer ma colonne user(text) en une colonne users_id qui serait une clé étrangère reliée à ma database users
- Enfin je tiens à préciser, ou plutôt à rappeler, que ce projet n'était pas réellement un projet pour le moins "utile", mon objectif était surtout de découvrir ou revoir des tas de points que j'avais vaguement vus en projet de groupe ou qui m'intéressaient de base. Il ne faut donc pas être surpris que l'on puisse créer des comptes et poster des documents ne me concernant, pas sur ce genre de site (En soi, c'est purement pour m'entraîner).

Ces points sont au délà des informations importants, elles sont surtout les futures issues que j'ai pour objectifs de réaliser

