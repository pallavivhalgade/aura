export interface Theme {
  name: string;
  displayName: string;
  colors: {
    '--gradient-start': string;
    '--gradient-via': string;
    '--gradient-end': string;
    '--primary': string;
    '--primary-hover': string;
    '--user-bubble-bg': string;
    '--user-bubble-text': string;
    '--avatar-gradient-start': string;
    '--avatar-gradient-end': string;
  };
}

export const themes: Theme[] = [
  {
    name: 'aura-default',
    displayName: 'Aura Default',
    colors: {
      '--gradient-start': '#e0e7ff', // indigo-100
      '--gradient-via': '#f3e8ff', // purple-100
      '--gradient-end': '#ffe4e6', // pink-100
      '--primary': '#6366f1', // indigo-500
      '--primary-hover': '#4f46e5', // indigo-600
      '--user-bubble-bg': '#6366f1', // indigo-500
      '--user-bubble-text': '#ffffff', // white
      '--avatar-gradient-start': '#a78bfa', // purple-400
      '--avatar-gradient-end': '#6366f1', // indigo-500
    },
  },
  {
    name: 'sunset-peach',
    displayName: 'Sunset Peach',
    colors: {
      '--gradient-start': '#fff1f2', // rose-50
      '--gradient-via': '#ffedd5', // orange-100
      '--gradient-end': '#fef3c7', // amber-100
      '--primary': '#f97316', // orange-500
      '--primary-hover': '#ea580c', // orange-600
      '--user-bubble-bg': '#f97316', // orange-500
      '--user-bubble-text': '#ffffff', // white
      '--avatar-gradient-start': '#fb923c', // orange-400
      '--avatar-gradient-end': '#f43f5e', // rose-500
    },
  },
  {
    name: 'oceanic-teal',
    displayName: 'Oceanic Teal',
    colors: {
      '--gradient-start': '#ecfdf5', // emerald-50
      '--gradient-via': '#cffafe', // cyan-100
      '--gradient-end': '#e0f2fe', // sky-100
      '--primary': '#14b8a6', // teal-500
      '--primary-hover': '#0d9488', // teal-600
      '--user-bubble-bg': '#14b8a6', // teal-500
      '--user-bubble-text': '#ffffff', // white
      '--avatar-gradient-start': '#22d3ee', // cyan-400
      '--avatar-gradient-end': '#34d399', // emerald-400
    },
  },
];