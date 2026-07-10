import { httpGet } from '../lib/http';
import type { Dataset, Diagnostic } from '../types';

const title =
  'Geolocation (browser + //nominatim.openstreetmap.org/reverse)';

async function run(): Promise<Dataset> {
  const dataset: Dataset = {
    title,
    header: ['display_name', 'latitude', 'longitude'],
    data: [],
  };

  if (!('geolocation' in navigator)) {
    dataset.data.push(['err: geolocation API not available']);
    return dataset;
  }

  let position: GeolocationPosition;
  try {
    position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        // timeout does not take into account the authorization waiting time
        timeout: 20_000,
        maximumAge: 0,
        enableHighAccuracy: true,
      });
    });
  } catch (err) {
    const message = (err as GeolocationPositionError).message ?? String(err);
    dataset.data.push([`err: could not get position, error was ${message}`]);
    return dataset;
  }

  const { latitude, longitude } = position.coords;

  try {
    const res = await httpGet('https://nominatim.openstreetmap.org/reverse', {
      timeout: 20_000,
      query: {
        format: 'json',
        lat: latitude,
        lon: longitude,
        addressdetails: 1,
      },
    });
    const body = (await res.json()) as { display_name?: string };
    dataset.data.push([body.display_name ?? 'n/a', latitude, longitude]);
  } catch (err) {
    dataset.data.push([
      `err: could not reverse geocode position, error was ${err}`,
      latitude,
      longitude,
    ]);
  }

  return dataset;
}

export const geolocation: Diagnostic = { title, run };
