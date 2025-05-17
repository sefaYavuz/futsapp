export interface Location {
  id: string;
  name: string;
  image: any; // Using 'any' for now since we're using require for images
}

export const LOCATIONS: Record<string, Location> = {
  'futsal-arena-centrum': {
    id: 'futsal-arena-centrum',
    name: 'Futsal Arena Centrum',
    image: require('@/assets/images/zuidhaghe.webp'),
  },
  'sportcentrum-west': {
    id: 'sportcentrum-west',
    name: 'Sportcentrum West',
    image: require('@/assets/images/zuidhaghe.webp'),
  },
  'futsal-club-oost': {
    id: 'futsal-club-oost',
    name: 'Futsal Club Oost',
    image: require('@/assets/images/zuidhaghe.webp'),
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