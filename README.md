# HR Candidate Pipeline

Frontend aplikacija za interni HR tim koja omogućava pregled i upravljanje kandidatima kroz hiring pipeline.

Aplikacija podržava:
- pregled liste kandidata
- pregled detalja kandidata
- promjenu statusa kandidata uz definirana business pravila
- dodavanje bilješki
- kreiranje follow-up aktivnosti
- prikaz aktivnosti kroz timeline
- obradu ključnih UX stanja kao što su loading, empty, error i unsaved changes warning

## Tehnologije

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- TailwindCSS
- shadcn/ui
- Vitest

## Pokretanje projekta

### Preduvjeti
- Node.js 18+
- npm

### Instalacija paketa potrebnih za pokretanje
```bash
npm install
```

### Pokretanje development servera
```bash
npm run dev
```

### Pokretanje testova
```bash
npm run test
```

## Struktura projekta

Projekt koristi feature-based organizaciju koda:

```txt
src/
├── app/                  # Inicijalizacija aplikacije - postavke rutera i globalnih providera 
├── components/           # UI komponente opće namjene i Layout dijeljeni kroz aplikaciju ('dumb' components)
│   ├── ui/
│   └── shared/
├── core/                 # Centralna arhiva aplikacijske domene - globalni Typeovi i Zod modeli
├── features/             # Kontejner feature direktorija. Ovdje je smješten glavni paket.
│   └── candidates/       # Paket 'kadidata'
│       ├── api/          # React Query hookovi za spajanje sa vanjskim svijetom i API service sloj
│       ├── components/   # UI Komponente rezervirane eksplicitno samo za feature listanja/detalja
│       ├── hooks/        # Domenski specifični React utility hookovi (forme, URL state, unsaved prevention)
│       │   ├── list/
│       │   └── details/
│       ├── schemas/      # Lokalni Zod obrasci (status forme, follow up taskovi)
│       ├── types/        # TypeScript sučelja specifična za liste kandidata
│       └── utils/        # Specifične helper funkcije, uključujući mock filtere i sort
├── hooks/                # Globalni utility react hookovi (kao što je debounce za search input)
├── mocks/                # JSON fajl sa podacima i custom mock `dbClient` za simuliranje async latencije servera
└── pages/                # Top-level komponente, rute koje slažu cjelokupni UI koristeći "features" module
```

## Testiranje

Dio poslovnih pravila i pomoćnih funkcija pokriven je Vitest testovima. Testirani su:
- validacija bilješki kroz NoteFormSchema
- validacija follow-up aktivnosti kroz FollowUpSchema
- validacija promjene statusa kroz StatusUpdateSchema
- filtriranje kandidata kroz filterCandidates
- sortiranje kandidata kroz sortCandidates

Testovi pokrivaju pozitivne i negativne scenarije, uključujući obavezna polja, maksimalnu duljinu bilješke, zabranu prošlih datuma te pravila za status Offer i Rejected.

## Implementirane funkcionalnosti

### Lista kandidata
- pretraga po imenu i email adresi
- filter po statusu
- filter po senioritetu
- filter po recruiter/owner korisniku
- sortiranje po datumu zadnje aktivnosti
- sortiranje po scoreu
- klijentska paginacija / segmentacija prikaza liste

### Detalji kandidata
- osnovni podaci o kandidatu
- profesionalni summary
- prikaz skillova i tagova
- timeline aktivnosti
- notes sekcija
- follow-up sekcija
- upravljanje statusom kandidata

### Pravila za promjenu statusa
- status `Rejected` zahtijeva razlog odbijanja
- status `Offer` zahtijeva unos očekivane plaće
- kandidat sa statusom `Hired` više ne može mijenjati status

### Notes
- tekst bilješke je obavezan
- maksimalna dužina je 500 znakova
- podržan je opcionalni internal-only flag
- sprema se datum kreiranja bilješke

### Follow-up aktivnosti
- naslov je obavezan
- datum je obavezan
- assigned recruiter je obavezan
- datum ne može biti u prošlosti

### UX i edge caseovi
- loading state
- empty state
- no search results state
- error state
- upozorenje za nespremljene promjene na detail stranici

## Ključne tehničke odluke

### 1. Odabir Vite build tool-a
Odabrao sam Vite kao build tool jer zadatak eksplicitno navodi da backend nije potreban i da podaci dolaze iz lokalnog mock JSON fajla. Vite nudi brži development server i lakši setup u usporedbi s drugim build tool-ovima, bez nepotrebne složenosti SSR-a koje u ovom projektu ne bi bilo iskorišteno. Time je fokus ostao na samoj frontend logici i business pravilima.

### 2. Feature-based arhitektura
Projekt je organiziran po featureima, a ne samo po tehničkim slojevima. Na taj način su komponente, hookovi, query logika, schemas i pomoćne funkcije vezane za domenu kandidata smještene na jednom mjestu, što olakšava održavanje i daljnji razvoj.

### 3. Service layer iznad lokalnog mock JSON-a
Iako podaci dolaze iz lokalnog JSON fajla, UI ne radi direktno nad tim fajlom. Uveden je service layer koji simulira async backend pozive. Time je prezentacijski sloj odvojen od izvora podataka, a prelazak na stvarni API u budućnosti postaje jednostavniji.

### 4. TanStack Query za upravljanje server-stateom
Podaci o kandidatima tretirani su kao server-state. TanStack Query se koristi za dohvat, cacheiranje, invalidaciju i mutacije. Time su loading i error stanja konzistentna, a osvježavanje podataka nakon izmjena predvidljivo.

### 5. React Hook Form + Zod
Forme su implementirane pomoću React Hook Form biblioteke, dok je validacija izdvojena u Zod sheme. Time su business pravila validacije odvojena od prikaza i interakcijske logike.

### 6. Separation of concerns
Kod je podijeljen tako da:
- komponente primarno renderiraju UI
- hookovi upravljaju interakcijom, form stateom i mutacijama
- schemas definiraju validaciju
- utility fajlovi sadrže čiste pomoćne funkcije
- api/service sloj upravlja dohvatom i izmjenom podataka

### 7. URL kao izvor stanja za listu
Filteri, sortiranje i paginacija liste zamišljeni su tako da budu kompatibilni s URL parametrima. Time se čuva korisnički kontekst prilikom navigacije između liste i detail stranice.

### 8. Timeline kao eksplicitni zapis aktivnosti
Timeline je modeliran kroz zasebne `timelineEvents` zapise, umjesto da se kompletna povijest pokušava rekonstruirati isključivo iz notes i follow-up podataka. Na taj način pipeline događaji ostaju eksplicitni i jasni. Istovremeno se na kandidatu vodi i `lastActivityAt` kao denormalizirano polje zbog efikasnog sortiranja liste.

## Pretpostavke

- Detail view je implementiran kao zasebna stranica, jer je zadatak dopuštao drawer, modal ili posebnu stranicu.
- Filtriranje, sortiranje i paginacija rade klijentski jer projekt koristi lokalni mock JSON i ne zahtijeva backend.
- `lastActivityAt` ostaje polje na kandidatu radi jednostavnijeg i efikasnijeg sortiranja, dok `timelineEvents` predstavljaju detaljniji audit/history sloj.
- Timeline sadrži eksplicitne pipeline događaje, a može uključivati i određene korisničke akcije kao što su dodavanje bilješke ili follow-up aktivnosti.
- Follow-up completion nije tretiran kao obavezna funkcionalnost jer zadatak eksplicitno traži kreiranje follow-up aktivnosti, ali ne i njihovo označavanje kao dovršenih.
- Status prijelazi nisu strogo ograničeni linearnim workflowom osim u dijelu business pravila koji je eksplicitno definiran zadatkom.

## Poznata ograničenja

- Podaci se mijenjaju samo u memoriji tijekom trajanja sesije i ne upisuju se natrag u stvarni JSON fajl.
- Filtriranje, sortiranje i paginacija rade na klijentu, što nije optimalno za velike skupove podataka.
- Timeline model je pojednostavljen i ne pokriva sve moguće audit događaje koje bi produkcijski sustav vjerojatno pratio.
- Unsaved changes zaštita pokriva implementirane editable sekcije i trebalo bi je proširiti ako se uvedu dodatne forme.
- Ne postoji autentikacija, autorizacija ni role-based access control.
- Testovi nisu bili glavni fokus rješenja i mogu se dodatno proširiti.

## Što bi se dalje unaprijedilo u produkcijskom sustavu

- zamjena mock service layera stvarnim backend API-jem i perzistentnom bazom podataka
- server-side filtriranje, sortiranje i paginacija
- formalniji audit log / activity model za sve izmjene nad kandidatom
- proširenje follow-up funkcionalnosti na editiranje, completion, podsjetnike i reassignment
- proširenje testova
- role-based permissions između recruitera, hiring managera i administratora
- feedback pattern za uspješne i neuspješne mutacije, uključujući toast notifikacije
- implementavija logginga i praćenja grešaka

## Napomena

Rješenje je svjesno fokusirano na arhitekturu, separation of concerns, održivost koda i jasnoću implementacije business pravila, što je bilo važnije od finalnog vizualnog polisha u samom zadatku. Podaci se učitavaju iz lokalnog mock JSON fajla uz simulaciju async ponašanja kroz service layer, što je također eksplicitno traženo zadatkom.