# WERKWEB – Formspree-Ende-zu-Ende-Test (ausschließlich fiktiv)

Diese Teststrecke prüft, ob Formspree eine der vier synthetischen Testanfragen entgegennimmt und eine Benachrichtigung an Gmail auslöst. Die bestehende stündliche ChatGPT-Aufgabe erstellt daraus nur dann einen Entwurf, wenn die Authentifizierungs- und Eingabeprüfungen erfolgreich sind. Kein Kundenversand.

## Sicherheitsgrenzen
- **Keine echten Kunden, keine realen personenbezogenen Daten.** Feste Identität Musterwerk Testbetrieb (fiktiv) / Alex Beispiel (fiktiv) / werkweb-test@example.com.
- Kein HTML-Kontaktformular und kein öffentlich nutzbarer Endpoint in der Website.
- Der Versand ist niemals Teil von Push-/PR-Tests. Normale CI führt nur Vorschau und Validierung aus.
- Für tatsächliche Formspree-Testübermittlung sind ein manueller GitHub-Actions-Start sowie ein Repository-Secret nötig.
- Jeder Start versendet genau **eine** Testanfrage und generiert eine neue Test-ID. Formspree kann dennoch ggf. Rate-Limits, Spamfilter oder andere Beschränkungen haben.
- Keine Änderung an veröffentlichtem Hauptformular, keine Verarbeitung echter Kundeninformationen.
- Formular-E-Mail muss Formspree-seitig weiterhin genau den Betreff `[WERKWEB TEST] Projektanfrage` tragen; weitere Konfiguration kann nicht über GitHub vorgenommen werden.

## Vorbereitung für den manuellen Volltest
1. Unter `Settings → Secrets and variables → Actions → New repository secret` im GitHub-Repository ein Secret `WERKWEB_TEST_FORMSPREE_ENDPOINT` anlegen; Wert ist ausschließlich die Test-URL `https://formspree.io/f/<FORM_ID>`. Niemals API-Schlüssel oder Gmail-Passwörter eintragen.
2. Nach ausdrücklicher Freigabe den Pull Request zusammenführen, damit der manuelle Workflow im Standardbranch verfügbar wird.
3. Unter `Actions → WERKWEB Formspree Test (synthetisch) → Run workflow` ein Szenario auswählen (elektro / shk / dach / maler) und einmal starten.
4. Resultat prüfen: GitHub-Actions-Job erfolgreich? Neue Test-Mail von Formspree in `werkweb.studio@gmail.com`? Bei bestätigter passender E-Mail erstellt die stündliche Automation genau einen neuen internen Gmail-Entwurf ohne Empfänger. Kein automatisches Versenden.
5. Bei Fehler nur nach Prüfung erneut auslösen; jeder neue Lauf erhält eine neue Testreferenz und ist kein idempotenter Retry.

## Lokale Trockenprüfung (ohne Netzwerk)
`node angebotsgenerator/formspree-test.cjs --validate`

`node angebotsgenerator/formspree-test.cjs shk`

## Optional: Expliziter Versand ausschließlich fiktiver Daten in eigener Testumgebung
`WERKWEB_TEST_FORMSPREE_ENDPOINT=https://formspree.io/f/<TEST_FORM_ID> WERKWEB_ALLOW_SYNTHETIC_FORM_POST=YES node angebotsgenerator/formspree-test.cjs shk --send --confirm-test`

Dieser Befehl führt einen realen HTTP-POST **nur** gegen das Testformular aus und erzeugt einen tatsächlichen Benachrichtigungsvorgang. Nicht für echte Kunden verwenden.

## Ergebnisformat für den Test
- Alle Projekte haben dieselben unveränderlichen Testidentitäts- und Nachrichtenfelder und die unterschiedlichsten Gewerke, Pakete, Seitenzahlen und Zusatzmodule.
- Interne Basen: Elektro 655,50 €, SHK 1.431,75 €, Dach 1.052,25 €, Maler 1.431,75 €.
- Diese Beträge sind keine Verkaufspreise.
- Keine Garantie, dass ein angenommener HTTP-POST auch eine E-Mail erzeugt oder dass ein zukünftiger Automationslauf erfolgreich verarbeitet; dies wird erst durch Gmail-Kontrolle bestätigt.
