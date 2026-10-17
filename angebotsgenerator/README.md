# WERKWEB Angebotsgenerator V2 – reiner Demo-Modus

Die Dateien werden in einem öffentlichen GitHub-Repository verwaltet. Nach einer Freigabe können sie öffentlich erreichbar sein. noindex ist keine Zugriffssperre. **Nur fiktive Testdaten!** Keine echten Kundendaten oder freigegebenen Angebote. Im Browser werden Daten nur lokal verarbeitet, nicht an Gmail oder Formspree versendet.

## Formel – frei gewählte Testannahmen, keine empirischen Branchensätze

- Pakete: Starter 8 h, Plus 12 h, Premium 18 h
- Gewerkezuschlag: Elektro 2 h, SHK 3 h, Dach 3 h, Maler 2 h, Sonstige 4 h
- Zusätzliche Seiten ab Seite 5: je 2 h (1–4 Seiten haben dieselbe Grundzeit)
- Module: Kontakt 2 h; Galerie 3 h; Termin 6 h + 30 €; lokale SEO 3 h; zweite Sprache 6 h; Texte 4 h; Statistik 2 h; Hosting 2 h + 20 €
- Standard: interner Stundensatz 45 €, sonstige Einmalkosten 30 €, Risikopuffer 15 %
- Stunden = Paket + Gewerk + max(0, Seiten - 4) × 2 + Modulstunden
- Zwischensumme = Stunden × Stundensatz + sonstige Einmalkosten + Moduleinmalkosten
- Interne Kostenbasis = Zwischensumme × (1 + Risikopuffer/100)
- Kundenpreis = **nicht** berechnet. Erst nach Prüfung und Freigabe.

### Tests
1. Elektro Starter, 4 Seiten, Kontakt ⇒ 12 h × 45 € + 30 € = 570 €; + 15 % = **655,50 €**
2. SHK Plus, 7 Seiten, Galerie + lokale SEO ⇒ 27 h × 45 € + 30 € = 1.245 €; + 15 % = **1.431,75 €**
3. Dach Starter, 5 Seiten, Termin ⇒ 19 h × 45 € + 60 € = 915 €; + 15 % = **1.052,25 €**
4. Maler Premium, 4 Seiten, Galerie + Texte ⇒ 27 h × 45 € + 30 € = 1.245 €; + 15 % = **1.431,75 €**

Laufende Hosting-/Lizenzen, Steuerpflichten, Verwaltung, Versicherungen, Akquise, Nachbesserungen und Gewinn sind nicht vollständig enthalten. Das Ergebnis ist weder eine vollständige Selbstkostenkalkulation noch ein Verkaufspreis.

## Technik
- index.html – lokale Browseroberfläche (keine Übertragung)
- pricing.js – dieselbe deterministische Rechenlogik für Browser und Node.js
- test-pricing.cjs – 11 Testgruppen inklusive ungültiger Eingaben
- GitHub Actions testet bei Pull Requests. Lokal: node angebotsgenerator/test-pricing.cjs

## Verhältnis zur Gmail-Testüberwachung
Die Gmail-Automation ist separat und importiert diesen Code nicht. Wenn sich Parameter ändern, müssen die gespeicherten Berechnungsregeln im Automationsprompt synchronisiert werden. Eine produktive Integration erfordert einen geschützten Backend-Workflow, rechtliche Grundlagen und deine ausdrückliche Freigabe.
