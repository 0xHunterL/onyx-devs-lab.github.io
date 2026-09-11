import { isIP } from 'node:net';

function ipv4ToBigInt(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4 || parts.some((part) => !/^\d+$/.test(part) || Number(part) > 255)) return null;
  return parts.reduce((value, part) => (value << 8n) + BigInt(part), 0n);
}

function ipv6ToBigInt(ip) {
  let value = ip.toLowerCase().split('%')[0];
  const ipv4Tail = value.match(/(?:^|:)(\d+\.\d+\.\d+\.\d+)$/)?.[1];
  if (ipv4Tail) {
    const ipv4 = ipv4ToBigInt(ipv4Tail);
    if (ipv4 === null) return null;
    value = `${value.slice(0, -ipv4Tail.length)}${(ipv4 >> 16n).toString(16)}:${(ipv4 & 0xffffn).toString(16)}`;
  }
  const halves = value.split('::');
  if (halves.length > 2) return null;
  const left = halves[0] ? halves[0].split(':') : [];
  const right = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  if ([...left, ...right].some((part) => !/^[0-9a-f]{1,4}$/.test(part))) return null;
  const missing = 8 - left.length - right.length;
  if ((halves.length === 1 && missing !== 0) || (halves.length === 2 && missing < 1)) return null;
  const parts = [...left, ...Array(missing).fill('0'), ...right];
  return parts.reduce((result, part) => (result << 16n) + BigInt(`0x${part}`), 0n);
}

function parseIp(ip) {
  const normalized = ip.toLowerCase().replace(/^::ffff:/, '');
  const version = isIP(normalized);
  if (version === 4) return { bits: 32, value: ipv4ToBigInt(normalized), version };
  if (version === 6) return { bits: 128, value: ipv6ToBigInt(normalized), version };
  return null;
}

export function isInIpPrefix(ip, prefix) {
  const separator = prefix.lastIndexOf('/');
  if (separator < 1) return false;
  const value = parseIp(ip);
  const network = parseIp(prefix.slice(0, separator));
  const prefixBits = Number(prefix.slice(separator + 1));
  if (!value || !network || value.version !== network.version || value.value === null || network.value === null) return false;
  if (!Number.isInteger(prefixBits) || prefixBits < 0 || prefixBits > value.bits) return false;
  const hostBits = BigInt(value.bits - prefixBits);
  const mask = prefixBits === 0 ? 0n : ((1n << BigInt(prefixBits)) - 1n) << hostBits;
  return (value.value & mask) === (network.value & mask);
}
