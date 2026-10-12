# La Linea Tuzla × Erzi Edition V3

Nezvanični demonstracijski projekt restoranskog jelovnika za prezentaciju. Nije zvanična stranica restorana. **Nije povezan sa sistemom za zaprimanje narudžbi niti naplatom.**

## Funkcije
- 95 stavki u 14 kategorija; pretraga, filteri i sačuvana jela.
- Korpa za stavke s fiksnom cijenom, obračun i priprema teksta za telefonsku potvrdu.
- Stavke sa cijenom „od” zahtijevaju potvrdu cijene telefonom.
- Mobilna optimizacija i fotografije jasno označene kao ilustrativne.
- Odvojeni **La Linea Points** koncept koji nije aktivni program.

## Lokalno pokretanje

```sh
cd lalinea
python3 -m http.server 8000
```

Zatim otvoriti http://localhost:8000/. Statički hosting također radi. `robots.txt` isključuje indeksiranje dok vlasnik ne odobri objavljivanje.

## Struktura
- `index.html`, `app.css`, `app.js`: samostalni frontend.
- `assets/`: šest optimiziranih WebP ilustrativnih fotografija i SVG favicon.
- `source/menu.json`: izvoz stavki korištenih u stranici.
- `La_Linea_Points_KONCEPT.html`: zaseban finansijski simulator lojalnosti, ne uključen u javni UI.
- `QA_REPORT.md`: dokumentirani lokalni testovi.
- `robots.txt`, `_headers`: zaštitne postavke za probni statički hosting.

**Prije javne produkcije:** pribaviti odobrenje vlasnika, potvrditi jelovnik, cijene, slike, radno vrijeme i kontakt; zamijeniti ilustracije originalnim fotografijama, podesiti domen, SEO i testirati HTTPS hosting. Naplata i stvarno zaprimanje narudžbi nisu razvijeni.

Izvor javnih stavki: https://www.lalineatuzla.com/jelovnik (12.10.2026).
