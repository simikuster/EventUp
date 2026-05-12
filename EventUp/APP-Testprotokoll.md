# APP-Testprotokoll – EventUp

# 1. Allgemeine Angaben

| Feld                                | Eintrag          |
| ----------------------------------- | ---------------- |
| Name / TN                           | DEIN NAME        |
| Klasse / Gruppe                     | DEINE KLASSE     |
| Projektname                         | EventUp          |
| Datum                               | 12.05.2026       |
| Lehrperson                          | LEHRPERSON       |
| App-Version / Build                 | v1.0             |
| Getestete Geräte                    | iPhone Simulator |
| Getestete Plattform                 | iOS / Expo Go    |
| Letzte Aktualisierung               | 12.05.2026       |
| Ordner für Screenshots              | /screenshots     |
| Link zum Repository / Projekt       | GitHub / Lokal   |
| Abgabe mit Gesamtprojekt am Schluss | Ja               |

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

# Übersicht pro Themenblock

| Bereich                    | Total | Ja | Nein | Offen |
| -------------------------- | ----: |---:|-----:| ----: |
| T1 Design & Geräte         |     6 |    |      |     0 |
| T2 Navigation & Bedienung  |     6 |    |      |     0 |
| T3 Login & Rechte          |     6 |    |      |     0 |
| T4 Datenquelle & Sync      |     6 |    |      |     0 |
| T5 CRUD & Formulare        |     6 |    |      |     0 |
| T6 Sensoren & Karten       |     6 |    |      |     0 |
| T7 Laufzeit & Robustheit   |     6 |    |      |     0 |
| T8 Veröffentlichung & Doku |     6 |    |      |     0 |
| Gesamt                     |    48 |    |      |     0 |

---

# 3. Detaillierte Testresultate

# T1 Design & Geräte

| Test-ID | Resultat | Screenshot / Beleg | Bemerkung                                                      |
| ------- |----------|--------------------|----------------------------------------------------------------|
| T1-A    | Ja       | T1-A.jpg           | App funktioniert im Hochformat                                 |
| T1-B    | Ja       | T1-B.jpg           | App funktioniert im Querformat,<br/> mit Navigationsbar links. |
| T1-C    | ...      | T1-C.jpg           | Layout auf Tablet getestet                                     |
| T1-D    | ...      | T1-D.jpg           | Tablet Querformat nicht optimiert                              |
| T1-E    | ...      | T1-E.jpg           | Safe Area funktioniert                                         |
| T1-F    | Ja       | T1-F.jpg           | Gute Lesbarkeit vorhanden<                                     |

---

# T2 Navigation & Bedienung

| Test-ID | Resultat | Screenshot / Beleg | Bemerkung                                                         |
| ------- |----------|--------------------|-------------------------------------------------------------------|
| T2-A    | Ja       | T1-A.jpg           | Startscreen funktioniert                                          |
| T2-B    | Ja       | T2-B.jpg           | Tabs funktionieren                                                |
| T2-C    | Ja       | T2-C.jpg           | Zurücknavigation funktioniert                                     |
| T2-D    | ...      | -                  | Keine Swipe Navigation umgesetzt,<br/> aufgrund des Responsivness |
| T2-E    | ...      | T2-E.jpg           | Bookmark Funktion vorhanden                                       |
| T2-F    | ...      | T2-F.jpg           | Schnellaktionen vorhanden                                         |

---

# T3 Login & Rechte

| Test-ID | Resultat | Screenshot / Beleg | Bemerkung                            |
| ------- |----------| ------------------ | ------------------------------------ |
| T3-A    | ...      | T3-A.jpg           | Registrierung erfolgreich            |
| T3-B    | ...      | T3-B.jpg           | Fehler bei falschem Login            |
| T3-C    | ...      | T3-C.jpg           | Logout funktioniert                  |
| T3-D    | ...      | T3-D.jpg           | Favoriten pro User getrennt          |
| T3-E    | ...      | -                  | Keine Gerätesensor Berechtigung      |
| T3-F    | ...      | -                  | Keine Sensorberechtigungen vorhanden |

---

# T4 Datenquelle & Sync

| Test-ID | Resultat | Screenshot / Beleg | Bemerkung                          |
| ------- |----------| ------------------ | ---------------------------------- |
| T4-A    | ...      | T4-A.jpg           | Firebase Daten werden geladen      |
| T4-B    | ...      | T4-B.jpg           | Fehler sichtbar ohne Internet      |
| T4-C    | ...      | T4-C.jpg           | Daten bleiben gespeichert          |
| T4-D    | ...      | T4-D.jpg           | Synchronisation funktioniert       |
| T4-E    | ...      | -                  | Keine Mehrfachbearbeitung getestet |
| T4-F    | ...      | T4-F.jpg           | Fehlerhandling vorhanden           |

---

# T5 CRUD & Formulare

| Test-ID | Resultat | Screenshot / Beleg | Bemerkung                       |
| ------- |----------| ------------------ | ------------------------------- |
| T5-A    | ...      | T5-A.jpg           | Eventliste lädt korrekt         |
| T5-B    | ...      | T5-B.jpg           | Event erstellen funktioniert    |
| T5-C    | ...      | T5-C.jpg           | Fehlermeldungen vorhanden       |
| T5-D    | ...      | -                  | Update Funktion nicht vorhanden |
| T5-E    | ...      | -                  | Delete Funktion nicht vorhanden |
| T5-F    | ...      | T5-F.jpg           | Daten verständlich dargestellt  |

---

# T6 Sensoren & Karten

| Test-ID | Resultat | Screenshot / Beleg | Bemerkung                      |
| ------- |----------| ------------------ | ------------------------------ |
| T6-A    | ...      | -                  | Keine Kartenfunktion           |
| T6-B    | ...      | -                  | Kein Kartenprovider integriert |
| T6-C    | ...      | -                  | Kein GPS verwendet             |
| T6-D    | ...      | -                  | Kein GPS verwendet             |
| T6-E    | ...      | -                  | Kein GPS verwendet             |
| T6-F    | ...      | T6-F.jpg           | Kamera / Bilderupload getestet |

---

# T7 Laufzeit & Robustheit

| Test-ID | Resultat | Screenshot / Beleg | Bemerkung                                |
| ------- |----------| ------------------ | ---------------------------------------- |
| T7-A    | ...      | T7-A.jpg           | Emulator funktioniert                    |
| T7-B    | ...      | T7-B.jpg           | Echtes Gerät getestet                    |
| T7-C    | ...      | T7-C.jpg           | Hintergrundverhalten stabil              |
| T7-D    | ...      | -                  | Querformat nicht optimiert               |
| T7-E    | ...      | T7-E.jpg           | Hardware Buttons funktionieren           |
| T7-F    | ...      | T7-F.jpg           | Unterschiedliche Displaygrössen getestet |

---

# T8 Veröffentlichung & Doku

| Test-ID | Resultat | Screenshot / Beleg | Bemerkung                     |
| ------- |----------| ------------------ | ----------------------------- |
| T8-A    | ...      | T8-A.jpg           | Appname und Version gesetzt   |
| T8-B    | ...      | T8-B.jpg           | Debug Build getestet          |
| T8-C    | ...      | -                  | Kein Release Build erstellt   |
| T8-D    | ...      | T8-D.jpg           | App Icon vorhanden            |
| T8-E    | ...      | T8-E.jpg           | Firebase Daten dokumentiert   |
| T8-F    | ...      | -                  | Kein Google Developer Account |

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
