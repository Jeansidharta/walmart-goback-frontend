import { ShelfLocation } from "../models";
import { positionsJson } from "./typed-positions";

function fullCorridorName(location: ShelfLocation) {
	return location.section + location.corridor.toString();
}

export function shelfLocationToProjection(location: ShelfLocation) {
	const corridor = positionsJson[fullCorridorName(location)];
	const {
		point: { x, y },
		t,
		connection,
	} = corridor?.shelves[location.shelf]?.route_projection ??
	corridor.route_projection ?? { point: {} };

	if (typeof x !== "number" || typeof y !== "number") return null;
	return { x, y, connection, t };
}

export function shelfLocationToPosition(
	location: ShelfLocation,
): { x: number; y: number } | null {
	const corridor = positionsJson[fullCorridorName(location)];
	const { x, y } =
		corridor?.shelves[location.shelf] ?? corridor?.average_position ?? {};

	if (typeof x !== "number" || typeof y !== "number") return null;
	return { x, y };
}

export function isCorridorImplemented(location: ShelfLocation): boolean {
	return Boolean(positionsJson[fullCorridorName(location)]);
}

export function isShelfLocationImplemented(location: ShelfLocation): boolean {
	return Boolean(
		positionsJson[fullCorridorName(location)]?.shelves[location.shelf],
	);
}

export function shelfLocationString(location: ShelfLocation) {
	let res = location.section + location.corridor + "-" + location.shelf;
	if (location.subshelf) {
		res += "-" + location.subshelf;
	}
	return res;
}

const positionRegex = /^(\w)(\d{1,2})\D+(\d{1,3})\D?(\d*)$/;

export function stringToLocation(str: string): null | ShelfLocation {
	const position = str.trim();
	const result = positionRegex.exec(position);
	if (!result) return null;
	const [, section_raw, corridor_raw, shelf_raw, subshelf_raw] = result;
	const section = section_raw.toUpperCase();
	const corridor = Number(corridor_raw);
	const shelf = Number(shelf_raw);
	const subshelf = subshelf_raw ? Number(subshelf_raw) : undefined;
	return {
		section,
		corridor,
		shelf,
		subshelf,
	};
}
