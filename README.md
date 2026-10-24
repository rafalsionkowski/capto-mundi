# Capto Mundi

Album fotograficzny i dziennik podróży autorstwa Rafała Sionkowskiego.
Strona w języku angielskim, panel redakcyjny (CMS) pod `/admin`.

**Stack:** Next.js 16 · Payload CMS 3 (MIT) · PostgreSQL · bucket S3 na zdjęcia · Railway.

```
GitHub (main) ──push──▶ Railway
                         ├─ app    Next.js + Payload (strona, /admin, /api)
                         ├─ db     PostgreSQL
                         └─ bucket Storage Bucket (zdjęcia)
```

## Co jest w środku

| Obszar | Gdzie |
|---|---|
| Strony publiczne | `src/app/(frontend)` — `/`, `/albums`, `/albums/[slug]`, `/articles`, `/articles/[slug]` |
| Panel redakcyjny | `/admin` (Payload) |
| Modele danych | `src/collections` — **Trips** (albumy ze zdjęciami), **Articles** (artykuły + „Practical info"), **Media** (zdjęcia), **Users**; `src/globals` — **Site settings** |
| Migracje bazy | `src/migrations` (uruchamiane automatycznie przy starcie na Railway) |
| Wygląd | `src/app/(frontend)/styles.css` |

Wersje robocze: albumy i artykuły mają szkic/publikację. Odwiedzający widzą tylko opublikowane.

## Uruchomienie lokalne

Wymagania: Node.js 22+, PostgreSQL.

```bash
cp .env.example .env        # uzupełnij DATABASE_URL i PAYLOAD_SECRET
npm install
npx payload migrate         # tworzy tabele
npm run dev                 # http://localhost:3000, panel: /admin
```

Pierwsze wejście na `/admin` poprosi o utworzenie konta administratora.
Bez `BUCKET_NAME` zdjęcia zapisują się lokalnie w `./media` (nie trafiają do gita).

Po zmianie modeli danych (migracje twórz **zawsze** przez `npm run migrate:create`, które uwzględnia schemat z bucketem S3 — inaczej w bazie na Railway zabraknie kolumn):

```bash
npm run generate:types                  # odświeża src/payload-types.ts
npm run migrate:create nazwa_zmiany     # tworzy migrację — dołącz ją do commita
```

## Wdrożenie na Railway

1. **Nowy projekt** w Railway → *Deploy from GitHub repo* → wybierz to repozytorium. Każdy push do `main` wdraża stronę automatycznie.
2. **Baza:** w projekcie dodaj *PostgreSQL*.
3. **Zdjęcia:** w projekcie dodaj *Storage Bucket* (S3).
4. **Zmienne środowiskowe** usługi z aplikacją (Variables):

   | Zmienna | Wartość |
   |---|---|
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
   | `PAYLOAD_SECRET` | wynik `openssl rand -base64 32` |
   | `NEXT_PUBLIC_SERVER_URL` | publiczny adres strony, np. `https://captomundi.example` (bez `/` na końcu) |
   | `BUCKET_NAME` | nazwa bucketa z Railway |
   | `BUCKET_ACCESS_KEY_ID` | klucz dostępu z bucketa |
   | `BUCKET_SECRET_ACCESS_KEY` | sekret z bucketa |
   | `BUCKET_ENDPOINT` | endpoint S3 z bucketa |
   | `BUCKET_REGION` | region z bucketa (domyślnie `auto`) |

   Wartości dla bucketa weź ze zmiennych, które Railway pokazuje w jego ustawieniach (można je podpiąć jako referencje).
5. **Domena:** w ustawieniach usługi *Networking* → *Generate Domain* lub własna domena, potem ustaw ją w `NEXT_PUBLIC_SERVER_URL`.
6. Po pierwszym wdrożeniu wejdź na `/admin` i **od razu** załóż konto administratora.

Start produkcyjny (`railway.json`) najpierw wykonuje migracje, potem uruchamia aplikację.

## Bezpieczeństwo

- Sekrety tylko w zmiennych Railway, nigdy w repozytorium (`.env` jest w `.gitignore`).
- Zapis (tworzenie, edycja, usuwanie) tylko dla zalogowanych użytkowników; odwiedzający mają dostęp tylko do odczytu opublikowanych treści.
- Po utworzeniu konta administratora nie dodawaj kolejnych kont, jeśli nie są potrzebne.
- Dependabot co tydzień otwiera pull requesty z aktualizacjami — przeglądaj je i scalaj, bo CMS wymaga bieżących łatek.
- Zrób kopię zapasową bazy (sprawdź opcje swojego planu Railway) i trzymaj oryginały zdjęć poza Railway — bucket nie jest kopią zapasową.

## Zdjęcia — wskazówki

- Wgrywaj zdjęcia po eksporcie (ok. 3000 px po dłuższym boku, JPEG ~85%), nie pliki RAW.
- Payload sam tworzy trzy rozmiary (600, 1100 i 2000 px) i strona wybiera właściwy dla ekranu.
- Pole *alt* jest wymagane — opisuje zdjęcie dla czytników ekranu i wyszukiwarek.

## Licencja

Kod strony: MIT. Zdjęcia i teksty © Rafal Sionkowski.
