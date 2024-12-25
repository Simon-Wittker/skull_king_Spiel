# Skull King Spiel Setup-Anleitung

Diese Anleitung bietet eine Schritt-für-Schritt-Anleitung, um das Skull King Spielprojekt lokal einzurichten und auszuführen. 

## Projektbeschreibung
Das Projekt umfasst einen WebSocket-Server, Spiel-Logik und einen Datenbank-Connector. Dieses Spiel ist im Rahmen einer Semesterarbeit während des Studiums entstanden. Das Spiel ist eine mögliche Umsetzung 
einer digitale-Variante des belibeten Kartenspiels Skull King. Die Anforderungen waren eine Client-Server-Architektur, ein Chat und eine DB-Speicherung. Da wir ohne einen externen Server arbeiteten, 
wird dieser durch den Ordner "Server" imitiert. Um das Spiel "spielen" zu können, braucht es mindestens zwei Browser-Fenster mit dem Spiel. Dieses Projekt wurde zu einem nicht-kommerziellen Lehrzweck erstellt.
Die darin verwendeten Bilder sind urheberrechtlich geschützt.
---
## Technologien

- HTML, CSS & JavaScript
- Client-Server-Architektur
- Kommunikation via Websocket
- Datenbank: MongoDB (nicht mehr online)
---
## Voraussetzungen

Stellen Sie vor der Einrichtung sicher, dass die folgenden Programme auf Ihrem System installiert sind:

1. **Node.js** (Version 16 oder höher) - [Node.js herunterladen](https://nodejs.org/)
2. **express** (Version 4.21.2 oder höher) - Ein minimalistisches Webframework für Node.js, das den Aufbau von Webanwendungen und APIs erleichtert.
3. **jquery** (Version 3.6.1 oder höher) - Eine JavaScript-Bibliothek, die das DOM-Manipulieren, Ereignismanagement und die AJAX-Kommunikation vereinfacht.
4. **ws** (Version 8.18.0 oder höher) - Ein WebSocket-Framework für Node.js, das die Echtzeit-Kommunikation zwischen Server und Client ermöglicht.
5. **mongoose** (Version 8.9.2 oder höher) optional - Ein MongoDB-Objektmodellierungstool für Node.js, das eine elegante API zur Interaktion mit MongoDB-Datenbanken bietet.

---

## Schritt 1: Repository klonen

Klonen Sie das Projekt-Repository auf Ihren lokalen Rechner mit folgendem Befehl:

```bash
git clone https://github.com/Simon-Wittker/skull_king_Spiel.git
```

Wechseln Sie in das Projektverzeichnis:

```bash
cd skull_king_Spiel
```

---

## Schritt 2: Abhängigkeiten installieren

Installieren Sie alle erforderlichen Abhängigkeiten mit folgendem Befehl:

```bash
npm install
```

---

## Schritt 3: Datenbank konfigurieren (optional)

Dieses Projekt kann entweder mit MongoDB oder einem lokalen In-Memory-Speicher betrieben werden. Standardmäßig ist die Datenbankverbindung deaktiviert.

1. **MongoDB aktivieren (optional)**
   - Öffnen Sie die Datei `db.js` im Ordner `server`.
   - Setzen Sie die `useMongoDB`-Einstellung im Konstruktor der `DBConnector`-Klasse auf `true`:
     ```javascript
     this.useMongoDB = true;
     ```
   - Passen Sie die Eigenschaft `uri` mit Ihrer MongoDB-Verbindungszeichenfolge an.

2. **Lokalen Speicher verwenden (Standard)**
   - Das Projekt verwendet den lokalen In-Memory-Speicher, wenn die `useMongoDB`-Einstellung auf `false` gesetzt ist.

---

## Schritt 4: WebSocket-Server starten / Spiel starten

Starten Sie den WebSocket-Server mit folgendem Befehl:

```bash
node server/server.js
```

Sie sollten eine Ausgabe wie folgt sehen:

```
WebSocket server is running on port 8080
```

Der WebSocket-Server verwaltet die Spielkommunikation zwischen den Clients.

Gleichzeitig öffnet sich ein Browserfenster mit dem Spiel. 

## Spiel testen

Sobald der Server läuft und der Client im Browser geöffnet ist:

1. Eröffnen sie ein Spiel oder treten Sie einer Spiel-Lobby bei.
2. Interagieren Sie mit anderen Spielern über die WebSocket-Verbindung.
3. Spielen Sie das Skull King Spiel!

---

## Fehlerbehebung

- **WebSocket-Verbindungsprobleme:**
  Stellen Sie sicher, dass der Server auf dem richtigen Port läuft (Standard: `8080`).

- **Datenbankfehler:**
  Wenn Sie MongoDB verwenden, stellen Sie sicher, dass die URI korrekt ist und die Datenbank zugänglich ist. Wenn Sie MongoDB nicht verwenden, stellen Sie sicher, dass `useMongoDB` auf `false` gesetzt ist.

- **Abhängigkeiten werden nicht installiert:**
  Löschen Sie den Ordner `node_modules` und die Datei `package-lock.json`, und führen Sie den folgenden Befehl erneut aus:
  ```bash
  npm install
  ```


