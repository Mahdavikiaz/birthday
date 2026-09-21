'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

import { EASE } from '@/lib/motion';
import { buildRoute, getNextStop, hasCoordinates } from '@/lib/tracking/normalize';
import type { NormalizedTracking, TrackingPlace } from '@/lib/tracking/types';

/**
 * Not a map of Indonesia — a drawing of the hops SPX actually reported.
 * Only coordinates present in the response are plotted; nothing is invented,
 * and an empty `next_location` simply means no next marker.
 */

const WIDTH = 340;
const HEIGHT = 210;
const PAD_X = 52;
const PAD_Y = 40;

type Plotted = { place: TrackingPlace; x: number; y: number };

function project(places: TrackingPlace[]): Plotted[] {
  const usable = places.filter(hasCoordinates);
  if (usable.length === 0) return [];

  const lats = usable.map((place) => place.latitude as number);
  const lngs = usable.map((place) => place.longitude as number);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latSpan = Math.max(maxLat - minLat, 0.0001);
  const lngSpan = Math.max(maxLng - minLng, 0.0001);

  const availableWidth = WIDTH - PAD_X * 2;
  const availableHeight = HEIGHT - PAD_Y * 2;
  // One scale for both axes so the shape of the route isn't distorted.
  const scale = Math.min(availableWidth / lngSpan, availableHeight / latSpan);

  const midLat = (minLat + maxLat) / 2;
  const midLng = (minLng + maxLng) / 2;

  return usable.map((place) => ({
    place,
    x: WIDTH / 2 + ((place.longitude as number) - midLng) * scale,
    y: HEIGHT / 2 - ((place.latitude as number) - midLat) * scale,
  }));
}

/** A gentle arc between two hubs — movement, not a GPS trace. */
function arc(from: Plotted, to: Plotted): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy);
  if (distance < 1) return '';
  const radius = distance * 1.7;
  return `M ${from.x} ${from.y} A ${radius} ${radius} 0 0 1 ${to.x} ${to.y}`;
}

function shorten(name: string | null): string {
  if (!name) return '';
  return name.length > 22 ? `${name.slice(0, 21)}…` : name;
}

export default function TrackingMap({ tracking }: { tracking: NormalizedTracking }) {
  const reduced = useReducedMotion();

  const { points, nextPoint } = useMemo(() => {
    const route = buildRoute(tracking);
    const next = getNextStop(tracking);
    const plottedNext = next && hasCoordinates(next) ? next : null;

    // The next hop is only drawn if it isn't already the place we're standing in.
    const last = route[route.length - 1];
    const duplicate =
      plottedNext &&
      last &&
      last.latitude === plottedNext.latitude &&
      last.longitude === plottedNext.longitude;

    const projected = project(duplicate || !plottedNext ? route : [...route, plottedNext]);

    return {
      points: duplicate || !plottedNext ? projected : projected.slice(0, -1),
      nextPoint: duplicate || !plottedNext ? null : (projected[projected.length - 1] ?? null),
    };
  }, [tracking]);

  if (points.length === 0) return null;

  const current = points[points.length - 1];

  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
      className="card-surface mt-6 overflow-hidden rounded-[4px]"
    >
      <figcaption className="px-5 pt-5 text-[0.7rem] uppercase tracking-[0.18em] text-mist">
        The route so far
      </figcaption>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-hidden="true">
        <defs>
          <pattern id="map-dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill="#F5F5F5" fillOpacity="0.07" />
          </pattern>
          <linearGradient id="route" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B0A4DA" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#B0A4DA" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        <rect width={WIDTH} height={HEIGHT} fill="url(#map-dots)" />

        {points.slice(0, -1).map((point, index) => {
          const path = arc(point, points[index + 1]);
          if (!path) return null;
          return (
            <motion.path
              key={`segment-${index}`}
              d={path}
              fill="none"
              stroke="url(#route)"
              strokeWidth="1.3"
              strokeLinecap="round"
              initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: reduced ? 0 : 1.1, delay: 0.3 + index * 0.35, ease: EASE }}
            />
          );
        })}

        {nextPoint && (
          <motion.path
            d={arc(current, nextPoint)}
            fill="none"
            stroke="#B0A4DA"
            strokeOpacity="0.32"
            strokeWidth="1.1"
            strokeDasharray="3 5"
            strokeLinecap="round"
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduced ? 0 : 1, delay: 0.3 + points.length * 0.35, ease: EASE }}
          />
        )}

        {points.map((point, index) => {
          const isCurrent = index === points.length - 1;
          const label = shorten(point.place.name);
          const above = index % 2 === 0;
          const labelX = Math.min(Math.max(point.x, 46), WIDTH - 46);

          return (
            <g key={`point-${index}-${point.place.name ?? ''}`}>
              {isCurrent && !reduced && (
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill="none"
                  stroke="#B0A4DA"
                  strokeOpacity="0.6"
                  animate={{ r: [5, 15], opacity: [0.65, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <circle
                cx={point.x}
                cy={point.y}
                r={isCurrent ? 4.2 : 2.8}
                fill={isCurrent ? '#B0A4DA' : '#0D0F14'}
                stroke="#B0A4DA"
                strokeOpacity={isCurrent ? 1 : 0.55}
                strokeWidth="1"
              />
              {label && (
                <text
                  x={labelX}
                  y={point.y + (above ? -12 : 19)}
                  textAnchor="middle"
                  fontSize="8"
                  letterSpacing="0.4"
                  fill={isCurrent ? '#F5F5F5' : '#A5A7AE'}
                  fillOpacity={isCurrent ? 0.95 : 0.65}
                >
                  {label}
                </text>
              )}
            </g>
          );
        })}

        {nextPoint && (
          <g>
            <circle
              cx={nextPoint.x}
              cy={nextPoint.y}
              r="4"
              fill="#0D0F14"
              stroke="#B0A4DA"
              strokeOpacity="0.45"
              strokeDasharray="2 2"
            />
            <text
              x={Math.min(Math.max(nextPoint.x, 46), WIDTH - 46)}
              y={nextPoint.y + 19}
              textAnchor="middle"
              fontSize="8"
              fill="#A5A7AE"
              fillOpacity="0.6"
            >
              {shorten(nextPoint.place.name) || 'Next stop'}
            </text>
          </g>
        )}
      </svg>

      {/* Same information, for screen readers. */}
      <ol className="sr-only">
        {points.map((point, index) => (
          <li key={`sr-${index}`}>{point.place.name ?? 'Unnamed location'}</li>
        ))}
        {nextPoint && <li>Next: {nextPoint.place.name ?? 'Unnamed location'}</li>}
      </ol>
    </motion.figure>
  );
}
