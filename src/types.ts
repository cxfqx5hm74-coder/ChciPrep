export interface Center {
  name: string;
  city: string;
  type: 'PrEP point' | 'PrEP ordinace';
  address: string;
  phone: string;
  email?: string;
  href: string;
  note?: string;
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  days: string[];
  active: boolean;
}

export interface Improvement {
  id: string;
  title: string;
  description: string;
  impact: 'Vysoký' | 'Střední' | 'Nízký';
  effort: 'Vysoká' | 'Střední' | 'Nízká';
  category: string;
}

export type TabId = 'home' | 'book' | 'map' | 'tracker' | 'support' | 'advisor';
