export interface Location {
  id: string;
  name: string;
  image: any; // Using 'any' for now since we're using require for images
  address: string;
}

export const LOCATIONS: Record<string, Location> = {
  'zuidhaghe': {
    id: 'zuidhaghe',
    name: 'Zuidhaghe',
    image: require('@/assets/images/zuidhaghe.webp'),
    address: 'Beresteinlaan 625-H, 2543 CE Den Haag, Nederland',
  },
  'sportcentrum-west': {
    id: 'sportcentrum-west',
    name: 'Sportcentrum West',
    image: require('@/assets/images/zuidhaghe.webp'),
    address: 'Sportcentrum West, 1067 Amsterdam, Netherlands',
  },
  'futsal-club-oost': {
    id: 'futsal-club-oost',
    name: 'Futsal Club Oost',
    image: require('@/assets/images/zuidhaghe.webp'),
    address: 'Futsal Club Oost, 1091 Amsterdam, Netherlands',
  },
};

// Helper function to get location by name
export const getLocationByName = (name: string): Location | undefined => {
  return Object.values(LOCATIONS).find(location => location.name === name);
};

// Helper function to get location by id
export const getLocationById = (id: string): Location | undefined => {
  return LOCATIONS[id];
}; 