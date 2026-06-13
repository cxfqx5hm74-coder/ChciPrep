export interface ForeignOrg {
  name: string;
  country: string;
  logoColor: string;
  keyFeature: string;
  description: string;
  inspirationForCsap: string;
  webUrl: string;
}

export const FOREIGN_ORGANIZATIONS: ForeignOrg[] = [
  {
    name: "Terrence Higgins Trust (THT)",
    country: "Velká Británie 🇬🇧",
    logoColor: "from-pink-600 to-rose-600",
    keyFeature: "PrEP on Demand (2-1-1) & Online objednávání samotestů",
    description: "THT je největší sexuální charita v UK. Jsou průkopníky v de-stigmatizaci HIV. Nabízejí interaktivní kalkulačky dávkování a doručování testovacích sad poštou zdarma.",
    inspirationForCsap: "Zavedení poštovních samotestovacích balíčků pro odlehlé regiony ČR (např. Jesenicko, Vysočina).",
    webUrl: "https://www.tht.org.uk"
  },
  {
    name: "AIDES",
    country: "Francie 🇫🇷",
    logoColor: "from-blue-600 to-indigo-600",
    keyFeature: "Mobil'Dep live satelitní sledování sanitek",
    description: "AIDES provozuje rozsáhlou flotilu mobilních testovacích dodávek. Každá dodávka vysílá svou polohu v reálném čase, aby uživatelé v nouzi věděli, za jak dlouho sanitka dorazí do jejich čtvrti.",
    inspirationForCsap: "GPS sledování live polohy sanitky ČSAP na pražských a brněnských zastávkách přímo v mapě.",
    webUrl: "https://www.aides.org"
  },
  {
    name: "San Francisco AIDS Foundation (SFAF)",
    country: "USA 🇺🇸",
    logoColor: "from-amber-600 to-orange-600",
    keyFeature: "Partner Notification Portal & Express Testing",
    description: "SFAF v klinice Magnet nabízí 'express' samoobslužný screening bez nutnosti lékařského pohovoru (odběry hotové za 10 minut). Také vyvinuli portál pro zcela anonymní zaslání SMS bývalým partnerům o nutnosti otestování.",
    inspirationForCsap: "Integrovaný český anonymní SMS / e-mail odesílač pro informování kontaktů bez prozrazení identity.",
    webUrl: "https://www.sfaf.org"
  },
  {
    name: "Deutsche Aidshilfe",
    country: "Německo 🇩🇪",
    logoColor: "from-emerald-600 to-teal-500",
    keyFeature: "Buddy.hiv & PrEP-Jet navigátor lékáren",
    description: "Německá asociace zřídila Buddy systém, kde si lidé s diagnózou najdou osobního parťáka se stejným osudem pro první týdny, a interaktivní mapu lékáren, které mají reálně PrEP léky skladem s garancí nízké ceny.",
    inspirationForCsap: "Zrcadlení dostupnosti léků a garantovaných cen PrEPu v partnerských lékárnách ČSAP.",
    webUrl: "https://www.aidshilfe.de"
  }
];

// 2-1-1 PrEP Dosing Calculator
export interface DosingScheduleResult {
  doubleDoseTimeStart: string;
  doubleDoseTimeEnd: string;
  sexualIntercourseTime: string;
  firstFollowUpTime: string;
  secondFollowUpTime: string;
  summarySteps: {
    title: string;
    pillCount: number;
    timeLabel: string;
    description: string;
  }[];
}

export function calculate211Dosing(dateStr: string, timeStr: string): DosingScheduleResult {
  // Sestavení datumu styku
  const sexDate = new Date(`${dateStr}T${timeStr}`);
  
  // Dvojitá startovní dávka (26 hodin před až 2 hodiny před)
  // Standard WHO doporučuje 2 až 24 hodin PŘED stykem
  const startDouble = new Date(sexDate.getTime() - 24 * 60 * 60 * 1000);
  const endDouble = new Date(sexDate.getTime() - 2 * 60 * 60 * 1000);

  // První follow-up (24 hodin PO prvním užití, přibližně v čase styku další den)
  const firstFollowUp = new Date(sexDate.getTime()); // To je přesně 24h po ideálním double-dose středu

  // Druhý follow-up (24 hodin po prvním follow-up)
  const secondFollowUp = new Date(sexDate.getTime() + 24 * 60 * 60 * 1000);

  const formatOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  const fmt = (d: Date) => d.toLocaleDateString('cs-CZ', formatOptions);

  return {
    doubleDoseTimeStart: fmt(startDouble),
    doubleDoseTimeEnd: fmt(endDouble),
    sexualIntercourseTime: fmt(sexDate),
    firstFollowUpTime: fmt(firstFollowUp),
    secondFollowUpTime: fmt(secondFollowUp),
    summarySteps: [
      {
        title: "Dvojitá dávka (Pokrytí startu)",
        pillCount: 2,
        timeLabel: `${fmt(startDouble)} až ${fmt(endDouble)}`,
        description: "Vezměte si dvě pilulky PrEP naráz. Toto je nejdůležitější krok! Musí proběhnout v rozmezí 2 až 24 hodin před plánovaným sexem."
      },
      {
        title: "Samotný styk",
        pillCount: 0,
        timeLabel: fmt(sexDate),
        description: "Plánovaný styk. Váš organismus je nyní plně chráněn vysokou koncentrací účinné látky v sliznicích."
      },
      {
        title: "První kontrolní dávka",
        pillCount: 1,
        timeLabel: fmt(firstFollowUp),
        description: "Užijte přesně 1 pilulku PrEP, přibližně 24 hodin po požití nulté dvojité dávky."
      },
      {
        title: "Druhá kontrolní dávka",
        pillCount: 1,
        timeLabel: fmt(secondFollowUp),
        description: "Užijte poslední 1 pilulku PrEP, přesně 24 hodin po předchozí dávce (48 hodin po úvodní)."
      }
    ]
  };
}

// Partner notification SMS templates generator
export function generatePartnerSms(
  disease: string,
  dateOfExposure: string,
  style: 'polite' | 'direct' | 'soft'
): string {
  const dateInfo = dateOfExposure ? ` během našeho setkání přibližně ${dateOfExposure}` : '';
  
  if (style === 'polite') {
    return `Ahoj. Chci tě zprávou ohleduplně informovat, že mi byl nově diagnostikován ${disease}. Existuje riziko přenosu${dateInfo}. Doporučuji ti nechat se pro vlastní bezpečí bezplatně a anonymně otestovat. PrEP body a testovací místa po celé ČR najdeš na https://www.chciprep.cz. Držím palce, ať je to v pořádku.`;
  }
  
  if (style === 'soft') {
    return `Ahoj, dostal/a jsem se do situace, kdy ti musím napsat nepříjemnou věc. Mám pozitivní test na ${disease}. Protože jsme se viděli${dateOfExposure ? ' ' + dateOfExposure : ' v uplynulých týdnech'}, doporučuji zajít na rychlé krevní rychlotesty. Na webu chciprep.cz máš adresář všech bezplatných míst v Česku, je to rychlé a anonymní. Omlouvám se a přeji hodně sil.`;
  }
  
  // direct / informational
  return `Oznámení o zdravotním riziku: Osoba, se kterou jsi měl/a sexuální styk${dateInfo}, byla pozitivně testována na ${disease}. Důrazně ti doporučujeme absolvovat bezplatný anonymní test na HIV/STI v nejbližším CheckPointu ČSAP (adresář na chciprep.cz). Test zabere 10 minut a zajistí ti klid.`;
}
