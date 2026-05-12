# APP-Testprotokoll – EventUp

# 1. Allgemeine Angaben

| Feld                                | Eintrag            |
| ----------------------------------- |--------------------|
| Name                            | Noé, Rushan, Simon |
| Projektname                         | EventUp            |
| Datum                               | 12.05.2026         |
| Lehrperson                          | Michael Heinzmann  |
| App-Version / Build                 | v1.0               |
| Getestete Plattform                 | iOS / Expo Go      |
| Letzte Aktualisierung               | 12.05.2026         |
| Ordner für Screenshots              | /screenshots       |
| Link zum Repository / Projekt       | GitHub / Lokal     |
| Abgabe mit Gesamtprojekt am Schluss | Ja                 |

---

# 2. Schnellübersicht

| Punkt                                  | Eintrag                              |
| -------------------------------------- | ------------------------------------ |
| Gesamtstand der App                    | Funktionsfähig                       |
| Wichtigste Stärke                      | Modernes UI und Firebase Integration |
| Wichtigster Mangel                     | Noch keine Kartenfunktion            |
| Muss vor Abgabe noch korrigiert werden | Kleinere UI Optimierungen            |
| Optionaler nächster Ausbauschritt      | Push Notifications                   |

---

# 3. Detaillierte Testresultate

# T1 Design & Geräte

| Test-ID | Resultat | Screenshot / Beleg | Bemerkung                                                                                                                                          |
| ------- |----------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| T1-A    | Ja       | T1-A.jpg           | App funktioniert im Hochformat                                                                                                                     |
| T1-B    | Ja       | T1-B.jpg           | App funktioniert im Querformat,<br/> mit Navigationsbar links.                                                                                     |
| T1-C    | offen    | -                  | Wir haben es am Anfang mal getestet da hat es gut funktioniert, nun konnten wir es aufgrund eines imports im browser auf Tablet-View nicht testen. |
| T1-D    | offen    | -                  | Gleiche Begründung wie zuvor ->                                                                                                                    |
| T1-E    | Ja       | T1-E.jpg           | Safe Area funktioniert, es wird nichts verschoben auch nach dem Erstellen von Events.                                                              |
| T1-F    | Ja       | T1-F.jpg           | Gute Lesbarkeit vorhanden<                                                                                                                         |

---

# T2 Navigation & Bedienung

| Test-ID | Resultat | Screenshot / Beleg | Bemerkung                                                                                  |
| ------- |----------|--------------------|--------------------------------------------------------------------------------------------|
| T2-A    | Ja       | T1-A.jpg           | Startscreen funktioniert                                                                   |
| T2-B    | Ja       | T2-B.jpg           | Tabs funktionieren                                                                         |
| T2-C    | Ja       | T2-C.jpg           | Zurücknavigation funktioniert                                                              |
| T2-D    | Ja       | T2-D               | Ja wir haben eine Swipe Navigation, so wie ein seitliches Menü für die Querformat ansicht. |
| T2-E    | Ja       | -                  | Wir haben als Zusatzoption "Bookmark" in unserer App integriert.                           |
| T2-F    | Ja       | -                  | Wir haben eine Tab-Logik in unserer App verwendet.                                         |

---

# T3 Login & Rechte

| Test-ID | Resultat | Screenshot / Beleg    | Bemerkung                                                                                     |
| ------- |----------|-----------------------|-----------------------------------------------------------------------------------------------|
| T3-A    | Ja       | T3-A1.jpg / T3-A2.jpg | Registrierung erfolgreich                                                                     |
| T3-B    | Ja       | T3-B.jpg              | Fehler bei falschem Login                                                                     |
| T3-C    | Ja       | T3-C1.jpg / T3-C2.jpg | Logout funktioniert                                                                           |
| T3-D    | Ja       | T3-D1.jpg / T3-D2.jpg | Favoriten pro User getrennt                                                                   |
| T3-E    | Ja       | -                     | Ja wir haben für den Admin eine Löschberechtigung hinzugefügt, die entsprechend funktioniert. |

---

# T4 Datenquelle & Sync

| Test-ID | Resultat | Screenshot / Beleg | Bemerkung                                                                                                                                           |
| ------- |----------|--------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| T4-A    | Ja       | -                  | Firebase Daten werden korrekt geladen, bilder werden von unserem Server geladen.                                                                    |
| T4-B    | Ja       | -                  | Die App funktioniert auch ohne Internet ausser die Eventbilder werden nicht angezeigt aufgrund des Server der im Offlinemodus nicht erreichbar ist. |
| T4-C    | Ja       | T4-C.jpg           | Daten bleiben in der Datenkbank gespeichert und sind auch bei einem Neustart vorhanden.                                                             |
| T4-E    | Ja       | -                  | Wir haben das Prinzip „First Write Wins“ verwendet. Das bedeutet, dass die erste gespeicherte Änderung übernommen wird.                             |
| T4-F    | Ja       | T4-F.jpg           | Fehlerhandlung vorhanden                                                                                                                            |

---

# T5 CRUD & Formulare

| Test-ID | Resultat | Screenshot / Beleg    | Bemerkung                                         |
| ------- |----------|-----------------------|---------------------------------------------------|
| T5-A    | Ja       | T5-A1.jpg / T5-A2.jpg | Eventliste lädt korrekt, inklusive leerem Zustand |
| T5-B    | Ja       | T5-B1.jpg / T5-B2.jpg | Erstellung von Event und User funktioniert        |
| T5-C    | Ja       | T3-B.jpg              | Fehlermeldungen vorhanden                         |
| T5-D    | Nein     | -                     | Update Funktion nicht vorhanden                   |
| T5-E    | Ja       | T5-E.jpg              | Delete Funktion funktioniert                      |
| T5-F    | Ja       | -                     | Die Daten werden benutzerfreundlich und übersichtlich in der App dargestellt.                    |

---

# T6 Sensoren & Karten

| Test-ID | Resultat | Screenshot / Beleg | Bemerkung                                                        |
| ------- |----------|--------------------|------------------------------------------------------------------|
| T6-A    | Ja       | T6-A.jpg           | Kamera / Bilderupload getestet                                   |
| T6-B    | Ja       | T6-B.jpg           | Bild kann aus der Galerie oder mit der Kamera aufgenohmen werden |


---

# T7 Laufzeit & Robustheit

| Test-ID | Resultat | Screenshot / Beleg | Bemerkung                               |
| ------- |----------|--------------------|-----------------------------------------|
| T7-A    | Ja       | T7-A.jpg           | App startet in der Entwicklungsumgebung |
| T7-B    | Ja       | T7-B.jpg           | Echtes Gerät getestet                   |
| T7-C    | Ja       | T7-B.jpg           | Hintergrundverhalten stabil             |
| T7-D    | Ja       | T7-D.jpg           | Querformat optimiert                    |
| T7-E    | nein     | -                  | In IOS keine Hardwaretasten             |
| T7-F    | Ja       | -                  | DIe App wurde nur für IOS getestet      |

---

# T8 Veröffentlichung & Doku

| Test-ID | Resultat | Screenshot / Beleg | Bemerkung                                                |
| ------- |----------|--------------------|----------------------------------------------------------|
| T8-A    | Ja       | T8-A.jpg           | Appname und Version gesetzt                              |
| T8-D    | Ja       | T8-D.jpg           | App Icon vorhanden                                       |
| T8-E    | Ja       | -                  | Für unser Projekt haben wir die MIT License verwendet. Diese Lizenz erlaubt es anderen Personen, die Software frei zu verwenden, zu kopieren, zu verändern und weiterzugeben.                              |
| T8-F    | Nein     | -                  | Nicht veröffentlicht, weil kein Google Developer Account |

---

# 4. Schlussbewertung

## Was funktioniert bereits gut?

* Firebase Login
* Eventverwaltung
* Modernes UI
* Navigation
* Favoritenfunktion
* Realtime Datenbank

## Wo bestehen noch Risiken?

* Keine Kartenintegration
* Kein Release Build
* Keine Delete Funktion

## Welche drei Punkte werden als Nächstes verbessert?

1. Kartenfunktion integrieren
2. Event bearbeiten/löschen
3. Android Release Build erstellen
