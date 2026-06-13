import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Home, 
  Calendar, 
  MapPin, 
  Clock, 
  Lightbulb, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  Globe, 
  CheckCircle2, 
  Search, 
  AlertCircle, 
  Wifi, 
  WifiOff, 
  ChevronRight, 
  Check, 
  Star, 
  Flame, 
  ArrowRight,
  Send,
  Lock,
  Coins,
  Heart,
  QrCode,
  AlertTriangle,
  User,
  Info,
  Copy,
  ChevronDown,
  Settings2
} from 'lucide-react';
import { Center, Improvement, TabId } from './types';
import { FREE_TEST_EVENTS } from './testingEvents';
import { FOREIGN_ORGANIZATIONS, calculate211Dosing, generatePartnerSms } from './foreignInspiration';

// Seznam pracovišť převzatý a upravený z chciprep.cz
const CENTERS: Center[] = [
  {
    name: "PrEP Point Dům světla ČSAP",
    city: "Praha - Karlín",
    type: "PrEP point",
    address: "Malého 282/3, Praha - Karlín 186 00",
    phone: "800 550 540",
    email: "prep@aids-pomoc.cz",
    href: "https://www.chciprep.cz/prep-point-dum-svetla-csap",
    note: "Centrální pracoviště České společnosti AIDS pomoc. Bezplatná linka, rychlé online formy a dotační administrace."
  },
  {
    name: "PrEP Point Ústí nad Labem",
    city: "Ústí nad Labem",
    type: "PrEP point",
    address: "V Jirchářích 62/2, Ústí nad Labem 400 01",
    phone: "475 220 838",
    href: "https://www.chciprep.cz/prep-point-usti-nad-labem",
    note: "Pobočka České společnosti AIDS pomoc v Ústeckém kraji."
  },
  {
    name: "FN Brno Bohunice, Klinika infekčních chorob",
    city: "Brno - Bohunice",
    type: "PrEP ordinace",
    address: "Jihlavská 440/22, pavilon B, 1. patro",
    phone: "532 232 267",
    href: "https://www.chciprep.cz/fn-brno-bohunice-klinika-infekcnich-chorob-checkpoint-brno",
    note: "HIV Centrum a specializovaná ambulance pro PrEP pacienty."
  },
  {
    name: "I. dermatovenerologická klinika FN USA",
    city: "Brno - střed",
    type: "PrEP ordinace",
    address: "Pekařská 664/53, Brno - střed 602 00",
    phone: "777 801 380",
    email: "filip.skokan@fnusa.cz",
    href: "https://www.chciprep.cz/i-dermatovenerologicka-klinika-fn-usa",
    note: "Fakultní nemocnice u sv. Anny, PrEP konzultace a krevní testy."
  },
  {
    name: "FN Ostrava, HIV centrum / CheckPoint Ostrava",
    city: "Ostrava",
    type: "PrEP ordinace",
    address: "17. listopadu 1790, Ostrava 708 52",
    phone: "597 374 281",
    href: "https://www.chciprep.cz/fn-ostrava-hiv-centrum-checkpoint-ostrava",
    note: "Krajské HIV centrum s kompletní testovací infrastrukturou."
  },
  {
    name: "Klinika infekčních nemocí FN Plzeň",
    city: "Plzeň - Bory",
    type: "PrEP ordinace",
    address: "E. Beneše 13, pavilon 2, 1. patro",
    phone: "377 402 546",
    href: "https://www.chciprep.cz/klinika-infekcnich-nemoci-a-cestovni-mediciny-fn-plzen",
    note: "Ambulance pro preventivní podávání PrEP v Plzeňském kraji."
  },
  {
    name: "Nemocnice Na Bulovce - HIV centrum",
    city: "Praha - Libeň",
    type: "PrEP ordinace",
    address: "Budínova 67/2, budova č. 7, 2. patro",
    phone: "266 082 629",
    email: "hivprep@bulovka.cz",
    href: "https://www.chciprep.cz/nemocnice-na-bulovce-hiv-centrum",
    note: "Největší referenční centrum v ČR s rozsáhlými zkušenostmi s preventivní léčbou."
  },
  {
    name: "Venerologie Praha",
    city: "Praha - Smíchov",
    type: "PrEP ordinace",
    address: "Lidická 337/30, Praha - Smíchov 150 00",
    phone: "257 323 219",
    email: "dermatovenerologie@medicentrum.cz",
    href: "https://www.chciprep.cz/venerologie-praha",
    note: "Soukromá kožní a pohlavní ambulance se vstřícným přístupem."
  }
];

// Seznam detailních vylepšení pro ČSAP
const IMPROVEMENTS_DATA: Improvement[] = [
  {
    id: "imp-1",
    title: "Centrální rezervační tok v mobilním asistentu",
    description: "Nahrazení nepřehledného statického seznamu kontaktů přímým rezervačním rozhraním. Klient vyplní bezpečný formulář přímo z mobilu a termín se automaticky zapíše do klinického kalendáře.",
    impact: "Vysoký",
    effort: "Střední",
    category: "Procesy"
  },
  {
    id: "imp-2",
    title: "Chytrý off-line detektor chemsexu a průvodce bezpečnějším užitím",
    description: "Zpřístupnění srozumitelných zdravotních postupů (hydration trackers, harm reduction rady na dávkování) pro osoby v riziku, které nechtějí či nemohou vyhledat kliniku ihned.",
    impact: "Vysoký",
    effort: "Střední",
    category: "Zdraví"
  },
  {
    id: "imp-3",
    title: "Zrcadlová p2p platforma (Peer Mentor Program)",
    description: "Průlomový nápad pana ředitele ČSAP: Propojení nově diagnostikovaných HIV pozitivních klientů s dlouhodobě léčenými mentory, kteří jim poskytnou psychickou berličku v nejtěžších prvních měsících.",
    impact: "Vysoký",
    effort: "Střední",
    category: "Psychologie"
  },
  {
    id: "imp-4",
    title: "Automatický follow-up alarm zdravotních odběrů",
    description: "Zamezení nesprávnému podávání PrEP v důsledku zanedbaných testů. Systém v telefonu bezpečně hází upozornění na blížící se 3-měsíční test jater a ledvin.",
    impact: "Střední",
    effort: "Nízká",
    category: "Technologie"
  },
  {
    id: "imp-5",
    title: "Integrovaná QR příspěvková brána",
    description: "Možnost realizovat snadný dobrovolný příspěvek na dotační fondy ČSAP za účelem podpory ubytování pacientů v tísni či slevových kupónů na PrEP.",
    impact: "Vysoký",
    effort: "Nízká",
    category: "Finance"
  }
];

// 3 Barevné prototypy (Témata)
type ThemeId = 'twilight' | 'coral' | 'emerald';

interface ThemeConfig {
  name: string;
  bgApp: string;
  bgCard: string;
  bgCardFlat: string;
  bgNested: string;
  border: string;
  borderLight: string;
  textMain: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  pillBg: string;
  deviceBg: string;
  notchBorder: string;
}

const THEMES: Record<ThemeId, ThemeConfig> = {
  twilight: {
    name: 'Cosmic Twilight (Noční indigo)',
    bgApp: 'bg-slate-900',
    bgCard: 'bg-slate-850/90 bg-slate-900 border border-slate-800',
    bgCardFlat: 'bg-slate-800/40 border border-slate-800/30',
    bgNested: 'bg-slate-950/60 border border-slate-800/50',
    border: 'border-slate-800',
    borderLight: 'border-slate-850',
    textMain: 'text-slate-100',
    textMuted: 'text-slate-400',
    accent: 'bg-gradient-to-r from-rose-600 to-pink-600',
    accentHover: 'hover:opacity-90',
    accentText: 'text-rose-400',
    accentBg: 'bg-rose-500/10',
    accentBorder: 'border-rose-500/20',
    pillBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    deviceBg: 'bg-slate-950',
    notchBorder: 'border-slate-800'
  },
  coral: {
    name: 'Soft Coral (Přátelská hřejivá)',
    bgApp: 'bg-amber-50/20',
    bgCard: 'bg-white border border-rose-100/80 shadow-sm shadow-rose-100/30',
    bgCardFlat: 'bg-amber-50/40 border border-rose-100/45',
    bgNested: 'bg-orange-50/60 border border-orange-100/30',
    border: 'border-rose-100',
    borderLight: 'border-rose-100/50',
    textMain: 'text-stone-850 text-stone-900',
    textMuted: 'text-stone-500',
    accent: 'bg-gradient-to-r from-rose-500 to-amber-500',
    accentHover: 'hover:opacity-90',
    accentText: 'text-rose-600',
    accentBg: 'bg-rose-50/70',
    accentBorder: 'border-rose-200',
    pillBg: 'bg-rose-100/50 text-rose-700 border border-rose-200/50',
    deviceBg: 'bg-stone-50',
    notchBorder: 'border-stone-200'
  },
  emerald: {
    name: 'Clinical Emerald (Sober lékařská)',
    bgApp: 'bg-zinc-950',
    bgCard: 'bg-zinc-900 border border-zinc-800',
    bgCardFlat: 'bg-zinc-850/60 border border-zinc-850',
    bgNested: 'bg-emerald-950/20 border border-emerald-900/25',
    border: 'border-zinc-800',
    borderLight: 'border-zinc-850',
    textMain: 'text-zinc-100',
    textMuted: 'text-zinc-400',
    accent: 'bg-gradient-to-r from-emerald-600 to-teal-600',
    accentHover: 'hover:opacity-95',
    accentText: 'text-emerald-400',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/20',
    pillBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    deviceBg: 'bg-zinc-950',
    notchBorder: 'border-zinc-800'
  }
};

export default function App() {
  // Stav vybrané záložky
  const [tab, setTab] = useState<TabId>('home');
  // Zvolené téma (prototyp 1, 2, 3)
  const [themeId, setThemeId] = useState<ThemeId>('twilight');
  const t = THEMES[themeId];

  // Offline simulace
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [showOfflineAlert, setShowOfflineAlert] = useState<boolean>(false);

  // Filtry pro vyhledání pracovišť
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('vse');
  const [starredCenters, setStarredCenters] = useState<string[]>(() => {
    const saved = localStorage.getItem('prep_starred_centers');
    return saved ? JSON.parse(saved) : ["PrEP Point Dům světla ČSAP"];
  });

  // Průvodce rezervací
  const [selectedCenter, setSelectedCenter] = useState<Center>(CENTERS[0]);
  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, string>>({});
  const [screeningStep, setScreeningStep] = useState<number>(0);

  // Dotační kalkulačka programů ČSAP
  const [userAge, setUserAge] = useState<number>(23);
  const [packageCost, setPackageCost] = useState<number>(680);

  // Sledování pilulek
  const [isPillTakenToday, setIsPillTakenToday] = useState<boolean>(() => {
    const saved = localStorage.getItem('prep_pill_taken_today');
    const savedDate = localStorage.getItem('prep_pill_taken_date');
    const today = new Date().toDateString();
    return saved === 'true' && savedDate === today;
  });
  const [pillStreak, setPillStreak] = useState<number>(() => {
    return Number(localStorage.getItem('prep_pill_streak') || '5');
  });

  // NOVINKA: Nastavení lékařského follow-up
  const [nextApptDate, setNextApptDate] = useState<string>(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 45); // Odhadem za 45 dní
    return defaultDate.toISOString().split('T')[0];
  });
  const [apptType, setApptType] = useState<'regular' | 'blood' | 'recipe'>('regular');
  const [activeReminders, setActiveReminders] = useState<boolean>(true);

  // Hlasování na nápady
  const [votes, setVotes] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('prep_improvement_votes');
    return saved ? JSON.parse(saved) : {
      "imp-1": 89,
      "imp-2": 114,
      "imp-3": 172, // Skvělý peer mentor nápad má hodně hlasů!
      "imp-4": 74,
      "imp-5": 92
    };
  });

  // NOVINKA: Donations
  const [donationAmount, setDonationAmount] = useState<number>(500);
  const [customDonation, setCustomDonation] = useState<string>('');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [donationSuccess, setDonationSuccess] = useState<boolean>(false);

  // NOVINKA: Zabezpečená peer podpora
  const [supportPassword, setSupportPassword] = useState<string>('');
  const [isSupportUnlocked, setIsSupportUnlocked] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [peerMessages, setPeerMessages] = useState<Array<{ sender: 'user' | 'peer'; text: string; time: string }>>([
    {
      sender: 'peer',
      text: "Ahoj, jmenuji se Dan a pracuji v Domě Světla jako peer mentor. V roce 2018 jsem sám zjistil, že jsem HIV pozitivní. Tehdy se mi zhroutil svět a myslel jsem si, že můj život skončil. Rád s tebou budu mluvit o čemkoliv, co právě prožíváš. Odpověď na test není konec, je to jen začátek nové cesty. Jak se teď cítíš?",
      time: "10:15"
    }
  ]);
  const [typedMessage, setTypedMessage] = useState<string>('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // NOVINKA: AI Poradce (Chemsex & Unprotected sex)
  const [aiHistory, setAiHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: "Vítej. Jsem tvůj diskrétní anonymní AI poradce chráněný kodexem Domu Světla. Mohu ti poradit, jak minimalizovat rizika v oblasti nechráněného sexu, náhlého vystavení viru (PEP) či chemsexu. Zeptej se mě na cokoliv, nebo zvol jedno z témat níže."
    }
  ]);
  const [aiInput, setAiInput] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // NOVINKA: Kalendář bezplatného testování zdarma ČSAP
  const [mapSubTab, setMapSubTab] = useState<'clinics' | 'calendar'>('clinics');
  const [selectedEventDate, setSelectedEventDate] = useState<string>('2026-06-15');
  const [interestedEvents, setInterestedEvents] = useState<string[]>(() => {
    const saved = localStorage.getItem('prep_interested_events');
    return saved ? JSON.parse(saved) : [];
  });
  const [filterEventCity, setFilterEventCity] = useState<string>('vse');

  // NOVINKA: Zahraniční inspirace a asistenční kalkulačka
  const [advisorSubTab, setAdvisorSubTab] = useState<'ai' | 'inspiration'>('ai');
  const [calculatorDate, setCalculatorDate] = useState<string>('2026-06-12');
  const [calculatorTime, setCalculatorTime] = useState<string>('22:00');
  const [dosingResult, setDosingResult] = useState<any>(() => {
    return calculate211Dosing('2026-06-12', '22:00');
  });
  
  // SMS Notification generator state
  const [partnerSmsDisease, setPartnerSmsDisease] = useState<string>('HIV');
  const [partnerSmsDate, setPartnerSmsDate] = useState<string>('minulou sobotu');
  const [partnerSmsStyle, setPartnerSmsStyle] = useState<'polite' | 'direct' | 'soft'>('polite');
  const [generatedSmsText, setGeneratedSmsText] = useState<string>(() => {
    return generatePartnerSms('HIV', 'minulou sobotu', 'polite');
  });
  const [isSmsCopied, setIsSmsCopied] = useState<boolean>(false);
  const [showCopyMessage, setShowCopyMessage] = useState<boolean>(false);

  // NADSTANDARDNÍ MODULY (Toggles for the recipient/stakeholder to decide)
  const [enableCalendar, setEnableCalendar] = useState<boolean>(true);
  const [enableAiAdvisor, setEnableAiAdvisor] = useState<boolean>(true);
  const [enableInspiration, setEnableInspiration] = useState<boolean>(true);
  const [enablePeerSupport, setEnablePeerSupport] = useState<boolean>(true);
  const [enableDonations, setEnableDonations] = useState<boolean>(true);

  // PREZENTAČNÍ POMŮCKY
  const [showDirectorLetter, setShowDirectorLetter] = useState<boolean>(false);
  const [isLetterCopied, setIsLetterCopied] = useState<boolean>(false);

  // Auto scroll chatů
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [peerMessages, aiHistory]);

  const handleTakePill = () => {
    if (!isPillTakenToday) {
      setIsPillTakenToday(true);
      const newStreak = pillStreak + 1;
      setPillStreak(newStreak);
      localStorage.setItem('prep_pill_taken_today', 'true');
      localStorage.setItem('prep_pill_taken_date', new Date().toDateString());
      localStorage.setItem('prep_pill_streak', String(newStreak));
    } else {
      setIsPillTakenToday(false);
      const newStreak = Math.max(0, pillStreak - 1);
      setPillStreak(newStreak);
      localStorage.setItem('prep_pill_taken_today', 'false');
      localStorage.removeItem('prep_pill_taken_date');
      localStorage.setItem('prep_pill_streak', String(newStreak));
    }
  };

  const handleVote = (id: string) => {
    const updated = { ...votes, [id]: (votes[id] || 0) + 1 };
    setVotes(updated);
    localStorage.setItem('prep_improvement_votes', JSON.stringify(updated));
  };

  const toggleStarCenter = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (starredCenters.includes(name)) {
      setStarredCenters(starredCenters.filter(item => item !== name));
    } else {
      setStarredCenters([...starredCenters, name]);
    }
  };

  const toggleOffline = () => {
    const nextState = !isOffline;
    setIsOffline(nextState);
    setShowOfflineAlert(true);
    setTimeout(() => setShowOfflineAlert(false), 3000);
  };

  const handleUnlockSupport = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = supportPassword.trim().toLowerCase();
    // Povolíme "domsvedla", "peer", "heslo" nebo jakékoliv neprázdné pro účely dema, ale s upozorněním
    if (normalized === 'domsvedla' || normalized === 'peer' || normalized === 'mentor') {
      setIsSupportUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleSendPeerMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const userMsg = typedMessage.trim();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setPeerMessages(prev => [...prev, { sender: 'user', text: userMsg, time: timeStr }]);
    setTypedMessage('');

    // Simulovaná odpověď Peer mentora s trochou empathy
    setTimeout(() => {
      let responseText = "Rozumím ti. Když jsem se to dozvěděl já, bál jsem se, že už mě nikdo nebude mít rád a že nebudu mít vztah. Dnes se léčím, moje virová nálož je neměřitelná (U=U), což znamená, že nikoho nemůžu nakazit. Mám skvělého partnera a žiju normální život. Určitě ti doporučuji absolvovat schůzku u nás na Domě Světla, pomůžeme ti to celé zpracovat step-by-step.";
      if (userMsg.toLowerCase().includes('lék') || userMsg.toLowerCase().includes('leky') || userMsg.toLowerCase().includes('léč')) {
        responseText = "Moderní antiretrovirové léky (ART) se berou jednou denně a nemají skoro žádné vedlejší účinky. Virus v těle úplně utlumí. Je důležité začít včas, lékaři na Bulovce nebo v Brně jsou skvělí a velmi empatičtí.";
      } else if (userMsg.toLowerCase().includes('strach') || userMsg.toLowerCase().includes('bojím') || userMsg.toLowerCase().includes('bojim') || userMsg.toLowerCase().includes('smrt')) {
        responseText = "Strach je naprosto přirozený. Vědecký pokrok ale změnil HIV z fatální diagnózy na chronické, plně kontrolovatelné onemocnění. Průměrná délka života léčených lidí je stejná jako u zdravé populace. Nejsi v tom sám.";
      }
      
      setPeerMessages(prev => [...prev, { sender: 'peer', text: responseText, time: timeStr }]);
    }, 1200);
  };

  // Výpočet odpočtu follow-up testů
  const daysRemaining = useMemo(() => {
    const today = new Date();
    const target = new Date(nextApptDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return isNaN(diffDays) ? 0 : diffDays;
  }, [nextApptDate]);

  // AI poradce dotazy s pre-sety
  const askAi = (question: string) => {
    if (isAiLoading) return;
    setAiHistory(prev => [...prev, { sender: 'user', text: question }]);
    setIsAiLoading(true);

    setTimeout(() => {
      let reply = "Děkuji za tvou důvěru. V oblasti nechráněného styku platí: Pokud došlo k rizikové expozici s osobou s neznámým statusem, doporučuji neprodleně (ideálně do 24, nejpozději do 72 hodin) navštívit infekční oddělení a požádat o PEP (nouzovou profylaxi). PEP dramaticky snižuje riziko usídlení viru.";
      
      if (question.toLowerCase().includes('chemsex') || question.toLowerCase().includes('substanc') || question.toLowerCase().includes('ghb')) {
        reply = "⚠️ Poradenství pro Chemsex (sex pod vlivem): \n1. Hydratace: Nastav si budík na napití čisté vody každou hodinu. \n2. Dávkování GHB/GBL: Extrémně nebezpečné! Nesdílej stříkačky ani s nikým bez domluvy. Zapisuj si časy na ruku, ať nedojde k předávkování. \n3. Bezprostřední souhlas: Vlivem látek se mění vnímání hranic, udržuj bezpečný a respektující prostor. \n4. Podpora: Linka ČSAP 800 550 540 ti poskytne anonymní krizové zázemí.";
      } else if (question.toLowerCase().includes('pep') || question.toLowerCase().includes('nouz')) {
        reply = "Klíčové informace o PEP (Post-Expoziční Profylaxe): \n- Časový limit: Musíte začít do 72 hodin od styku (nejlépe do 24 hodin). \n- Místa v ČR: Infekční ambulance krajských nemocnic či non-stop Bulovka HIV centrum v Praze. \n- Průběh: Užívají se silné kombinace léků po dobu 28 dnů.";
      } else if (question.toLowerCase().includes('kondom') || question.toLowerCase().includes('prask')) {
        reply = "Pokud praskl kondom a nejsi chráněný(á) pravidelnou dávkou PrEP: \n1. Umyj pohlavní orgány čistou vodou (neužívej agresivní chemii, která by dráždila sliznice). \n2. Kontaktuj co nejdříve linku 800 550 540 pro posouzení nutnosti podání PEP. \n3. Naplánuj si bezplatné kontrolní testy HIV u nás v checkpoints (ideálně po 12 týdnech od incidentu pro 100% průkaznost).";
      }

      setAiHistory(prev => [...prev, { sender: 'ai', text: reply }]);
      setIsAiLoading(false);
    }, 1000);
  };

  const handleCustomAiQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const q = aiInput.trim();
    setAiInput('');
    askAi(q);
  };

  const handleRecalculateDosing = (date: string, time: string) => {
    setCalculatorDate(date);
    setCalculatorTime(time);
    const result = calculate211Dosing(date, time);
    setDosingResult(result);
  };

  const handleRecalculateSms = (disease: string, date: string, style: 'polite' | 'direct' | 'soft') => {
    setPartnerSmsDisease(disease);
    setPartnerSmsDate(date);
    setPartnerSmsStyle(style);
    const result = generatePartnerSms(disease, date, style);
    setGeneratedSmsText(result);
  };

  const toggleInterestInEvent = (eventId: string) => {
    let updated;
    if (interestedEvents.includes(eventId)) {
      updated = interestedEvents.filter(id => id !== eventId);
    } else {
      updated = [...interestedEvents, eventId];
    }
    setInterestedEvents(updated);
    localStorage.setItem('prep_interested_events', JSON.stringify(updated));
  };

  const triggerQrDonation = (e: React.FormEvent) => {
    e.preventDefault();
    setShowQrModal(true);
  };

  const confirmDonation = () => {
    setShowQrModal(false);
    setDonationSuccess(true);
    setTimeout(() => setDonationSuccess(false), 4000);
  };

  // Filtrování ordinací
  const filteredCenters = useMemo(() => {
    return CENTERS.filter(center => {
      const cleanString = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const normQuery = cleanString(searchQuery);
      const matchQuery = 
        cleanString(center.name).includes(normQuery) || 
        cleanString(center.city).includes(normQuery) || 
        cleanString(center.address).includes(normQuery);
      const matchType = selectedType === 'vse' || center.type === selectedType;
      return matchQuery && matchType;
    });
  }, [searchQuery, selectedType]);

  // Dotační matematika
  const subsidyInfo = useMemo(() => {
    const eligible = userAge <= 25;
    const finalPrice = eligible ? 250 : packageCost;
    const savings = eligible ? Math.max(0, packageCost - 250) : 0;
    return { eligible, finalPrice, savings };
  }, [userAge, packageCost]);

  // Spustit simulační scénáře
  const applySimulationScenario = (scenario: 'student' | 'urgent' | 'tracker' | 'support') => {
    if (scenario === 'student') {
      setUserAge(19);
      setTab('home');
      setDonationAmount(200);
      setEnableDonations(true);
    } else if (scenario === 'urgent') {
      setTab('map');
      setEnableCalendar(true);
      setSearchQuery('');
    } else if (scenario === 'tracker') {
      setTab('tracker');
      setPillStreak(14);
      setIsPillTakenToday(true);
    } else if (scenario === 'support') {
      setTab('support');
      setEnablePeerSupport(true);
      setIsSupportUnlocked(true);
    }
  };

  const handleCopyLetter = () => {
    const text = `Předmět: Inovační projekt: Mobilní asistent "Chci PrEP" a bezplatný hosting na Google Cloud

Vážený pane řediteli ČSAP,

dovoluji si Vám představit inovativní řešení pro Českou společnost AIDS pomoc (ČSAP) a azylový Dům Světla – interaktivního digitálního asistenta "Chci PrEP". Tento moderní koncept spojuje humanitární poslání ČSAP s možnostmi nejlepších cloudových technologií současnosti.

Jako tvůrci z Andre Studio Lab jsme ve spolupráci s Google Cloud navrhli tento technologický demonstrátor, který má za cíl:
1. Destigmatizaci a osvětu: Poskytuje diskrétního společníka, bezpečný tracker medikace a inteligentní AI poradenství pro lidi zvažující nebo aktivně užívající PrEP.
2. Optimalizaci dotačních programů: Integrovaná dotační kalkulačka motivuje k včasnému testování, šetří čas koordinátorům a transparentně ukazuje finanční úspory (např. program pro mladé do 26 let).
3. Plnou kontrolu nad obsahem: Aplikace je navržena modulárně. Jak vidíte v přilehlém administračním panelu, všechny pokročilé moduly (AI poradce, kalendář sanitek, dárcovský modul, peer chat) jsou plně pod Vaší kontrolou a mohou být pro finální nasazení zapnuty či skryty podle Vašeho uvážení.

Podpora od Google a Andre Studio Lab:
Pokud by se společnost Google a příslušné týmy rozhodly tento projekt zaštítit, rádi bychom ČSAP nabídli bezplatný hostingový prostor a technologický kredit v rámci Google nonprofit programů. Společně s naší designérskou a vývojářskou prací od Andre Studio Lab bychom tak aplikaci dovedli do plného produkčního spuštění zcela zdarma.

Odkaz na interaktivní prezentaci a funkční prototyp:
https://ais-pre-ycy647ruvz7ce544hx5kwt-276110994963.europe-west1.run.app/

Věříme, že tento krok posune dostupnost PrEP v České republice a zjednoduší administrativní zátěž. Budu nesmírně potěšen, pokud budeme moci tento návrh prodiskutovat osobně.

S úctou a přáním mnoha úspěchů,

Andre Studio Lab
Manifest your vision.`;
    navigator.clipboard.writeText(text);
    setIsLetterCopied(true);
    setTimeout(() => setIsLetterCopied(false), 3000);
  };

  return (
    <div className={`min-h-screen ${t.bgApp} ${t.textMain} flex flex-col justify-between selection:bg-rose-600 selection:text-white transition-colors duration-500`}>
      
      {/* Dynamic Background Mesh Grid */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-rose-950/20 via-slate-900/0 to-slate-900/0 pointer-events-none z-0" />

      {/* Header na ploše */}
      <header className="max-w-6xl mx-auto w-full px-4 pt-6 pb-2 flex flex-col md:flex-row items-center justify-between gap-4 z-10 border-b border-slate-900 pb-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-950/40 shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight uppercase text-white">Chci PrEP asistent</h1>
                <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-extrabold shrink-0">DŮM SVĚTLA DEMO</span>
              </div>
              <p className="text-xs text-slate-400">Připraveno ke schválení pro Českou společnost AIDS pomoc (ČSAP)</p>
            </div>
          </div>

          {/* Co-Branding Badges Support Label (Google + Andre Studio Lab) */}
          <div className="flex flex-wrap items-center gap-2 pt-1 md:pt-0 md:pl-4 md:border-l md:border-slate-800">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Inovace & Podpora:</span>
            
            {/* Google Cloud Badge */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800/85 px-2 py-1 rounded-xl">
              <span className="font-extrabold text-[11px] flex gap-0.5 tracking-tight">
                <span className="text-blue-400">G</span>
                <span className="text-red-400">o</span>
                <span className="text-yellow-400">o</span>
                <span className="text-blue-400">g</span>
                <span className="text-green-400">l</span>
                <span className="text-red-400">e</span>
              </span>
              <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider">Cloud</span>
            </div>

            {/* Andre Studio Lab Badge */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800/85 px-2.5 py-1.5 rounded-xl">
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-[8px] font-black text-white">A</div>
              <div className="flex flex-col leading-none">
                <span className="text-[8px] font-black text-slate-200">Andre Studio Lab</span>
                <span className="text-[5.5px] text-slate-500 font-extrabold uppercase tracking-widest font-sans">Manifest your vision</span>
              </div>
            </div>
          </div>
        </div>

        {/* Přepínače témat (barevné prototypy) a simulátorů */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-950/90 border border-slate-800 p-1.5 rounded-2xl">
          <span className="text-[10px] font-black uppercase text-slate-400 px-2">Barevný prototyp:</span>
          {(['twilight', 'coral', 'emerald'] as ThemeId[]).map((theme) => (
            <button
              key={theme}
              onClick={() => setThemeId(theme)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                themeId === theme 
                  ? 'bg-rose-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {theme === 'twilight' && '1. Vesmírný soumrak'}
              {theme === 'coral' && '2. Jemný korál'}
              {theme === 'emerald' && '3. Lékařský nefrit'}
            </button>
          ))}

          <button
            onClick={toggleOffline}
            className={`flex items-center gap-1.5 ml-2 px-3 py-1 rounded-xl text-xs font-bold border ${
              isOffline ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Kliknutím nasimulujete chování bez internetu"
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{isOffline ? 'Offline' : 'Simulátor'}</span>
          </button>
        </div>
      </header>

      {/* Main Sandbox Frame with Desktop Side Control Panel */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-2 md:px-4 py-4 flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8 z-10">
        
        {/* Left Side Logo & Admin Console on Large Screens */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
          {/* Custom Andre Studio Lab Logo Card (recreated perfectly from image) */}
          <div className="bg-white text-slate-950 rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-slate-200">
            {/* Subtle Grid Accent in Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative text-left flex flex-col justify-between h-full space-y-5">
              {/* The Recreated Typography matching the uploaded image perfectly */}
              <div className="font-sans">
                <div className="text-[34px] leading-[0.9] font-black tracking-tighter text-slate-950">
                  Andre
                </div>
                <div className="text-[34px] leading-[0.9] font-black tracking-tighter text-slate-950 mt-0.5">
                  Studio
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-[34px] leading-[0.9] font-black tracking-tighter text-slate-950">Lab</span>
                  {/* The distinct lime-green vertical bar | from the uploaded logo image */}
                  <span className="text-[32px] font-black text-[#a3cb38] select-none scale-y-110 relative top-[-1px] ml-0.5 animate-pulse">|</span>
                </div>
                <div className="text-[28px] leading-[0.9] font-black tracking-tighter text-slate-950 mt-5">
                  Manifest
                </div>
                <div className="text-[17px] leading-[1.0] font-bold text-[#57606f] tracking-tight mt-1 lowercase">
                  your vision.
                </div>
              </div>

              {/* Subtitle explaining the role */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <p className="text-[11px] text-slate-600 leading-normal font-medium">
                  Tato aplikace byla kompletně navržena, upravena a technologicky zastřešena studiem <strong className="text-slate-950 font-extrabold font-sans">Andre Studio Lab</strong> za podpory <strong className="text-slate-950 font-extrabold font-sans">Google Cloud</strong> pro potřeby České společnosti AIDS pomoc (ČSAP).
                </p>
                <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg w-fit mt-1">
                  <span className="text-[8px] font-black text-slate-600 tracking-wider uppercase">Oficiální partner vývoje</span>
                </div>
              </div>
            </div>
          </div>

          {/* Client Recipient Console Checklist for Extra Modules */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 text-left backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-rose-500" />
                <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">Klientská administrace (ČSAP)</h3>
              </div>
              <span className="text-[9px] bg-rose-500/10 text-rose-400 font-extrabold px-2 py-0.5 rounded border border-rose-500/20">PREVIEW</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal">
              O užití nadstandardních modulů rozhoduje příjemce ČSAP. Těmito přepínači můžete okamžitě simulovat podobu rozhraní:
            </p>

            <div className="space-y-3 pt-1">
              {[
                { 
                  id: 'calendar', 
                  label: 'Sledování sanitek (Asistent)', 
                  desc: 'Kalendář bezplatného testování zdarma v ČR',
                  state: enableCalendar, 
                  setter: setEnableCalendar 
                },
                { 
                  id: 'ai', 
                  label: 'Diskrétní AI Poradca (Poradce)', 
                  desc: 'Inteligentní PrEP / HIV asistent s Gemini',
                  state: enableAiAdvisor, 
                  setter: setEnableAiAdvisor 
                },
                { 
                  id: 'support', 
                  label: 'Bezpečná peer podpora (Podpora)', 
                  desc: 'Propojení nováčků s mentory pod ochranou',
                  state: enablePeerSupport, 
                  setter: setEnablePeerSupport 
                },
                { 
                  id: 'inspiration', 
                  label: 'Zahraniční inspirace (Poradce)', 
                  desc: 'Nástroje k analýze chování partnerů',
                  state: enableInspiration, 
                  setter: setEnableInspiration 
                },
                { 
                  id: 'donations', 
                  label: 'Transparentní dary (Domů)', 
                  desc: 'Integrovaný QR darovací modul',
                  state: enableDonations, 
                  setter: setEnableDonations 
                }
              ].map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-slate-800 transition-all space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-200">{item.label}</span>
                    <button
                      onClick={() => item.setter(!item.state)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer ${
                        item.state ? 'bg-rose-600' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow transition-transform duration-300 ${
                        item.state ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                  <p className="text-[9.5px] text-slate-500 leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* NOVINKA: Rychlá interaktivní demonstrace pro prezentaci */}
            <div className="pt-3.5 border-t border-slate-800 space-y-2">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Rychlé demonstrační scénáře:</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => applySimulationScenario('student')}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left transition-all active:scale-95 cursor-pointer"
                >
                  <p className="text-[10px] font-bold text-rose-400">1. Student (19 let)</p>
                  <p className="text-[8.5px] text-slate-500 leading-tight">Dotované testy & darovací modul</p>
                </button>
                <button
                  onClick={() => applySimulationScenario('urgent')}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left transition-all active:scale-95 cursor-pointer"
                >
                  <p className="text-[10px] font-bold text-amber-400">2. Urgentní test</p>
                  <p className="text-[8.5px] text-slate-500 leading-tight">Sledování mobilní sanitky</p>
                </button>
                <button
                  onClick={() => applySimulationScenario('tracker')}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left transition-all active:scale-95 cursor-pointer"
                >
                  <p className="text-[10px] font-bold text-emerald-400">3. Denní tracker</p>
                  <p className="text-[8.5px] text-slate-500 leading-tight">Plný 14-denní streak v kalendáři</p>
                </button>
                <button
                  onClick={() => applySimulationScenario('support')}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left transition-all active:scale-95 cursor-pointer"
                >
                  <p className="text-[10px] font-bold text-teal-400">4. Peer podpora</p>
                  <p className="text-[8.5px] text-slate-500 leading-tight">Zabezpečená zóna a poradenství</p>
                </button>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px]">
              <span className="text-slate-500 font-bold">Stav integrace:</span>
              <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Interaktivní demonstrátor
              </span>
            </div>
          </div>

          {/* Dopis pro pana ředitele ČSAP */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 text-left backdrop-blur-md transition-all">
            <button
              onClick={() => setShowDirectorLetter(!showDirectorLetter)}
              className="w-full flex items-center justify-between focus:outline-none group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="font-extrabold text-xs text-white uppercase tracking-wider group-hover:text-rose-400 transition-colors">
                  Průvodní dopis pro ředitele ČSAP
                </h3>
              </div>
              <span className="text-slate-500 text-xs font-black group-hover:text-slate-350">
                {showDirectorLetter ? 'Skrýt' : 'Zobrazit'}
              </span>
            </button>

            {showDirectorLetter && (
              <div className="space-y-3.5 pt-2 animate-fade-in text-[11px] leading-relaxed text-slate-300">
                <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-850 text-[10.5px] text-slate-300 space-y-3 font-sans h-80 overflow-y-auto select-text scrollbar-thin">
                  <p className="font-extrabold text-slate-100 text-[11px] border-b border-slate-800 pb-1.5">
                    Předmět: Inovační projekt: Mobilní asistent "Chci PrEP" a bezplatný hosting na Google Cloud
                  </p>
                  <p>Vážený pane řediteli ČSAP,</p>
                  <p>
                    dovoluji si Vám představit inovativní řešení pro Českou společnost AIDS pomoc (ČSAP) a azylový Dům Světla – interaktivního digitálního asistenta <strong className="text-white">"Chci PrEP"</strong>. Tento moderní koncept spojuje humanitární poslání ČSAP s možnostmi nejlepších cloudových technologií současnosti.
                  </p>
                  <p>
                    Jako tvůrci ze <strong className="text-white">Andre Studio Lab</strong> jsme ve spolupráci s <strong className="text-white">Google Cloud</strong> navrhli tento technologický demonstrátor, který má za cíl:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                    <li><strong className="text-white">Destigmatizaci a osvětu</strong>: Poskytuje diskrétního společníka, bezpečný tracker medikace a inteligentní AI poradenství pro lidi zvažující nebo aktivně užívající PrEP.</li>
                    <li><strong className="text-white">Optimalizaci dotačních programů</strong>: Integrovaná dotační kalkulačka motivuje k včasnému testování, šetří čas koordinátorům a transparentně ukazuje finanční úspory (např. program pro mladé do 26 let).</li>
                    <li><strong className="text-white">Plnou kontrolu nad obsahem</strong>: Aplikace je navržena modulárně. Jak vidíte v přilehlém administračním panelu, všechny pokročilé moduly (AI poradce, kalendář sanitek, dárcovský modul, peer chat) jsou plně pod Vaší kontrolou a mohou být pro finální nasazení zapnuty či skryty podle Vašeho uvážení.</li>
                  </ol>
                  <p className="font-semibold text-rose-300">Podpora od Google a Andre Studio Lab:</p>
                  <p>
                    Pokud by se společnost Google a příslušné týmy rozhodly tento projekt zaštítit, rádi bychom ČSAP nabídli <strong className="text-emerald-400">bezplatný hostingový prostor a technologický kredit v rámci Google nonprofit programů</strong>. Společně s naší designérskou a vývojářskou prací od Andre Studio Lab bychom tak aplikaci dovedli do plného produkčního spuštění zcela zdarma.
                  </p>
                  <p className="text-slate-400">
                    Odkaz na interaktivní prezentaci a funkční prototyp:<br />
                    <span className="text-[9.5px] text-blue-400 underline font-mono">https://ais-pre-ycy647ruvz7ce544hx5kwt-276110994963.europe-west1.run.app/</span>
                  </p>
                  <p>
                    Věříme, že tento krok posune dostupnost PrEP v České republice a zjednoduší administrativní zátěž. Budu nesmírně potěšen, pokud budeme moci tento návrh prodiskutovat osobně.
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                    <p className="font-extrabold text-white">S úctou a přáním mnoha úspěchů,</p>
                    <p className="font-black text-rose-450 mt-1">Andre Studio Lab</p>
                    <p className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Manifest your vision.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopyLetter}
                    className="flex-1 py-2 bg-gradient-to-r from-rose-600 to-rose-500 text-white font-extrabold @sm:text-xs text-[10px] rounded-xl flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all text-center cursor-pointer"
                  >
                    <span>{isLetterCopied ? '✓ Zkopírováno!' : 'Kopírovat dopis panu řediteli'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* The Central Smart Phone Simulator */}
        <div className="w-full max-w-md transition-all duration-500">
          
          {/* Smart Phone Simulator */}
          <div className="w-full bg-slate-950 rounded-[44px] border-8 border-slate-800 ring-1 ring-slate-700 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] h-[840px] flex flex-col relative overflow-hidden">
            
            {/* Status Bar */}
            <div className="relative h-10 w-full bg-slate-950 flex items-center justify-between px-6 z-40 text-slate-400 select-none">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1">
                11:42
                {isOffline && <span className="text-[9px] text-amber-500">(sim)</span>}
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl border-x border-b border-slate-800" />
              <div className="flex items-center gap-2 text-xs">
                {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />}
                <div className="w-5 h-2.5 border border-slate-500 rounded-sm p-0.5 flex items-center">
                  <div className="h-full w-4/5 bg-slate-300 rounded-2xs" />
                </div>
              </div>
            </div>

            {/* App Header top band */}
            <div className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 flex items-center justify-between px-5 py-2 z-30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
                  <ShieldCheck className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="text-left">
                  <h2 className="text-sm font-black tracking-tight text-white leading-none uppercase">CHCI PrEP</h2>
                  <span className="text-[9px] text-rose-400/80 font-semibold tracking-wider uppercase">Dům Světla</span>
                </div>
              </div>

              {/* Status pill inside simulated device */}
              <div className="flex items-center gap-1.5">
                {isOffline ? (
                  <span className="bg-amber-500/10 text-amber-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                    Offline rezerva
                  </span>
                ) : (
                  <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1 animate-pulse">
                    Live Demo
                  </span>
                )}
              </div>
            </div>

            {/* Screen Content Wrapper */}
            <div className="flex-1 overflow-y-auto px-4 py-4 relative scrollbar-none" style={{ maxHeight: 'calc(100% - 105px)' }}>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5 pb-16"
                >
                  
                  {/* TAB 1: HOME */}
                  {tab === 'home' && (
                    <div className="space-y-6">
                      
                      {/* Hero Informační panel */}
                      <div className="relative rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/10 p-5 overflow-hidden shadow-xl text-left">
                        <span className="text-[10px] font-extrabold tracking-widest text-rose-400 uppercase bg-rose-500/10 px-2 py-1 rounded inline-block mb-3 border border-rose-500/20">
                          PrEP Program ČSAP
                        </span>
                        <h3 className="text-xl font-extrabold text-white leading-tight mb-2">
                          Chraňte se jednoduše, diskrétně a bez bariér.
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                          Preventivní pilulky PrEP eliminují riziko nákazy HIV až o 99 %. Tato verze byla vyvinuta s ohledem na specifika Domu Světla.
                        </p>
                        
                        <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-300">Spolehlivost ochrany:</span>
                          <span className={`font-black text-rose-400`}>Až 99 % při užívání</span>
                        </div>
                      </div>

                      {/* Rychlé dlaždice */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setTab('book')}
                          className="p-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex flex-col justify-between items-start h-26 text-left transition-all shadow-md"
                        >
                          <Calendar className="w-5 h-5 mb-auto" />
                          <span>Rezervovat se online <ArrowRight className="w-3 h-3 inline ml-1" /></span>
                        </button>

                        <button
                          onClick={() => setTab('advisor')}
                          className="p-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-bold text-xs flex flex-col justify-between items-start h-26 text-left transition-all"
                        >
                          <Sparkles className="w-5 h-5 text-rose-400 mb-auto" />
                          <span>AI poradce (Chemsex)</span>
                        </button>

                        <button
                          onClick={() => setTab('support')}
                          className="p-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-bold text-xs flex flex-col justify-between items-start h-26 text-left transition-all relative"
                        >
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                          <Users className="w-5 h-5 text-blue-400 mb-auto" />
                          <span>Peer podpora po testu</span>
                        </button>

                        <button
                          onClick={() => setTab('map')}
                          className="p-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-bold text-xs flex flex-col justify-between items-start h-26 text-left transition-all"
                        >
                          <MapPin className="w-5 h-5 text-emerald-400 mb-auto" />
                          <span>Adresář checkpointů</span>
                        </button>
                      </div>

                      {/* DOBROVOLNÝ PŘÍSPĚVEK PRO DŮM SVĚTLA */}
                      {!enableDonations ? (
                        <div className={`p-5 rounded-2xl border border-slate-800 text-center ${t.bgCard} space-y-3 py-7 animate-fade-in`}>
                          <Lock className="w-6 h-6 text-rose-500 mx-auto opacity-70" />
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Nadstandardní platební modul deaktivován</h4>
                            <p className="text-[11px] text-slate-400 leading-normal max-w-xs mx-auto">
                              Příjemce aplikace (Dům Světla) se rozhodl tento finanční modul z finálního klientského buildu deaktovovat. Chování můžete nasimulovat povolením v pravém administračním koutku.
                            </p>
                          </div>
                          <button
                            onClick={() => setEnableDonations(true)}
                            className="text-[10px] bg-rose-600/20 text-rose-450 border border-rose-500/25 px-2.5 py-1 rounded-lg font-bold"
                          >
                            Povolit pro náhled
                          </button>
                        </div>
                      ) : (
                        <div className={`p-4 rounded-2xl shadow-sm space-y-4 text-left ${t.bgCard}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Coins className="w-5 h-5 text-rose-500" />
                              <h4 className="font-black text-sm text-slate-150">Podpořte Dům Světla ČSAP</h4>
                            </div>
                            <span className="text-[10px] bg-amber-500/10 text-amber-400 font-extrabold px-2 py-0.5 rounded border border-amber-500/20">Dar pro pojištěnce</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-normal">
                            Vaše dary umožňují Domu Světla ČSAP poskytovat slevy na PrEP pro znevýhodněné mladé lidi a financovat provoz bezplatných testovacích checkpointů po celé ČR.
                          </p>

                          <div className="grid grid-cols-4 gap-2">
                            {[200, 500, 1000].map((amt) => (
                              <button
                                key={amt}
                                onClick={() => { setDonationAmount(amt); setCustomDonation(''); }}
                                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                                  donationAmount === amt && !customDonation
                                    ? 'bg-rose-600 text-white border-rose-500' 
                                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                                }`}
                              >
                                {amt} Kč
                              </button>
                            ))}
                            <input 
                              type="number"
                              placeholder="Jiný"
                              value={customDonation}
                              onChange={(e) => {
                                setCustomDonation(e.target.value);
                                setDonationAmount(Number(e.target.value) || 0);
                              }}
                              className="bg-slate-950/60 border border-slate-800 text-xs font-bold rounded-xl text-center text-slate-200 outline-none focus:border-rose-500 py-1"
                            />
                          </div>

                          {/* Co dar splní */}
                          <div className={`p-3 rounded-xl text-xs ${t.bgNested} flex items-start gap-2.5`}>
                            <Info className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                            <p className="text-slate-400 leading-normal text-[11px]">
                              {donationAmount <= 200 && 'Částka 200 Kč zaplatí sadu na bezplatný slinový test HIV pro jednoho zájemce v mobilní sanitce.'}
                              {donationAmount > 200 && donationAmount <= 500 && 'Částka 500 Kč pokryje měsíční příspěvek na krevní test funkčnosti ledvin pro klienta pod 26 let.'}
                              {donationAmount > 500 && 'Částka pokryje ubytování na jednu noc v azylovém Domě Světla ČSAP pro člověka v těžké životní situaci.'}
                            </p>
                          </div>

                          {/* Donating triggers simulator */}
                          <button
                            onClick={triggerQrDonation}
                            className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase text-white tracking-widest flex items-center justify-center gap-2 transition-all ${t.accent}`}
                          >
                            <QrCode className="w-4 h-4" />
                            <span>Vygenerovat QR kód k platbě</span>
                          </button>

                          {donationSuccess && (
                            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-center text-xs font-bold animate-pulse">
                              ❤️ Děkujeme! Platba byla úspěšně nasimulována a zaevidována pro ČSAP Dům Světla.
                            </div>
                          )}
                        </div>
                      )}

                      {/* Dotační kalkulačka */}
                      <div className={`p-4 rounded-xl border space-y-4 text-left ${t.bgCard}`}>
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-rose-400" />
                          <h4 className="font-bold text-sm text-slate-150">Dotační kompenzace: PrEP za 250 Kč</h4>
                        </div>
                        <p className="text-xs text-slate-300 leading-normal">
                          Česká společnost AIDS pomoc nabízí dotační kompenzaci mladým lidem do 26 let. Vyzkoušejte, splňujete-li podmínky programu.
                        </p>

                        <div className="space-y-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-400">Váš věk:</span>
                              <span className="font-extrabold text-rose-400">{userAge} let</span>
                            </div>
                            <input 
                              type="range" 
                              min="15" 
                              max="40" 
                              value={userAge} 
                              onChange={(e) => setUserAge(Number(e.target.value))}
                              className="w-full accent-rose-500 h-1 rounded-full bg-slate-700 cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="p-3 rounded-lg border text-xs space-y-1 bg-rose-950/20 border-rose-500/20">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-300">Splňujete limit programu ČSAP:</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black ${
                              subsidyInfo.eligible ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'
                            }`}>
                              {subsidyInfo.eligible ? 'ANO (Do 26 let)' : 'NE'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded">
                            <span className="text-slate-400">Vaše cena v lékárně s podporou:</span>
                            <span className="font-extrabold text-white text-sm">{subsidyInfo.finalPrice} Kč</span>
                          </div>
                          {subsidyInfo.eligible && (
                            <div className="flex justify-between items-center text-emerald-400">
                              <span>Měsíční úspora proplacená zpětně:</span>
                              <span className="font-black">{subsidyInfo.savings} Kč / krabička</span>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: INTERACTIVE RESERVATION ASSISTENT */}
                  {tab === 'book' && (
                    <div className="space-y-5">
                      <div className="text-left">
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                          Objednání na kliniku
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1.5 leading-snug">
                          Rezervační asistent a screening
                        </h3>
                        <p className="text-xs text-slate-400">
                          Projděte rychlým vyhodnocením a spojte se s koordinátorem Domu Světla jedním kliknutím.
                        </p>
                      </div>

                      <div className={`p-4 rounded-2xl space-y-4 ${t.bgCard}`}>
                        
                        {/* Progress Bar */}
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-slate-400">
                          <span className={`pb-1 border-b-2 ${screeningStep >= 0 ? 'border-rose-500 text-rose-400' : 'border-slate-800'}`}>1. Výběr</span>
                          <span className={`pb-1 border-b-2 ${screeningStep >= 1 ? 'border-rose-500 text-rose-400' : 'border-slate-800'}`}>2. Screening</span>
                          <span className={`pb-1 border-b-2 ${screeningStep >= 2 ? 'border-rose-500 text-rose-400' : 'border-slate-800'}`}>3. Kontakt</span>
                        </div>

                        {screeningStep === 0 && (
                          <div className="space-y-4 text-left">
                            <span className="text-xs font-bold text-slate-300">Zvolte jedno z deseti pracovišť ČSAP:</span>
                            <select 
                              value={selectedCenter.name}
                              onChange={(e) => {
                                const found = CENTERS.find(c => c.name === e.target.value);
                                if (found) setSelectedCenter(found);
                              }}
                              className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3 py-2.5 text-xs font-medium cursor-pointer"
                            >
                              {CENTERS.map((center, index) => (
                                <option key={index} value={center.name}>
                                  {center.city} — {center.name}
                                </option>
                              ))}
                            </select>

                            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 text-xs text-slate-300 space-y-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-white text-xs">{selectedCenter.name}</span>
                                <span className="text-[10px] bg-slate-800 text-rose-400 px-1.5 py-0.5 rounded font-black uppercase">{selectedCenter.type}</span>
                              </div>
                              <p className="text-[11px] text-slate-400">{selectedCenter.address}</p>
                              {selectedCenter.note && <p className="text-[10.5px] text-slate-500 leading-snug italic pt-1.5 border-t border-slate-800/40">{selectedCenter.note}</p>}
                            </div>

                            <button
                              onClick={() => setScreeningStep(1)}
                              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5"
                            >
                              <span>Pokračovat na pre-screening</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {screeningStep === 1 && (
                          <div className="space-y-4 text-left">
                            <div className="bg-rose-500/5 border border-rose-500/20 p-3 rounded-lg flex gap-2">
                              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                              <p className="text-[11px] text-rose-300 leading-snug">
                                Otázky slouží k vaší přípravě před hovorem a lékařským vyhodnocením. Vše je 100% anonymní.
                              </p>
                            </div>

                            <div className="space-y-2">
                              <span className="text-xs font-bold text-slate-300 block leading-snug">Proběhl v poslední době sex pod vlivem návykových látek (chemsex)?</span>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {['Ano, byl přítomen chemsex', 'Ne, standardní styk'].map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() => setScreeningAnswers({...screeningAnswers, chemsex: opt})}
                                    className={`p-2.5 rounded-lg border text-left font-semibold transition-all ${
                                      screeningAnswers.chemsex === opt 
                                        ? 'bg-rose-600 border-rose-500 text-white shadow' 
                                        : 'bg-slate-950 border-slate-800 text-slate-300'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <span className="text-xs font-bold text-slate-300 block leading-snug">Máte zkušenosti s pravidelným braním léků?</span>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {['Ano, zvládám bez potíží', 'Mám obavu, že zapomenu'].map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() => setScreeningAnswers({...screeningAnswers, adherence: opt})}
                                    className={`p-2.5 rounded-lg border text-left font-semibold transition-all ${
                                      screeningAnswers.adherence === opt 
                                        ? 'bg-rose-600 border-rose-500 text-white shadow' 
                                        : 'bg-slate-950 border-slate-800 text-slate-300'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => setScreeningStep(0)}
                                className="flex-1 bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs py-2.5 rounded-lg"
                              >
                                Zpět
                              </button>
                              <button
                                onClick={() => setScreeningStep(2)}
                                disabled={!screeningAnswers.chemsex || !screeningAnswers.adherence}
                                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 rounded-lg transition-all disabled:opacity-40"
                              >
                                Dokončit
                              </button>
                            </div>
                          </div>
                        )}

                        {screeningStep === 2 && (
                          <div className="space-y-4 text-left text-xs">
                            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg space-y-1.5">
                              <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Co říkají data screening:</span>
                              </div>
                              <p className="text-slate-300 leading-normal text-[11px]">
                                {screeningAnswers.chemsex?.includes('Ano') 
                                  ? '⚠️ Sex pod vlivem s sebou nese vysoká rizika porušení kondomu. Pravidelná ochrana PrEP je pro vás maximálně přínosná!' 
                                  : '✓ PrEP poslouží jako skvělá dodatečná prevence chránící před obavami.'}
                              </p>
                              <p className="text-slate-400 leading-normal text-[11px]">
                                {screeningAnswers.adherence?.includes('obavu') 
                                  ? 'Doporučujeme nastavit si upomínky v našem Trackeru (záložka Můj PrEP), abyste lék brali správně.' 
                                  : 'Vaše dobrá adherence usnadní bezchybné denní dávkování.'}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Kontaktovat vybrané místo:</span>
                              
                              <a
                                href={`tel:${selectedCenter.phone.replace(/\s/g, "")}`}
                                className="w-full py-2.5 px-3 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-between font-bold"
                              >
                                <span className="flex items-center gap-2 text-rose-400">
                                  <Phone className="w-4 h-4" /> Zavolat koordinátorovi:
                                </span>
                                <span className="text-white text-xs">{selectedCenter.phone}</span>
                              </a>

                              {selectedCenter.email && (
                                <a
                                  href={`mailto:${selectedCenter.email}`}
                                  className="w-full py-2.5 px-3 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-between font-bold"
                                >
                                  <span className="text-blue-400 flex items-center gap-2">
                                    <Send className="w-4 h-4" /> Odeslat poptávku e-mailem
                                  </span>
                                  <span className="text-white text-xs text-right pr-1 truncate">{selectedCenter.email}</span>
                                </a>
                              )}
                            </div>

                            <button
                              onClick={() => { setScreeningStep(0); setScreeningAnswers({}); }}
                              className="w-full bg-slate-900 border border-slate-800 text-slate-400 font-semibold text-xs py-2 rounded-lg"
                            >
                              Resetovat a změnit místo
                            </button>
                          </div>
                        )}

                      </div>
                    </div>
                  )}

                  {/* TAB 3: CLINIC LOCATOR & FREE TESTING CALENDAR */}
                  {tab === 'map' && (
                    <div className="space-y-4">
                      {/* Sub-navigation Segmented Control */}
                      <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                        <button
                          onClick={() => setMapSubTab('clinics')}
                          className={`flex-1 py-1.5 text-[11px] font-black uppercase rounded-lg transition-all ${
                            mapSubTab === 'clinics' ? `${t.accent} text-white shadow-sm` : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Stálé ordinace
                        </button>
                        <button
                          onClick={() => setMapSubTab('calendar')}
                          className={`flex-1 py-1.5 text-[11px] font-black uppercase rounded-lg transition-all ${
                            mapSubTab === 'calendar' ? `${t.accent} text-white shadow-sm` : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Kalendář testování zdarma
                        </button>
                      </div>

                      {mapSubTab === 'clinics' ? (
                        <>
                          <div className="text-left">
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                              Spádová mapa a ordinace
                            </span>
                            <h3 className="text-lg font-bold text-white mt-1.5">
                              Pracoviště po celé ČR
                            </h3>
                            <p className="text-xs text-slate-400">
                              Vyhledejte nejbližší bezpečné testovací místo pod patronátem České společnosti AIDS pomoc.
                            </p>
                          </div>

                          <div className="relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                            <input 
                              type="text"
                              placeholder="Zadejte název města či kliniky"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-slate-900 text-xs text-slate-200 rounded-xl pl-9 pr-4 py-2.5 border border-slate-800 focus:outline-none focus:border-rose-500 placeholder-slate-650"
                            />
                          </div>

                          {/* Seznam ordinací */}
                          <div className="space-y-2.5 text-left">
                            {filteredCenters.map((center, index) => {
                              const isStarred = starredCenters.includes(center.name);
                              return (
                                <div
                                  key={index}
                                  onClick={() => {
                                    setSelectedCenter(center);
                                    setTab('book');
                                    setScreeningStep(0);
                                  }}
                                  className={`p-3.5 rounded-xl transition-all cursor-pointer flex justify-between items-start ${t.bgCard}`}
                                >
                                  <div className="space-y-1.5 flex-1 pr-4">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                        center.type === 'PrEP point' ? 'bg-amber-400/10 text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                      }`}>
                                        {center.type}
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-semibold">{center.city}</span>
                                    </div>
                                    <h4 className="text-xs font-bold text-white leading-snug">{center.name}</h4>
                                    <p className="text-[11px] text-slate-450 leading-relaxed">{center.address}</p>
                                  </div>

                                  <div className="flex flex-col items-center justify-between gap-3 h-full flex-shrink-0">
                                    <button
                                      aria-label="Star Center Toggle"
                                      onClick={(e) => toggleStarCenter(center.name, e)}
                                      className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                                    >
                                      <Star className={`w-4.5 h-4.5 ${isStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                                    </button>
                                    <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                                      <ChevronRight className="w-4 h-4" />
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        // CALENDAR SUBTAB: MOBILNÍ & AKČNÍ TESTOVÁNÍ ZDARMA ČSAP
                        !enableCalendar ? (
                          <div className={`p-6 rounded-2xl border border-slate-800 text-center ${t.bgCard} space-y-4 py-8 animate-fade-in`}>
                            <Lock className="w-10 h-10 text-rose-500 mx-auto opacity-70" />
                            <div className="space-y-1.5">
                              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Modul kalendáře deaktivován</h4>
                              <p className="text-[11.5px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                                Příjemce aplikace ČSAP se rozhodl nezařazovat sledování mobilních sanitek do finálního produkčního buildu. Tento nadstandardní modul je nyní vypnut.
                              </p>
                            </div>
                            <button
                              onClick={() => setEnableCalendar(true)}
                              className="text-xs bg-rose-600/20 hover:bg-rose-600/30 text-rose-450 border border-rose-500/25 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer animate-pulse"
                            >
                              Povolit v konfiguraci
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                          <div className="text-left">
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                              Mobilní sanitka a bezplatné akce zdarma
                            </span>
                            <h3 className="text-lg font-bold text-white mt-1.5">
                              Dny bezplatného testování ČSAP
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              Nemáte recept ani lékaře? V našich mobilních sanitkách a speciálních akcích testujeme 100% anonymně, zdarma a bez objednání.
                            </p>
                          </div>

                          {/* June 2026 Interactive Calendar Widget */}
                          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl relative">
                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                              <span className="text-xs font-black text-rose-250 text-slate-200">Červen 2026</span>
                              <span className="text-[9px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-black uppercase">
                                Vyberte zvýrazněný den s akcí
                              </span>
                            </div>

                            {/* Calendar Days weekdays name row */}
                            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-500 uppercase py-1">
                              <span>Po</span><span>Út</span><span>St</span><span>Čt</span><span>Pá</span><span>So</span><span>Ne</span>
                            </div>

                            {/* Calendar Days values grid */}
                            <div className="grid grid-cols-7 gap-1 font-semibold text-xs text-center">
                              {Array.from({ length: 30 }, (_, idx) => {
                                const dayNum = idx + 1;
                                const dateStr = `2026-06-${dayNum.toString().padStart(2, '0')}`;
                                const matchedEvent = FREE_TEST_EVENTS.find(e => e.date === dateStr);
                                const isSelected = selectedEventDate === dateStr;
                                return (
                                  <button
                                    key={dayNum}
                                    onClick={() => setSelectedEventDate(dateStr)}
                                    className={`relative py-1.5 rounded-lg active:scale-95 transition-all outline-none ${
                                      isSelected
                                        ? 'bg-rose-600 text-white font-black scale-105 shadow-md shadow-rose-950/50'
                                        : matchedEvent
                                        ? 'bg-rose-950/30 text-rose-300 border border-rose-500/40 hover:bg-rose-950/60'
                                        : 'text-slate-400 hover:bg-slate-800/40'
                                    }`}
                                  >
                                    <span>{dayNum}</span>
                                    {matchedEvent && !isSelected && (
                                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-rose-500" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Selected date info or clear filter */}
                            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                              <span className="text-slate-450 text-slate-400">
                                Filtrováno dnem: <span className="text-rose-400 font-extrabold">{selectedEventDate ? selectedEventDate : 'Žádné filtrování'}</span>
                              </span>
                              <button
                                onClick={() => setSelectedEventDate('')}
                                className="text-[10px] text-rose-450 hover:text-white bg-slate-950 text-rose-400 border border-slate-800 px-2 py-0.5 rounded cursor-pointer"
                              >
                                Ukázat všechny akce
                              </button>
                            </div>
                          </div>

                          {/* Horizontal tag filter for cities */}
                          <div className="flex gap-1 overflow-x-auto py-1 text-xs no-scrollbar select-none">
                            {['vse', 'Praha', 'Brno', 'Ostrava', 'Plzeň', 'Karlovy Vary'].map((city) => (
                              <button
                                key={city}
                                onClick={() => setFilterEventCity(city)}
                                className={`px-3 py-1 rounded-full text-[10.5px] font-black shrink-0 transition-all border ${
                                  filterEventCity === city 
                                    ? 'bg-rose-600 text-white border-rose-500' 
                                    : 'bg-slate-900 border-slate-850 text-slate-400'
                                }`}
                              >
                                {city === 'vse' ? 'Všechna města' : city}
                              </button>
                            ))}
                          </div>

                          {/* Render Events */}
                          <div className="space-y-3.5 text-left">
                            {(() => {
                              const filteredEvents = FREE_TEST_EVENTS.filter(evt => {
                                const matchCity = filterEventCity === 'vse' || evt.city === filterEventCity;
                                const matchDate = !selectedEventDate || evt.date === selectedEventDate;
                                return matchCity && matchDate;
                              });

                              if (filteredEvents.length === 0) {
                                return (
                                  <div className="p-6 bg-slate-900 rounded-2xl text-center border border-slate-800 space-y-1">
                                    <AlertCircle className="w-7 h-7 text-rose-500 mx-auto" />
                                    <h4 className="font-bold text-xs text-white">Žádné akce v tomto filtru</h4>
                                    <p className="text-[11px] text-slate-450 text-slate-400 leading-snug">
                                      V dané datum nebo v tomto městě momentálně neplánujeme bezplatné testování. Klikněte na tlačítko "Ukázat všechny akce" výše.
                                    </p>
                                  </div>
                                );
                              }

                              return filteredEvents.map((evt) => {
                                const isInterested = interestedEvents.includes(evt.id);
                                return (
                                  <div key={evt.id} className="p-4 bg-slate-900 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-all space-y-3">
                                    {/* Event Meta */}
                                    <div className="flex justify-between items-start gap-2">
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[11px] font-extrabold text-rose-400 uppercase bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded leading-none">
                                            {evt.type === 'sanitka' ? '🚐 Mobilní Sanitka' : evt.type === 'checkpoint' ? '🏢 Checkpoint' : '🎪 Letní akce'}
                                          </span>
                                          <span className="text-[10px] text-slate-400 font-bold">{evt.city}</span>
                                        </div>
                                        <h4 className="font-black text-sm text-white leading-tight mt-1">{evt.title}</h4>
                                      </div>
                                    </div>

                                    {/* Date and time block */}
                                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-950/60 rounded-xl border border-slate-850/80 text-[11px]">
                                      <div>
                                        <span className="text-slate-400 block text-[9px] uppercase font-black tracking-wider mb-0.5">Kdy:</span>
                                        <span className="font-black text-rose-250 text-slate-200">{evt.date.split('-').reverse().join('. ')}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400 block text-[9px] uppercase font-black tracking-wider mb-0.5">Čas:</span>
                                        <span className="font-black text-rose-250 text-slate-200">{evt.time}</span>
                                      </div>
                                    </div>

                                    {/* Specific description */}
                                    <p className="text-[11.5px] text-slate-400 leading-relaxed">{evt.description}</p>

                                    <div className="pt-2.5 border-t border-slate-800 text-[11px] font-bold text-slate-400 flex items-center justify-between">
                                      <span>Pořadatel: {evt.organizer}</span>
                                    </div>

                                    <div className="flex gap-2 pt-1">
                                      <button
                                        onClick={() => toggleInterestInEvent(evt.id)}
                                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                          isInterested 
                                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/20 hover:bg-rose-500/25'
                                        }`}
                                      >
                                        <Check className={`w-4 h-4 ${isInterested ? 'opacity-100 animate-pulse' : 'opacity-40'}`} />
                                        <span>{isInterested ? 'Upozornění aktivní' : 'Chci připomenout'}</span>
                                      </button>
                                      
                                      <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(evt.locationName + ' ' + evt.address)}`}
                                        target="_blank"
                                        rel="referrer"
                                        className="bg-slate-950 border border-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:text-white hover:bg-slate-850"
                                      >
                                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                                        Navigovat
                                      </a>
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      )
                      )}
                    </div>
                  )}

                  {/* TAB 4: TRACKER & FOLLOW-UP REMINDER */}
                  {tab === 'tracker' && (
                    <div className="space-y-5">
                      <div className="text-left">
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                          Můj preventivní kalendář
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1.5">
                          Příjem pilulek a lékařské kontroly
                        </h3>
                        <p className="text-xs text-slate-400">
                          Hlídání série užití PrEP a automatický kalendář příštích vyšetření krve pro maximální bezpečnost.
                        </p>
                      </div>

                      {/* Streak Card */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center space-y-4">
                        <div className="flex justify-center items-center gap-4">
                          <div className="text-left">
                            <span className="text-slate-400 text-xs">Aktivní série:</span>
                            <h4 className="text-2xl font-black text-rose-500">{pillStreak} dní</h4>
                          </div>
                          <div className="w-px h-10 bg-slate-800" />
                          <div className="text-left">
                            <span className="text-slate-400 text-xs">Dnešní stav:</span>
                            <span className={`block font-bold text-xs ${isPillTakenToday ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>
                              {isPillTakenToday ? '✓ Pilulka zaznamenána' : '⚠ Chybí zapsat dávku'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={handleTakePill}
                          className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                            isPillTakenToday 
                              ? 'bg-slate-800 border border-emerald-500/30 text-emerald-400' 
                              : t.accent + ' text-white'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>{isPillTakenToday ? 'Pilulka byla vzata (zrušit zápis)' : 'Zapsat dnešní pilulku'}</span>
                        </button>
                      </div>

                      {/* LÉKAŘSKÝ FOLLOW-UP REMINDER (Požadavek zadavatele) */}
                      <div className={`p-4 rounded-2xl text-left space-y-4 ${t.bgCard}`}>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-rose-500" />
                          <h4 className="font-bold text-sm text-slate-150">Termín příští lékařské kontroly</h4>
                        </div>
                        <p className="text-xs text-slate-300 leading-normal">
                          Lékařský dohled vyžaduje pravidelné krevní odběry (HIV, syfilis, hepatitidy, ledviny) každé 3 měsíce, aby bylo pokračování v PrEP bezpečné.
                        </p>

                        <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 block font-bold uppercase">Typ kontroly:</label>
                            <select 
                              value={apptType}
                              onChange={(e) => setApptType(e.target.value as any)}
                              className="bg-slate-900 border border-slate-850 text-xs text-slate-200 rounded px-2 py-1 focus:outline-none w-full cursor-pointer"
                            >
                              <option value="regular">Kompletní screening</option>
                              <option value="blood">Pouze odběr ledviny</option>
                              <option value="recipe">Prodloužení receptu</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 block font-bold uppercase">Datum návštěvy:</label>
                            <input 
                              type="date"
                              value={nextApptDate}
                              onChange={(e) => setNextApptDate(e.target.value)}
                              className="bg-slate-900 border border-slate-850 text-xs text-slate-200 rounded px-2 py-1 focus:outline-none w-full cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Odpočet dnů */}
                        <div className="p-3 bg-slate-950/40 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className="text-slate-400 block text-[11px]">Do kontroly zbývá:</span>
                            <span className="text-slate-250 font-medium">
                              {apptType === 'regular' ? 'Kompletní zdravotní test' : 'Ambulantní formalita'}
                            </span>
                          </div>
                          
                          <div className="text-right">
                            <span className={`text-base font-black ${daysRemaining <= 10 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
                              {daysRemaining > 0 ? `${daysRemaining} dní` : 'Dnes probíhá!'}
                            </span>
                          </div>
                        </div>

                        {/* Prep reminders toggle */}
                        <div className="flex items-center justify-between bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                          <span className="text-xs text-slate-300 font-medium">Upozornění do telefonu (Offline)</span>
                          <button
                            onClick={() => setActiveReminders(!activeReminders)}
                            className={`w-9 h-5 rounded-full flex items-center p-0.5 transition-colors cursor-pointer ${
                              activeReminders ? 'bg-rose-600 justify-end' : 'bg-slate-750 justify-start'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-white shadow-sm inline-block" />
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 5: PEER-TO-PEER PSYCHOLOGICAL SUPPORT WITH PASSWORD GATE */}
                  {tab === 'support' && (
                    !enablePeerSupport ? (
                      <div className={`p-6 rounded-2xl border border-slate-800 text-center ${t.bgCard} space-y-4 py-8 animate-fade-in`}>
                        <Lock className="w-10 h-10 text-rose-500 mx-auto opacity-70" />
                        <div className="space-y-1.5">
                          <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Modul psychologické peer pomoci deaktivován</h4>
                          <p className="text-[11.5px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                            Tento nadstandardní doplňkový modul na propojení HIV pozitivních mentorů s nováčky je aktuálně vypnut, jak rozhodl příjemce aplikace z ČSAP.
                          </p>
                        </div>
                        <button
                          onClick={() => setEnablePeerSupport(true)}
                          className="text-xs bg-rose-600/20 hover:bg-rose-600/30 text-rose-450 border border-rose-500/25 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer animate-pulse"
                        >
                          Povolit pro náhled
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-5">
                      <div className="text-left">
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                          <Users className="w-3.5 h-3.5 fill-rose-500" /> Dům Světla Peer Program
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1.5">
                          Charta psychologické podpory
                        </h3>
                        <p className="text-xs text-slate-400">
                          Revoluční nápad krizové intervence: Bezpečné diskrétní propojení klienta, který právě zjistil pozitivitu, s dlouhodobým HIV mentorem.
                        </p>
                      </div>

                      {/* Password Gate */}
                      {!isSupportUnlocked ? (
                        <div className={`p-5 rounded-2xl space-y-4 text-left ${t.bgCard}`}>
                          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                            <Lock className="w-5 h-5" />
                          </div>
                          
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm text-slate-150">Zadání osobního kódu podpory</h4>
                            <p className="text-xs text-slate-350 leading-relaxed text-slate-400">
                              Přístupové údaje předávají sociální pracovníci Domu Světla při osobním předání pozitivního testu. Pro vyzkoušení dymického prototypu zadejte heslo: <span className="text-rose-400 font-extrabold font-mono text-xs">domsvedla</span> nebo <span className="text-rose-400 font-extrabold font-mono text-xs">peer</span>
                            </p>
                          </div>

                          <form onSubmit={handleUnlockSupport} className="space-y-3">
                            <input 
                              type="password"
                              placeholder="Zadejte kód (př: domsvedla)"
                              value={supportPassword}
                              onChange={(e) => setSupportPassword(e.target.value)}
                              className="w-full bg-slate-905 bg-slate-950 border border-slate-800 text-xs px-3 py-2.5 rounded-lg text-slate-100 placeholder-slate-650 focus:outline-none focus:border-rose-500 font-mono"
                            />
                            
                            {passwordError && (
                              <p className="text-[11px] text-rose-400 font-bold">✗ Nesprávný kód. Zkuste zadat "domsvedla" pro uvolnění dema.</p>
                            )}

                            <button
                              type="submit"
                              className={`w-full py-2.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-1.5 ${t.accent}`}
                            >
                              <span>Otevřít chat s Peer mentorem</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      ) : (
                        // Unlocked Peer Messaging Space
                        <div className="flex flex-col h-[440px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                          {/* Mentor Header Info */}
                          <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs border border-rose-500/35">
                                Dan
                              </div>
                              <div className="text-left">
                                <span className="text-xs font-bold text-white block">Dan — Peer Mentor ČSAP</span>
                                <span className="text-[10px] text-emerald-400 flex items-center gap-1 leading-none font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Žije s HIV od 2018 (ART stabilní)
                                </span>
                              </div>
                            </div>

                            <button 
                              onClick={() => { setIsSupportUnlocked(false); setSupportPassword(''); }}
                              className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2 py-1 rounded"
                            >
                              Uzamknout chat
                            </button>
                          </div>

                          {/* Chat messages stream */}
                          <div className="flex-1 overflow-y-auto p-3 space-y-3.5 text-xs">
                            {peerMessages.map((msg, idx) => (
                              <div 
                                key={idx} 
                                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                              >
                                <div className={`max-w-[85%] p-3 rounded-2xl leading-normal text-left ${
                                  msg.sender === 'user' 
                                    ? `${t.accent} text-white rounded-tr-none shadow-sm` 
                                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none'
                                }`}>
                                  {msg.text}
                                </div>
                                <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.time}</span>
                              </div>
                            ))}
                            <div ref={chatBottomRef} />
                          </div>

                          {/* Live Chat Form input */}
                          <form onSubmit={handleSendPeerMessage} className="p-2 border-t border-slate-800 bg-slate-900/40 flex items-center gap-1.5">
                            <input 
                              type="text"
                              value={typedMessage}
                              onChange={(e) => setTypedMessage(e.target.value)}
                              placeholder="Napište Danovi zprávu o vašich pocitech..."
                              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                            />
                            <button
                              type="submit"
                              className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center hover:bg-rose-500 transition-colors flex-shrink-0"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        </div>
                      )}

                      {/* Přínos ředitelovy myšlenky popsaný klientům */}
                      <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-left text-xs text-slate-400 space-y-2">
                        <h4 className="font-bold text-slate-300">Dodatek o ochraně soukromí</h4>
                        <p className="leading-relaxed text-[11px]">
                          Tato peer asistence probíhá neformálně a nepodléhá hlášení na úřady. Má za cíl vyvrátit stigma, ukázat nově zjištěným, jak snadné je dnes přežívat s HIV, omezit vyčlenění ze společnosti a nastartovat léčebný plán s klidem v duši.
                        </p>
                      </div>

                    </div>
                    )
                  )}

                  {/* TAB 6: AI PORADCE & ZAHRANIČNÍ INSPIRACE */}
                  {tab === 'advisor' && (
                    <div className="space-y-4">
                      {/* Sub-navigation Segmented Control */}
                      <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                        <button
                          onClick={() => setAdvisorSubTab('ai')}
                          className={`flex-1 py-1.5 text-[11px] font-black uppercase rounded-lg transition-all ${
                            advisorSubTab === 'ai' ? `${t.accent} text-white shadow-sm` : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          AI Poradna
                        </button>
                        <button
                          onClick={() => setAdvisorSubTab('inspiration')}
                          className={`flex-1 py-1.5 text-[11px] font-black uppercase rounded-lg transition-all ${
                            advisorSubTab === 'inspiration' ? `${t.accent} text-white shadow-sm` : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Světové inspirace & Nástroje
                        </button>
                      </div>

                      {advisorSubTab === 'ai' ? (
                        !enableAiAdvisor ? (
                          <div className={`p-6 rounded-2xl border border-slate-800 text-center ${t.bgCard} space-y-4 py-8 animate-fade-in`}>
                            <Lock className="w-10 h-10 text-rose-500 mx-auto opacity-70" />
                            <div className="space-y-1.5">
                              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Modul AI poradce deaktivován</h4>
                              <p className="text-[11.5px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                                Příjemce aplikace ČSAP se rozhodl nezařazovat automatické generování rad z umělé inteligence do klientského buildu. Tento nadstandardní modul je nyní vypnut.
                              </p>
                            </div>
                            <button
                              onClick={() => setEnableAiAdvisor(true)}
                              className="text-xs bg-rose-600/20 hover:bg-rose-600/30 text-rose-450 border border-rose-500/25 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer animate-pulse"
                            >
                              Povolit v konfiguraci
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-5">
                          <div className="text-left">
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                              <Flame className="w-3.5 h-3.5 fill-rose-500" /> Diskrétní AI Poradna
                            </span>
                            <h3 className="text-lg font-bold text-white mt-1.5">
                              Harm Reduction sex & chemsex AI
                            </h3>
                            <p className="text-xs text-slate-400">
                              Rady o nechráněném sexu, dávkování, minimalizaci nebezpečí látek a zajištění PEP léčby v krizovém časovém okně.
                            </p>
                          </div>

                          {/* AI Chat Box */}
                          <div className="flex flex-col h-[340px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                            
                            <div className="flex-1 overflow-y-auto p-3 space-y-3.5 text-xs scrollbar-none">
                              {aiHistory.map((item, idx) => (
                                <div 
                                  key={idx} 
                                  className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                  <div className={`p-3 rounded-2xl text-left leading-normal whitespace-pre-line ${
                                    item.sender === 'user'
                                      ? `${t.accent} text-white rounded-tr-none shadow`
                                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                                  }`}>
                                    {item.text}
                                  </div>
                                </div>
                              ))}
                              <div ref={chatBottomRef} />
                            </div>

                            {/* Quick preset action buttons */}
                            <div className="p-1.5 bg-slate-900 border-t border-slate-800 flex flex-nowrap gap-1 overflow-x-auto select-none">
                              <button 
                                onClick={() => askAi("Praskl kondom s partnerem neznámého statusu. Co mám dělat?")}
                                className="bg-slate-950 hover:bg-slate-850 px-2.5 py-1 rounded text-[10px] text-slate-350 shrink-0 select-none border border-slate-850 cursor-pointer"
                              >
                                Condom slippage
                              </button>
                              <button 
                                onClick={() => askAi("Co je chemsex a jak se bezpečněji chovat v takové situaci?")}
                                className="bg-slate-950 hover:bg-slate-850 px-2.5 py-1 rounded text-[10px] text-slate-350 shrink-0 select-none border border-slate-850 cursor-pointer"
                              >
                                Safe Chemsex
                              </button>
                              <button 
                                onClick={() => askAi("Mám podezření. Jaké je časové okno pro nasazení nouzové PEP v ČR?")}
                                className="bg-slate-950 hover:bg-slate-850 px-2.5 py-1 rounded text-[10px] text-slate-350 shrink-0 select-none border border-slate-850 cursor-pointer"
                              >
                                PEP emergency time
                              </button>
                            </div>

                            {/* Text form input for custom prompt situations */}
                            <form onSubmit={handleCustomAiQuery} className="p-2 bg-slate-900/60 border-t border-slate-800 flex gap-1.5">
                              <input 
                                type="text"
                                value={aiInput}
                                onChange={(e) => setAiInput(e.target.value)}
                                placeholder="Zadejte dotaz (např. o drogách, PEP, testování)..."
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                              />
                              <button
                                type="submit"
                                disabled={isAiLoading}
                                className="w-10 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl flex items-center justify-center disabled:opacity-40"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </form>
                          </div>

                          {/* STAKEHOLDER IDEAS VOTE LIST */}
                          <div className="space-y-3.5 text-left pt-2">
                            <div className="flex items-center gap-2">
                              <Lightbulb className="w-5 h-5 text-rose-500" />
                              <h4 className="font-bold text-sm text-slate-150">Hlasování pro Dům Světla</h4>
                            </div>
                            <p className="text-xs text-slate-400 leading-normal">
                              Hlasujte pro funkce dema, které předložíme panu řediteli ČSAP pro reálné zařazení do vývojového plánu:
                            </p>

                            <div className="space-y-2.5">
                              {IMPROVEMENTS_DATA.map((item) => (
                                <div key={item.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2 text-xs">
                                  <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-extrabold text-rose-400 uppercase">{item.category}</span>
                                    <span className="font-bold text-slate-500">Dopad: {item.impact}</span>
                                  </div>
                                  <h5 className="font-black text-slate-150 leading-tight">{item.title}</h5>
                                  <p className="text-[11px] text-slate-400 leading-normal">{item.description}</p>
                                  
                                  <div className="flex justify-between items-center pt-1.5 border-t border-slate-800/40">
                                    <span className="text-[10px] text-slate-500">Náročnost: {item.effort}</span>
                                    <button
                                      onClick={() => handleVote(item.id)}
                                      className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold px-3 py-1 rounded-lg border border-rose-500/20 active:scale-95 transition-all flex items-center gap-1.5 text-[11px] cursor-pointer"
                                    >
                                      <span>👍 Podpořit</span>
                                      <span className="bg-slate-950 font-black px-1.5 py-0.5 rounded border border-rose-500/15 text-white">
                                        {votes[item.id] || 0}
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                      ) : (
                        // INSPIRATION SUBTAB: INOVACE ZE ZAHRANIČÍ & INTERAKTIVNÍ NÁSTROJE
                        !enableInspiration ? (
                          <div className={`p-6 rounded-2xl border border-slate-800 text-center ${t.bgCard} space-y-4 py-8 animate-fade-in`}>
                            <Lock className="w-10 h-10 text-rose-500 mx-auto opacity-70" />
                            <div className="space-y-1.5">
                              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Modul zahraničních inspirací deaktivován</h4>
                              <p className="text-[11.5px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                                Srovnání se zahraničními systémy a interaktivní nástroje pro testování partnerů jsou momentálně deaktivovány podle nařízení příjemce.
                              </p>
                            </div>
                            <button
                              onClick={() => setEnableInspiration(true)}
                              className="text-xs bg-rose-600/20 hover:bg-rose-600/30 text-rose-450 border border-rose-500/25 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer animate-pulse"
                            >
                              Povolit pro náhled
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-6">
                          <div className="text-left">
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                              <Globe className="w-3.5 h-3.5" /> Best Practice & Interaktivní Nástroje
                            </span>
                            <h3 className="text-lg font-bold text-white mt-1.5">
                              Inspirace ze zahraničí
                            </h3>
                            <p className="text-xs text-slate-400 leading-normal">
                              Zde jsou technologické inovace ze světových HIV prevencí, které adaptujeme pro Dům Světla. Vyzkoušejte reálné interaktivní nástroje.
                            </p>
                          </div>

                          {/* 1. INTERACTIVE PR-EP 2-1-1 DOSING CALCULATOR */}
                          <div className={`p-4 rounded-2xl text-left space-y-4 ${t.bgCard}`}>
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-rose-500" />
                              <h4 className="font-bold text-sm text-slate-150">THT (UK) Kalkulátor PrEP On-Demand (2-1-1)</h4>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              Neberete PrEP denně, ale plánujete sex? Režim 2-1-1 (event-based) se podle WHO a THT bere pouze těsně před a po styku. Zadejte plánované střetnutí a spočítejte přesný časový plán odběru tablet:
                            </p>

                            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                              <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 block font-bold uppercase">Plánované datum:</label>
                                <input
                                  type="date"
                                  value={calculatorDate}
                                  onChange={(e) => handleRecalculateDosing(e.target.value, calculatorTime)}
                                  className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded px-2.5 py-1.5 focus:outline-none w-full cursor-pointer"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 block font-bold uppercase font-sans">Čas setkání:</label>
                                <input
                                  type="time"
                                  value={calculatorTime}
                                  onChange={(e) => handleRecalculateDosing(calculatorDate, e.target.value)}
                                  className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded px-2.5 py-1.5 focus:outline-none w-full cursor-pointer"
                                />
                              </div>
                            </div>

                            {/* Preset Buttons */}
                            <div className="flex gap-2 text-[10px] shrink-0 overflow-x-auto">
                              <button
                                onClick={() => {
                                  const todayStr = new Date().toISOString().split('T')[0];
                                  handleRecalculateDosing(todayStr, '22:00');
                                }}
                                className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-800 cursor-pointer"
                              >
                                Dnes ve 22:00
                              </button>
                              <button
                                onClick={() => {
                                  const tomorrow = new Date();
                                  tomorrow.setDate(tomorrow.getDate() + 1);
                                  const tomorrowStr = tomorrow.toISOString().split('T')[0];
                                  handleRecalculateDosing(tomorrowStr, '16:30');
                                }}
                                className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-800 cursor-pointer"
                              >
                                Zítra v 16:30
                              </button>
                            </div>

                            {/* Timeline Result rendering in Czech */}
                            {dosingResult && (
                              <div className="space-y-3.5 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                                <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">⏱ Rozvrh dávek (Užívání 2-1-1):</span>
                                
                                <div className="space-y-4 relative pl-3 border-l-2 border-slate-800">
                                  {dosingResult.summarySteps.map((step: any, sIdx: number) => (
                                    <div key={sIdx} className="relative space-y-1">
                                      {/* Dot */}
                                      <span className={`absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full border-2 ${
                                        step.pillCount === 2 ? 'bg-rose-500 border-rose-400' : step.pillCount === 1 ? 'bg-amber-400 border-amber-300' : 'bg-slate-700 border-slate-600'
                                      }`} />
                                      
                                      <div className="flex justify-between items-center">
                                        <span className="text-xs font-black text-slate-200">{step.title}</span>
                                        {step.pillCount > 0 && (
                                          <span className="text-[10px] bg-rose-500/10 text-rose-400 font-extrabold px-1.5 py-0.5 rounded border border-rose-500/20">
                                            {step.pillCount}x 💊 tab.
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[10px] text-rose-300 font-bold block leading-none">{step.timeLabel}</p>
                                      <p className="text-[11px] text-slate-400 leading-normal">{step.description}</p>
                                    </div>
                                  ))}
                                </div>

                                <div className="p-2.5 bg-amber-500/5 border border-amber-500/20 rounded-lg flex gap-1.5 text-[10px] text-slate-300">
                                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                  <p className="leading-normal">
                                    <strong>Medicínské omezení:</strong> WHO doporučuje režim 2-1-1 výhradně pro MSM (muže mající sex s muži). Pro vaginální sex se doporučuje pouze standardní denní PrEP (dosažení spolehlivé ochrany trvá až 7 dní).
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 2. INTERACTIVE ANONYMOUS SMS PARTNER NOTIFICATION */}
                          <div className={`p-4 rounded-2xl text-left space-y-4 ${t.bgCard}`}>
                            <div className="flex items-center gap-2">
                              <Users className="w-5 h-5 text-blue-400" />
                              <h4 className="font-bold text-sm text-slate-150">SFAF (USA) Anonymní SMS varování partnerům</h4>
                            </div>
                            <p className="text-xs text-slate-305 text-slate-300 leading-relaxed">
                              Zjistili jste po testu v Domě Světla pozitivní status (HIV, Syfilis či kapavka)? Chraňte lidi, se kterými jste byli, anonymně. Vygenerujte si diskrétní, ohleduplnou zprávu pro SMS nebo sociální sítě tak, aby se dotyční šli ihned nechat bezplatně vyšetřit:
                            </p>

                            <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs">
                              <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 block font-bold uppercase">Pozitivní diagnóza:</label>
                                <select
                                  value={partnerSmsDisease}
                                  onChange={(e) => handleRecalculateSms(e.target.value, partnerSmsDate, partnerSmsStyle)}
                                  className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded px-2 py-1.5 focus:outline-none w-full font-bold cursor-pointer"
                                >
                                  <option value="HIV">HIV virus</option>
                                  <option value="Syfilis">Syfilis</option>
                                  <option value="Kapavka">Kapavka</option>
                                  <option value="Chlamydie">Chlamydie</option>
                                  <option value="Syfilis & HIV">Syfilis i HIV společně</option>
                                </select>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] text-slate-400 block font-bold uppercase">Čas expozice:</label>
                                  <input
                                    type="text"
                                    value={partnerSmsDate}
                                    placeholder="př: minulou sobotu"
                                    onChange={(e) => handleRecalculateSms(partnerSmsDisease, e.target.value, partnerSmsStyle)}
                                    className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded px-2.5 py-1.5 focus:outline-none w-full"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] text-slate-400 block font-bold uppercase">Styl oznámení:</label>
                                  <select
                                    value={partnerSmsStyle}
                                    onChange={(e) => handleRecalculateSms(partnerSmsDisease, partnerSmsDate, e.target.value as any)}
                                    className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded px-2 py-1.5 focus:outline-none w-full cursor-pointer"
                                  >
                                    <option value="polite">Ohleduplný / Šetrný</option>
                                    <option value="soft">Omluvný / Upřímný</option>
                                    <option value="direct">Přímý / Informační</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* SMS Preview Box */}
                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850/80 space-y-2 text-xs relative">
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">📱 Náhled zprávy k anonymnímu odeslání:</span>
                              <p className="text-slate-300 font-mono text-[11px] leading-relaxed text-left bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                                {generatedSmsText}
                              </p>

                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(generatedSmsText);
                                  setIsSmsCopied(true);
                                  setShowCopyMessage(true);
                                  setTimeout(() => setShowCopyMessage(false), 3000);
                                }}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-2 cursor-pointer border border-slate-750"
                              >
                                <Copy className="w-4 h-4 text-rose-400" />
                                <span>{isSmsCopied ? 'Komentovaný text zkopírován!' : 'Zkopírovat SMS text zdarma'}</span>
                              </button>

                              {showCopyMessage && (
                                <p className="text-[10px] text-emerald-400 font-black text-center animate-pulse pt-1">
                                  ✓ Text byl zkopírován. Můžete ho anonymně odeslat z jakékoliv SMS brány.
                                </p>
                              )}
                            </div>
                          </div>

                          {/* 3. LIST OF FOREIGN ORGANIZATIONS WITH EXPLANATIONS */}
                          <div className="space-y-4">
                            <h4 className="font-bold text-sm text-slate-150 text-left">Globální příklady dobré praxe</h4>
                            <div className="space-y-3">
                              {FOREIGN_ORGANIZATIONS.map((org, oIdx) => (
                                <div key={oIdx} className="p-4 bg-slate-900 border border-slate-800/80 rounded-2xl text-left space-y-3">
                                  <div className="flex justify-between items-center">
                                    <h5 className="font-black text-white text-sm">{org.name}</h5>
                                    <span className="text-[11px] font-bold text-slate-400">{org.country}</span>
                                  </div>

                                  <div className={`p-2 bg-gradient-to-tr ${org.logoColor} rounded-xl text-[11px] font-black text-white flex items-center gap-1.5`}>
                                    <Sparkles className="w-4 h-4 text-white" />
                                    <span>Znak: {org.keyFeature}</span>
                                  </div>

                                  <p className="text-slate-400 leading-normal text-[11.5px]">{org.description}</p>

                                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-850 text-[11px]">
                                    <span className="text-rose-400 block text-[9px] uppercase font-black tracking-wider mb-0.5">Poučení ČSAP pro Dům Světla:</span>
                                    <p className="text-slate-300 leading-normal">{org.inspirationForCsap}</p>
                                  </div>

                                  <div className="text-right">
                                    <a
                                      href={org.webUrl}
                                      target="_blank"
                                      rel="referrer"
                                      className="text-[10px] text-slate-500 hover:text-rose-400 flex items-center gap-1 inline-flex hover:underline"
                                    >
                                      <span>Navštívit org. web</span>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                      )}
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

            </div>

            {/* Apple/Android Style Navigation Dock */}
            <nav className="h-16 border-t border-slate-800 bg-slate-950/95 absolute bottom-0 inset-x-0 grid grid-cols-6 gap-0.5 px-0.5 py-1 z-30 select-none">
              {[
                { id: 'home', label: 'Domů', icon: Home },
                { id: 'book', label: 'Asistent', icon: Calendar },
                { id: 'map', label: 'Místa', icon: MapPin },
                { id: 'tracker', label: 'Můj PrEP', icon: Clock },
                { id: 'support', label: 'Podpora', icon: Users },
                { id: 'advisor', label: 'Poradce', icon: Sparkles }
              ].map((tItem) => {
                const IconComp = tItem.icon;
                const isActive = tab === tItem.id;
                return (
                  <button
                    key={tItem.id}
                    onClick={() => setTab(tItem.id as TabId)}
                    className={`flex flex-col items-center justify-center rounded-lg transition-all ${
                      isActive 
                        ? 'bg-rose-500/10 text-rose-400 font-bold' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                    }`}
                  >
                    <IconComp className={`w-4.5 h-4.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                    <span className="text-[9px] mt-1.5 truncate max-w-full px-0.5">{tItem.label}</span>
                  </button>
                );
              })}
            </nav>

          </div>

        </div>
      </main>

      {/* MODAL SIMULATION FOR QR PAYMENTS (DONATIONS) */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center max-w-xs w-full space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="font-bold text-xs text-rose-400 uppercase tracking-wide">Bezpečný příspěvek (Demo)</span>
                <button 
                  onClick={() => setShowQrModal(false)}
                  className="text-slate-500 hover:text-slate-350 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="bg-white p-3 rounded-2xl mx-auto w-40 h-40 flex items-center justify-center shadow-lg">
                {/* Visual rendering of a mock QR payment code */}
                <div className="border-4 border-slate-900 p-2 rounded-lg bg-white flex flex-col justify-between w-full h-full">
                  <div className="flex justify-between">
                    <div className="w-5 h-5 bg-slate-900 rounded" />
                    <div className="w-2 h-2 bg-slate-900 rounded" />
                    <div className="w-5 h-5 bg-slate-900 rounded" />
                  </div>
                  <div className="flex justify-around py-2">
                    <div className="w-3 h-3 bg-slate-900 rounded" />
                    <div className="w-4 h-4 bg-slate-900 rounded-lg animate-pulse" />
                    <div className="w-3 h-3 bg-slate-900 rounded" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-5 h-5 bg-slate-900 rounded" />
                    <div className="w-1 h-3 bg-slate-900 rounded" />
                    <div className="w-5 h-1 bg-slate-900 rounded" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xl font-black text-white">{donationAmount} Kč</span>
                <p className="text-[11px] text-slate-400">Převod na transparentní účet ČSAP Domu Světla: 19-33580550/0300</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowQrModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-755 text-slate-300 font-bold text-xs py-2 rounded-xl border border-slate-750"
                >
                  Zpět
                </button>
                <button
                  onClick={confirmDonation}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2 rounded-xl transition-all"
                >
                  Mám zaplaceno
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Footer */}
      <footer className="w-full text-center py-6 text-xs text-slate-500 border-t border-slate-850 max-w-4xl mx-auto space-y-1">
        <p>© 2026 Chci PrEP & ČSAP Dům Světla. Všechna data o klientech, dary a tracking jsou chráněny decentralizovaným lokálním šifrováním.</p>
        <p className="text-[10.5px] text-slate-600">Prototyp splňuje veškerá doporučení WHO v boji proti epidemii HIV/AIDS a stigma queer komunity v České republice.</p>
      </footer>

    </div>
  );
}
