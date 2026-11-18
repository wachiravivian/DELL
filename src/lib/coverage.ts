// lat and lng: the middle of the fibre zone. radius: how far the zone reaches, in metres.
// Example (format only, not a real place):  { name: "Lenana", lat: 0.0000, lng: 0.0000, radius: 700 },
export type Area = { name: string; aliases?: string[]; lat?: number; lng?: number; radius?: number };

export const DEFAULT_RADIUS = 600; // used when an area has coordinates but no radius

export const areas: Area[] = [
  { name: "London" },
  { name: "Lenana" },
  { name: "Adams Park" },
  { name: "Macedonia" },
  { name: "Imani House" },
  { name: "Total" },
  { name: "Father Ndaiya", aliases: ["father ntaiya", "ntaiya", "ndaiya"] },
  { name: "Narok CBD", aliases: ["narok town", "cbd"] },
  { name: "Bobong" },
  { name: "Utawala" },
  { name: "Majengo" },
  { name: "Upper Hill", aliases: ["upperhill"] },
  { name: "K24" },
  { name: "Mwamba" },
  { name: "Joyland Estate", aliases: ["joyland"] },
];

export const hasZones = areas.some((a) => a.lat !== undefined && a.lng !== undefined);

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

export function findArea(input: string): Area | undefined {
  const q = norm(input);
  if (q.length < 2) return undefined;
  const names = (a: Area) => [a.name, ...(a.aliases ?? [])].map(norm);
  return (
    areas.find((a) => names(a).includes(q)) ??
    areas.find((a) => names(a).some((n) => n.includes(q) || q.includes(n)))
  );
}

// Distance between two points on the map, in metres
function distanceM(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Which fibre zones contain this point?
export function zonesAt(lat: number, lng: number): Area[] {
  return areas.filter(
    (a) =>
      a.lat !== undefined &&
      a.lng !== undefined &&
      distanceM(lat, lng, a.lat, a.lng) <= (a.radius ?? DEFAULT_RADIUS)
  );
}