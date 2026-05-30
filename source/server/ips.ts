import * as libnet from "net";

export function normalizeIPv6(ip: string): string {
	if (!libnet.isIPv6(ip)) {
		throw new Error(`Expected "${ip}" to be a valid IPv6 address!`);
	}
	if (ip.startsWith("[") && ip.endsWith("]")) {
		ip = ip.slice(1, -1);
	}
	let groups = new Array<string>();
	let position = ip.indexOf("::");
	if (position >= 0) {
		let prefixGroups = ip.slice(0, position).split(":");
		let suffixGroups = ip.slice(position + 2).split(":");
		let zeroedGroups = new Array(8 - (prefixGroups.length + suffixGroups.length)).fill("0000");
		groups.push(...prefixGroups);
		groups.push(...zeroedGroups);
		groups.push(...suffixGroups);
	} else {
		groups.push(...ip.split(":"));
	}
	let normalizedIp = `[${groups.map((group) => group.padStart(4, "0")).join(":").toLowerCase()}]`;
	return normalizedIp;
};

export function normalizeToIPv6(address: string): string {
	let ip = address === "localhost" ? "::1" : address;
	if (libnet.isIPv6(ip)) {
		return normalizeIPv6(ip);
	}
	if (libnet.isIPv4(ip)) {
		return normalizeIPv6(ip === "127.0.0.1" ? "::1" : `::ffff:${address}`);
	}
	throw new Error(`Expected "${address}" to be a valid IPv4 or IPv6 address!`);
};
