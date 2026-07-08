// boomerang (lognormal/boomerang) is loaded as a classic vendor script from the
// public directory and exposes a `BOOMR` global. It has no types of its own.
interface BoomrResults {
  t_page?: number;
  t_resp?: number;
  bw?: number;
  lat?: number;
  ipv6_latency?: number;
  [key: string]: number | string | undefined;
}

interface Boomr {
  init(config: Record<string, unknown>): void;
  subscribe(event: string, handler: (results: BoomrResults) => void): void;
}

declare const BOOMR: Boomr;
