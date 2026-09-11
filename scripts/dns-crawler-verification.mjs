import { lookup, reverse } from 'node:dns/promises';
import { isInIpPrefix } from './ip-prefix.mjs';

const normalizeIp = (ip) => ip.toLowerCase().replace(/^::ffff:/, '');

export async function verifyDnsIp(ip, allowedSuffixes, dns = { reverse, lookup }) {
  try {
    const hostnames = await dns.reverse(ip);
    const providerHostnames = hostnames
      .map((hostname) => hostname.toLowerCase().replace(/\.$/, ''))
      .filter((hostname) => allowedSuffixes.some((suffix) => hostname.endsWith(suffix)));
    if (!providerHostnames.length) {
      return { verified: false, hostnames, reason: 'reverse-dns-provider-domain-mismatch' };
    }

    const forwardResults = await Promise.all(
      providerHostnames.map(async (hostname) => ({
        hostname,
        addresses: (await dns.lookup(hostname, { all: true, verbatim: true })).map((result) => result.address),
      })),
    );
    const normalizedIp = normalizeIp(ip);
    const forwardAddresses = [...new Set(forwardResults.flatMap((result) => result.addresses))];
    const benchmarkAddresses = forwardAddresses.filter((address) => isInIpPrefix(normalizeIp(address), '198.18.0.0/15'));
    if (forwardAddresses.length && benchmarkAddresses.length === forwardAddresses.length) {
      return {
        verified: null,
        verificationUnavailable: true,
        hostnames: providerHostnames,
        forwardAddresses,
        reason: 'forward-dns-returned-rfc2544-benchmark-address',
      };
    }
    const verified = forwardResults.some((result) =>
      result.addresses.some((address) => normalizeIp(address) === normalizedIp),
    );
    return {
      verified,
      hostnames: providerHostnames,
      forwardAddresses,
      reason: verified ? 'forward-confirmed-original-ip' : 'forward-dns-did-not-return-original-ip',
    };
  } catch (error) {
    const definitiveNoRecord = ['ENOTFOUND', 'ENODATA', 'ENONAME'].includes(error.code);
    return {
      verified: definitiveNoRecord ? false : null,
      ...(definitiveNoRecord ? {} : { verificationUnavailable: true }),
      reason: definitiveNoRecord ? 'dns-record-not-found' : 'dns-verification-unavailable',
      error: error.message,
    };
  }
}
