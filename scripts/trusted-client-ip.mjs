import { readFile } from 'node:fs/promises';
import { isInIpPrefix } from './ip-prefix.mjs';

const realIpConfig = await readFile(new URL('../deploy/cloudflare-real-ip.conf', import.meta.url), 'utf8');
export const cloudflareProxyPrefixes = [...realIpConfig.matchAll(/^set_real_ip_from\s+([^;\s]+);$/gm)]
  .map((match) => match[1]);

if (!cloudflareProxyPrefixes.length) throw new Error('Cloudflare trusted proxy prefix list is empty');

export function selectTrustedClientIp(reportedClientIp, proxyIp) {
  const trustedProxy = Boolean(proxyIp) && cloudflareProxyPrefixes.some((prefix) => isInIpPrefix(proxyIp, prefix));
  return {
    ip: trustedProxy ? (reportedClientIp || proxyIp) : (proxyIp || reportedClientIp || ''),
    trustedProxy,
  };
}
