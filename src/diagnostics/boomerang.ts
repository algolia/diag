import { humanize, prettysize } from '../lib/format';
import type { Cell, Dataset, Diagnostic } from '../types';

const title = 'Network measurements using lognormal/boomerang';

function run(): Promise<Dataset> {
  return new Promise((resolve) => {
    const dataset: Dataset = {
      title,
      header: [
        'page load time (ms)',
        'ttfb (ms)',
        'bandwidth',
        'latency (ms)',
        'ipv6 google.com/images/logo.png time (ms)',
      ],
      data: [[]],
    };

    BOOMR.init({
      BW: {
        base_url: `//${location.host}${location.pathname}/boomerang/images/`,
        block_beacon: true,
        test_https: true,
        cookie_exp: 1, // we want always fresh results for the bandwidth test
      },
      IPv6: {
        // google.com ipv6
        // from http://173.194.40.147/images/logo.png
        ipv6_url: 'https://[2a00:1450:400c:c09::67]/images/logo.png',
      },
    });

    BOOMR.subscribe('before_beacon', (results) => {
      // boomerang has a try/catch block on the fire event; get out of it
      // otherwise errors are swallowed
      setTimeout(() => {
        const row = dataset.data[0] as Cell[];
        row.push(
          results.t_page ? humanize(results.t_page) : 'n/a',
          results.t_resp ? humanize(results.t_resp) : 'n/a',
          results.bw ? `${prettysize(results.bw)}/s` : 'n/a',
          results.lat ? humanize(results.lat) : 'n/a',
          results.ipv6_latency ? humanize(results.ipv6_latency) : 'n/a',
        );

        if (results['cpu.cnc']) {
          dataset.header.push('number of cpus');
          row.push(String(results['cpu.cnc']));
        }

        if (results['scr.xy']) {
          dataset.header.push('screen');
          row.push(
            `resolution: ${results['scr.xy']}, dpi: ${results['scr.dpx']}, ` +
              `bpp: ${results['scr.bpp']}, orientation: ${results['scr.orn']}`,
          );
        }

        if (results['mob.type']) {
          dataset.header.push('mobile connection');
          row.push(
            `connection type: ${results['mob.type']}, ` +
              `connection bandwidth: ${results['mob.bw']} (MB/s)`,
          );
        }

        resolve(dataset);
      }, 0);
    });
  });
}

export const boomerang: Diagnostic = { title, run };
