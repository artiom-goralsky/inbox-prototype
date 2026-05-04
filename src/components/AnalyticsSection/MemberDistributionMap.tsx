import React, { memo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Typography } from '@circleco/compass/components/Typography';

/* ── Types ─────────────────────────────────────────────────────────────── */
export interface CountryData {
  /** ISO 3166-1 alpha-3 country code */
  id: string;
  value: number;
}

export interface MemberDistributionMapProps {
  title?: string;
  period?: string;
  data?: CountryData[];
}

/* ── Choropleth color scale ─────────────────────────────────────────────── */
// Matches Figma legend: 0-1k, 1-2k, 2-3k, 4-5k
const BUCKETS: Array<{ min: number; max: number; color: string; label: string }> = [
  { min: 0,    max: 1000, color: '#dbeafe', label: '0-1k' }, // blue/100
  { min: 1000, max: 2000, color: '#93c5fd', label: '1-2k' }, // blue/300
  { min: 2000, max: 3000, color: '#3b82f6', label: '2-3k' }, // blue/500
  { min: 3000, max: 9999, color: '#1d4ed8', label: '4-5k' }, // blue/700
];

const EMPTY_COLOR = '#e4e7eb'; // gray for no-data countries

function getColor(value: number | undefined): string {
  if (value === undefined || value === 0) return EMPTY_COLOR;
  const bucket = BUCKETS.find(b => value >= b.min && value < b.max);
  return bucket ? bucket.color : BUCKETS[BUCKETS.length - 1].color;
}

/* ── Default mock data — matched to Figma screenshot ───────────────────── */
const DEFAULT_DATA: CountryData[] = [
  // 4-5k (darkest navy) — USA, Brazil, Australia
  { id: 'USA', value: 4800 },
  { id: 'BRA', value: 4200 },
  { id: 'AUS', value: 4500 },

  // 2-3k (medium blue) — Canada, UK
  { id: 'CAN', value: 2600 },
  { id: 'GBR', value: 2200 },

  // 1-2k (light-medium blue) — Kazakhstan, Philippines, Ukraine, Turkey, Israel, Nigeria
  { id: 'KAZ', value: 1600 },
  { id: 'PHL', value: 1400 },
  { id: 'UKR', value: 1200 },
  { id: 'TUR', value: 1300 },
  { id: 'ISR', value: 1500 },
  { id: 'NGA', value: 1100 },

  // 0-1k (very light blue) — scattered: DE, FR, NL, SE, PL, ZA, EGY, IND, SGP, MEX, ARG, NZL
  { id: 'DEU', value: 800 },
  { id: 'FRA', value: 700 },
  { id: 'NLD', value: 600 },
  { id: 'SWE', value: 500 },
  { id: 'POL', value: 450 },
  { id: 'ZAF', value: 550 },
  { id: 'EGY', value: 400 },
  { id: 'IND', value: 750 },
  { id: 'SGP', value: 900 },
  { id: 'MEX', value: 650 },
  { id: 'ARG', value: 500 },
];

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

/**
 * world-atlas TopoJSON uses numeric ISO 3166-1 codes as geo.id.
 * Map alpha-3 → numeric so our data keys match.
 */
const ALPHA3_TO_NUMERIC: Record<string, string> = {
  USA: '840', BRA: '76',  AUS: '36',  CAN: '124', GBR: '826',
  KAZ: '398', PHL: '608', UKR: '804', TUR: '792', ISR: '376',
  NGA: '566', DEU: '276', FRA: '250', NLD: '528', SWE: '752',
  POL: '616', ZAF: '710', EGY: '818', IND: '356', SGP: '702',
  MEX: '484', ARG: '32',  NZL: '554', RUS: '643', JPN: '392',
  KOR: '410', CHN: '156', IDN: '360', SAU: '682', ITA: '380',
  ESP: '724', NOR: '578', DNK: '208', FIN: '246', CHE: '756',
  AUT: '40',  BEL: '56',  PRT: '620', KEN: '404', IRN: '364',
};

/* ── Legend dot ─────────────────────────────────────────────────────────── */
const LegendItem = memo(({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2 shrink-0">
    <div
      className="w-2.5 h-2.5 rounded-full shrink-0" 
      style={{ background: color }}
    />
    <span className="text-caption text-secondary">{label}</span>
  </div>
));

/* ── Component ─────────────────────────────────────────────────────────── */
const MemberDistributionMap: React.FC<MemberDistributionMapProps> = ({
  title = 'Member distribution by country',
  period = '30d',
  data = DEFAULT_DATA,
}) => {
  // Build lookup keyed by numeric ISO code (what world-atlas uses as geo.id)
  const dataMap = React.useMemo(
    () => new Map(
      data.map(d => [ALPHA3_TO_NUMERIC[d.id] ?? d.id, d.value]),
    ),
    [data],
  );

  return (
    <div className="bg-primary border border-primary rounded-xl p-6 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center gap-2 shrink-0">
        <Typography variant="label-md" color="primary">
          {title}
        </Typography>
        <span className="text-caption text-secondary pt-0.5">{period}</span>
      </div>

      {/* Map */}
      <div className="w-full flex-1">
        <ComposableMap
          projectionConfig={{ scale: 140, center: [10, 10] }}
          style={{ width: '100%', height: 'auto' }}
          height={280}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const value = dataMap.get(geo.id as string);
                const fill = getColor(value);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#ffffff"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover:   { outline: 'none', fill: fill === EMPTY_COLOR ? '#d1d5db' : fill, opacity: 0.85 },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap shrink-0">
        <LegendItem color={EMPTY_COLOR} label="No data" />
        {BUCKETS.map(b => (
          <LegendItem key={b.label} color={b.color} label={b.label} />
        ))}
      </div>

    </div>
  );
};

export default MemberDistributionMap;
