interface Coordinates {
  latitude: number;
  longitude: number;
}

interface RouteInfo {
  coordinates: Coordinates[];
  duration: number; // in seconds
  distance: number; // in meters
}

export async function getRouteCoordinates(
  start: Coordinates,
  end: Coordinates
): Promise<RouteInfo> {
  try {
    // OSRM API endpoint with full geometry for accurate driving directions
    const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson&alternatives=false`;
    
    console.log('📍 Fetching route...');
    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 'Ok') {
      throw new Error('Failed to get route');
    }

    const route = data.routes[0];
    
    // Convert GeoJSON coordinates to {latitude, longitude} format
    const coordinates = route.geometry.coordinates.map((coord: [number, number]) => ({
      latitude: coord[1],
      longitude: coord[0],
    }));

    return {
      coordinates,
      duration: route.duration,
      distance: route.distance
    };
  } catch (error) {
    console.error('📍 Route calculation failed');
    // Fallback to straight line if routing fails
    return {
      coordinates: [start, end],
      duration: 0,
      distance: 0
    };
  }
} 