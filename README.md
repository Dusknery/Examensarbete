Greyfall Stable – Hästavel & Hästinformation
Examensarbete – Systemutveckling JavaScript (SU24)
Om projektet

Greyfall Stable är en fullstack-webbapplikation utvecklad som examensarbete inom Systemutveckling JavaScript. Syftet med projektet är att skapa en modern webbplats för hantering av hästinformation och avel i ett realistiskt rollspelssammanhang.

Applikationen gör det möjligt att skapa och visa hästprofiler, hantera genetik, administrera avelshingstar, skicka betäckningsförfrågningar, ladda upp bilder samt hantera innehåll via en adminpanel.

All kod är skriven från grunden utan färdiga mallar eller generators.

Design

Design och wireframes är framtagna i Figma:

https://www.figma.com/design/rnISw08zpT2Z991wRluEOi/Untitled?node-id=0-1&t=SPze53UmSHAiPvvx-1

Figma används som grund för layout, komponentstruktur och visuell riktning innan implementation i React.

Projektplanering

Projektet planeras och följs upp via GitHub Projects enligt agil metodik med epics, features, user stories och PBIs.

GitHub Project / Board:
https://github.com/users/Dusknery/projects/2

Arbetet är uppdelat i Epics (större funktionella områden), Features (konkreta funktioner), User Stories (användarcentrerade behov) samt PBIs (Product Backlog Items kopplade till implementation).

Versionshantering sker via Git med branch-struktur och koppling mellan commits och issues.

Teknisk stack
Frontend

React (Vite)

JavaScript (ES6+)

HTML5

CSS3

React Router

Backend

Node.js

Express

MongoDB

Mongoose

Multer

REST API

Funktioner
Hästprofiler

Registrerat namn

Ras

Kön

Färg baserat på genetik

Stamtavla

Bild

Genetiksystem

Systemet hanterar bland annat Extension (E/e), Agouti (A/a), Cream och Pearl (Cr/Prl), Silver (Z), Dun (D), Grey (G), Roan (Rn), Tobiano (To), Frame (O), SB1, SW1 och LP.

Genetiken påverkar möjliga färgval och lagras strukturerat i databasen.

Avelssystem

Val av hingst

AI, TAI, FAI eller backbreeding

Koppling mellan sto och hingst

Förfrågningsformulär

Adminpanel

Skapa och redigera hästar

Ladda upp bilder

Hantera nyheter

Uppdatera innehåll

Testning

Backend testas med Jest. Tester omfattar API-endpoints, datavalidering och bildhantering.

Testområden inkluderar:

GET /api/horses

GET /api/horses/:id

POST /api/horses

PUT /api/horses/:id

DELETE /api/horses/:id

POST /api/upload

Felhantering vid ogiltig input

Tester körs från server-mappen med kommandot npm test.

Målet med testningen är att säkerställa korrekt API-funktionalitet, dataintegritet och stabil bildhantering.

Projektstruktur

Projektet är uppdelat i två huvuddelar:

client – React frontend
server – Node/Express backend

Frontend innehåller komponenter, sidor, services och styles.
Backend innehåller modeller, routes, controllers samt uploads-mapp för bilder.

Installation

Klona projektet från GitHub

Gå in i server och kör npm install

Skapa en .env-fil med PORT=4000 och MONGO_URI

Starta backend med npm run dev

Gå in i client och kör npm install

Starta frontend med npm run dev

Frontend körs normalt på http://localhost:5173

Backend-servern körs normalt på http://localhost:4000

Exempel på API-endpoints

GET http://localhost:4000/api/horses

GET http://localhost:4000/api/horses/:id

POST http://localhost:4000/api/horses

PUT http://localhost:4000/api/horses/:id

DELETE http://localhost:4000/api/horses/:id

POST http://localhost:4000/api/upload

Mål med examensarbetet

Målet är att utveckla en komplett fullstack-applikation från grunden, skapa ett eget REST-API, designa och implementera en databasmodell, bygga dynamisk logik för genetiska val, arbeta agilt med Git och GitHub samt implementera testning enligt branschstandard.

Författare

Linnea Ryd
Systemutveckling JavaScript – SU24
Examensarbete 2026
