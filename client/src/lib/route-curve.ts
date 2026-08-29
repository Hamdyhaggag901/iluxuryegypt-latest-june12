// Turns a straight-line chain of waypoints into a gently curved path —
// purely decorative (no real routing data), just enough bend per segment to
// read as a hand-drawn travel route rather than a rigid straight line.

type LatLng = [number, number];

function quadraticBezierPoints(p0: LatLng, control: LatLng, p1: LatLng, steps: number): LatLng[] {
  const points: LatLng[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * control[0] + t ** 2 * p1[0];
    const lng = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * control[1] + t ** 2 * p1[1];
    points.push([lat, lng]);
  }
  return points;
}

/**
 * @param bendRatio How far the control point is offset perpendicular to the
 * segment, as a fraction of the segment's length. Alternates side per
 * segment so a multi-stop route reads as a gentle wave, not a single arc.
 */
export function buildCurvedRoute(waypoints: LatLng[], bendRatio = 0.08, stepsPerSegment = 16): LatLng[] {
  if (waypoints.length < 2) return waypoints;

  const curved: LatLng[] = [waypoints[0]];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const [lat0, lng0] = waypoints[i];
    const [lat1, lng1] = waypoints[i + 1];
    const midLat = (lat0 + lat1) / 2;
    const midLng = (lng0 + lng1) / 2;

    // Perpendicular offset, alternating side per segment for a natural wave.
    const dLat = lat1 - lat0;
    const dLng = lng1 - lng0;
    const side = i % 2 === 0 ? 1 : -1;
    const control: LatLng = [midLat - dLng * bendRatio * side, midLng + dLat * bendRatio * side];

    const segment = quadraticBezierPoints(waypoints[i], control, waypoints[i + 1], stepsPerSegment);
    curved.push(...segment.slice(1)); // drop the first point — it duplicates the previous segment's last point
  }
  return curved;
}
