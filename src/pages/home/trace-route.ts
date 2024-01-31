import {
	Connection,
	Vec2,
	solve as tspSolve,
} from "../../../tsp-pkg/travelling_salesman";

import { Item, ShelfLocation } from "../../models";
import { Solution } from "./page";

import route from "../../assets/route.json";
import { shelfLocationToProjection } from "../../utils/shelf-location";

function hashConnection({ i1, i2 }: { i1: number; i2: number }): string {
	if (i1 < i2) {
		return `${i1}-${i2}`;
	} else {
		return `${i2}-${i1}`;
	}
}

export function traceRoute(
	items: Item[],
	startLocation: ShelfLocation | null,
): Solution {
	let startIndex = route.start;
	const target_points: number[] = [];

	const route_points = [...route.points];
	const route_connections = [...route.connections];

	const new_points_dict: Record<
		string,
		{
			x: number;
			y: number;
			connection: { i1: number; i2: number };
			t: number;
			item: Item | null;
		}[]
	> = {};

	items.forEach((item) => {
		const { x, y, connection, t } = shelfLocationToProjection(
			item.shelfLocation,
		)!;
		const key = hashConnection(connection);
		if (new_points_dict[key]) {
			new_points_dict[key].push({ x, y, connection, t, item });
		} else {
			new_points_dict[key] = [{ x, y, connection, t, item }];
		}
	});
	if (startLocation) {
		const { x, y, connection, t } = shelfLocationToProjection(startLocation)!;
		startIndex = route_points.length - 1;

		const key = hashConnection(connection);
		if (new_points_dict[key]) {
			new_points_dict[key].push({ x, y, connection, t, item: null });
		} else {
			new_points_dict[key] = [{ x, y, connection, t, item: null }];
		}
	}
	const itemMap: Record<number, Item> = {};
	Object.values(new_points_dict).forEach((aisleItems) => {
		aisleItems
			.sort((i1, i2) => i1.t - i2.t)
			.forEach(({ x, y, connection: { i1, i2 }, item }, index) => {
				route_points.push({ x, y });
				target_points.push(route_points.length - 1);
				if (item) {
					itemMap[route_points.length - 1] = item;
				} else {
					startIndex = route_points.length - 1;
				}
				if (index === 0) {
					route_connections.push({ i1, i2: route_points.length - 1 });
				} else {
					route_connections.push({
						i1: route_points.length - 2,
						i2: route_points.length - 1,
					});
				}
				if (index === aisleItems.length - 1) {
					route_connections.push({ i1: route_points.length - 1, i2 });
				}
			});
	});

	const solution_raw = tspSolve(
		route_points.map(({ x, y }) => Vec2.new(x, y)),
		route_connections.map(({ i1, i2 }) => Connection.new(i1, i2)),
		startIndex,
		Uint32Array.from(target_points),
	);
	const solution: Solution = {
		initialPosition: startLocation
			? shelfLocationToProjection(startLocation)!
			: route.points[route.start],
		route: [],
	};
	solution_raw.forEach(([num, path_indexes]) => {
		const path = (path_indexes as number[]).map((i) => route_points[i]);
		const item = itemMap[num];
		if (!item) return;
		solution.route.push({ item, path });
	});

	return solution;
}
