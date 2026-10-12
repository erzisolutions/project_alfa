# LA LINEA × ERZI EDITION · FINAL QA / BUILD REPORT
Datum: 12.10.2026

## Konačni status
**PASS** u testiranom opsegu za responzivni statički jelovnik + telefonski potvrđenu narudžbu. **NIJE** integrisani POS/checkout ili online plaćanje. Niti jedno testiranje ne dokazuje apsolutno odsustvo bugova.

## Funkcionalna pokrivenost
- [x] 95 stvarnih stavki, 14 kategorija, 74 fiksne cijene, 21 cijena „od”.
- [x] Nema proizvoda s nepoznatom konačnom cijenom u korpi.
- [x] Pretraga s dijakriticima, filteri, prazan rezultat, reset, učitavanje još.
- [x] Korpa +/−, obračun u cijelim feningima (integer arithmetic), spremanje u localStorage.
- [x] Mobilno otvaranje/zatvaranje dijaloga, fiksne akcije, pomičan sadržaj.
- [x] Izbor preuzimanje/dostava, obavezna adresa pri dostavi.
- [x] Kopiranje sažetka / rezervna kopija / native-share i tel: link.
- [x] Sačuvana jela u localStorage i osnovna navigacija tastaturom.
- [x] Kontrast sitnog teksta dodatno poboljšan poslije pregleda.
- [x] Preview izostavljen iz indeksacije, robots.txt blokiran do odobrenja.
- [x] Dry-run produkcijske kompilacije: canonical, Restaurant JSON-LD, sitemap i robots.
- [x] Fotografska podloga od 6 optimiziranih WebP datoteka, jasno kao ilustracije.
- [x] La Linea Points zaseban interni simulator, početni model i test promjene parametara.

## Browser matrix
| Veličina | Pretraga i kategorije | Korpa i validacija | JS greške | Horizontalni overflow |
|---|---|---|---|---|
| 320 × 640 | PASS | PASS | 0 | 0 |
| 390 × 844 | PASS | PASS | 0 | 0 |
| 768 × 1024 | PASS | PASS | 0 | 0 |
| 1440 × 900 | PASS | PASS | 0 | 0 |

Testovi su izvedeni pomoću Chromium/Playwright u renderiranom DOM-u iz istog produkcijskog HTML/CSS/JS. Zbog sigurnosnog ograničenja browser sandboxa nije bilo moguće izvršiti Playwright navigaciju na localhost, ali je lokalni HTTP server zasebno provjeren: 200 za HTML, CSS/JS i slike. Live performanse / Core Web Vitals i prodajni tok na pravoj domeni nisu mjerene.

## Veličine lokalnih modula
- HTML: 98,997 B.
- CSS: 18,054 B.
- JS: 10,479 B.
- WebP svih šest: 341,316 B.
- Jednofajlni demo: 661,931 B.

## Granice produkcijske spremnosti
**Može se hostati kao statički javni meni uz telefonski tok potvrde** nakon odobrenja vlasnika, korekcije eventualnih cijena, radnog vremena i zamjene ili autorizacije fotografija.

**Ne predstavlja live online naručivanje:** trenutno ne postoji serversko zaprimanje narudžbi, autentikacija, evidencija kupaca, online plaćanje, pretraga dostavnih zona ili aktivan Points saldo. To nisu „sitni bugovi” nego integracije s realnim poslovanjem koje nije moguće izmisliti.

## Izvor
https://www.lalineatuzla.com/jelovnik
https://www.lalineatuzla.com/en/contact
Javni podaci konsultovani 12.10.2026. Za 21 cijenu „od” nije izmišljena veličina ni nadoplata.