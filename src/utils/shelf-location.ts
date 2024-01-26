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
	} = corridor?.shelves[location.shelf]?.route_projection ?? { point: {} };

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

export function isShelfLocationImplemented(location: ShelfLocation): boolean {
	return Boolean(positionsJson[fullCorridorName(location)]);
}

export function shelfLocationString(location: ShelfLocation) {
	let res = location.section + location.corridor + "-" + location.shelf;
	if (location.subshelf) {
		res += "-" + location.subshelf;
	}
	return res;
}
