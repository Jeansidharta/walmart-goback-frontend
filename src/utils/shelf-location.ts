import { ShelfLocation } from "../models";
import positionJson from "../assets/positions.json";

function fullCorridorName(location: ShelfLocation) {
	return (location.section +
		location.corridor.toString()) as unknown as keyof typeof positionJson;
}

export function shelfLocationToPosition(
	location: ShelfLocation,
): { x: number; y: number } | null {
	const [x, y] =
		positionJson[fullCorridorName(location)]?.average_position ?? [];

	if (typeof x !== "number" || typeof y !== "number") return null;
	return { x, y };
}

export function isShelfLocationImplemented(location: ShelfLocation): boolean {
	return Boolean(positionJson[fullCorridorName(location)]);
}

export function shelfLocationString(location: ShelfLocation) {
	let res = location.section + location.corridor + "-" + location.shelf;
	if (location.subshelf) {
		res += "-" + location.subshelf;
	}
	return res;
}
