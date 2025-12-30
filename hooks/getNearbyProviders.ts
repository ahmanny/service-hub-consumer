import { getDirections } from "@/services/directions.service";
import { ProviderProfile } from "@/types/provider.types";
import { getDistance } from "geolib";

export interface ProviderWithRoute extends ProviderProfile {
  distance: number | null;
  duration: number | null;
  directionCoordinates: any;
  isCloser: boolean
}

type LocationTuple = [number, number]; // [longitude, latitude]

/**
 * Returns the top N nearby providers for a given service type
 * @param providers - Array of all providers
 * @param service - Service type to filter by
 * @param userLocation - Current user location [longitude, latitude]
 * @param maxDistance - Maximum distance in meters (default 2000)
 */
export async function getNearbyProviders(
  providers: ProviderProfile[],
  service: string,
  userLocation: LocationTuple,
  maxDistance = 2000
): Promise<ProviderWithRoute[]> {

  // filter providers by service type
  const filtered = providers.filter((p) => p.service === service);

  // calculate distance for each provider and filter by maxDistance
  const nearbyWithDistance = filtered
    .map((p) => {
      const distance = getDistance(
        { latitude: userLocation[1], longitude: userLocation[0] },
        { latitude: p.location.latitude, longitude: p.location.longitude }
      );
      return { ...p, distance };
    })
    .filter((p) => p.distance <= maxDistance);

  // sort by distance ascending
  nearbyWithDistance.sort((a, b) => a.distance - b.distance);

  const results = await Promise.all(
    nearbyWithDistance.slice(0, 3).map(async (provider) => {
      try {
        const providerLocation: LocationTuple = [
          provider.location.longitude,
          provider.location.latitude,
        ];

        const direction = await getDirections(userLocation, providerLocation);
        const route = direction?.routes?.[0];

        return {
          ...provider,
          distance: route?.distance ?? null,
          duration: route?.duration ?? null,
          directionCoordinates: route?.geometry?.coordinates ?? null,
        };
      } catch (error) {
        console.error(
          `Failed to fetch directions for provider ${provider._id}`,
          error
        );

        return {
          ...provider,
          distance: null,
          duration: null,
          directionCoordinates: null,
        };
      }
    })
  );

  // figure out the closest provider and mark isCloser
  let minDistance = Infinity;
  let closestIndex = -1;

  results.forEach((provider, index) => {
    if (provider.distance != null && provider.distance < minDistance) {
      minDistance = provider.distance;
      closestIndex = index;
    }
  });

  return results.map((provider, index) => ({
    ...provider,
    isCloser: index === closestIndex,
  }));
}

