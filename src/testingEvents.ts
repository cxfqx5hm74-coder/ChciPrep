export interface FreeTestEvent {
  id: string;
  title: string;
  city: string;
  locationName: string;
  address: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "15:00 - 19:00"
  type: 'sanitka' | 'checkpoint' | 'akce';
  organizer: string;
  description: string;
}

export const FREE_TEST_EVENTS: FreeTestEvent[] = [
  {
    id: "evt-1",
    title: "Sanitka ČSAP v Letenských sadech (Praha)",
    city: "Praha",
    locationName: "Letenské sady (u Metronomu)",
    address: "Letenské sady, 170 00 Praha 7",
    date: "2026-06-15",
    time: "15:00 - 19:00",
    type: "sanitka",
    organizer: "Česká společnost AIDS pomoc",
    description: "Mobilní testovací sanitka ČSAP. Bezplatné, anonymní testování z kapky krve (HIV, syfilis, žloutenka B a C) s výsledky do 10 minut. Bez objednání."
  },
  {
    id: "evt-2",
    title: "Evropský týden testování - CheckPoint Dům Světla",
    city: "Praha",
    locationName: "Dům světla ČSAP",
    address: "Malého 282/3, Praha - Karlín 186 00",
    date: "2026-06-18",
    time: "12:00 - 18:00",
    type: "checkpoint",
    organizer: "ČSAP & Dům Světla",
    description: "Rozšířené bezplatné testování v rámci celoevropské kampaně. Komplexní poradenství s PrEP specialisty na místě zdarma."
  },
  {
    id: "evt-3",
    title: "Pride Warmup Party Brno - Mobilní testování",
    city: "Brno",
    locationName: "Klub Fléda (vstupní zóna)",
    address: "Štefánikova 24, 602 00 Brno",
    date: "2026-06-20",
    time: "20:00 - Midnight",
    type: "akce",
    organizer: "CheckPoint Brno",
    description: "Noční bezplatné testování před festivalem Pride. Rychlotesty s diskrétním poradenstvím pod širým nebem u naší sanitky."
  },
  {
    id: "evt-4",
    title: "Sanitka ČSAP na Karlově náměstí",
    city: "Praha",
    locationName: "Karlovo náměstí (u metra)",
    address: "Karlovo náměstí, 120 00 Praha 2",
    date: "2026-06-24",
    time: "14:00 - 18:00",
    type: "sanitka",
    organizer: "Česká společnost AIDS pomoc",
    description: "Pravidelná zastávka nejpopulárnější mobilní sanitky. Bezplatné slinové i krevní rychlotesty."
  },
  {
    id: "evt-5",
    title: "Letní akce testování Ostrava Stodolní",
    city: "Ostrava",
    locationName: "Stodolní ulice (pěší zóna)",
    address: "Stodolní, 702 00 Ostrava",
    date: "2026-06-27",
    time: "18:00 - 22:00",
    type: "sanitka",
    organizer: "CheckPoint Ostrava",
    description: "Preventivní noční akce zaměřená na mladé lidi v klubech. Rychlá a anonymní kontrola před začátkem dovolených."
  },
  {
    id: "evt-6",
    title: "Filmový festival Karlovy Vary - Sanitka Zdraví",
    city: "Karlovy Vary",
    locationName: "U hotelu Thermal",
    address: "I. P. Pavlova 11, 360 01 Karlovy Vary",
    date: "2026-07-04",
    time: "11:00 - 18:00",
    type: "akce",
    organizer: "ČSAP ve spolupráci s KVIFF",
    description: "Speciální festivalová preventivní zastávka. Zdarma testy, kondomy a osvěta o dostupnosti PrEP v ČR."
  },
  {
    id: "evt-7",
    title: "Mladý Kampus Dejvice - Den studentů",
    city: "Praha",
    locationName: "Národní technická knihovna (předzahrádka)",
    address: "Technická 6, 160 00 Praha 6",
    date: "2026-07-10",
    time: "10:00 - 15:30",
    type: "akce",
    organizer: "Dům Světla a ČVUT",
    description: "Bezplatné testování určené zejména pro studenty a mládež s poradenstvím ohledně dotačních programů ČSAP (do 26 let PrEP za 250 Kč)."
  },
  {
    id: "evt-8",
    title: "Sanitka ČSAP v Plzni u OC Plaza",
    city: "Plzeň",
    locationName: "OC Plzeň Plaza (vstup z parku)",
    address: "Radčická 2, 301 00 Plzeň",
    date: "2026-07-15",
    time: "15:00 - 19:00",
    type: "sanitka",
    organizer: "Zdravotní tým Plzeň ČSAP",
    description: "Mobilní sanitka s rychlým odběrem z prstu. Výsledky testů na HIV, Syfilis a Hepatitidy do deseti minut."
  }
];
