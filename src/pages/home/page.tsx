import { FC, useState } from "react";
import {
	Connection,
	Vec2,
	solve as tspSolve,
} from "../../../tsp-pkg/travelling_salesman";
import { Group, Text, Stack, Container } from "@mantine/core";
import { ItemForm } from "./item-form";
import { RouteSolution } from "./route-solution";
import { useLocalStorage } from "../../utils/use-local-storage";
import { ShareButton } from "./share-button";
import { Item, ShelfLocation } from "../../models";
import {
	shelfLocationToPosition,
	shelfLocationToProjection,
} from "../../utils/shelf-location";
import { CartsModal } from "./carts-modal";
import route from "../../assets/route.json";
import { Point } from "../../components/map";
import { TraceRouteButton } from "./trace-route-button";
import { PreviewMap } from "./preview-map";
import { ItemSmall } from "../../components/item-small";
import { IconTrash } from "@tabler/icons-react";

export type Solution = {
	route: { item: Item; path: Point[] }[];
	initialPosition: Point;
};

function hashConnection({ i1, i2 }: { i1: number; i2: number }): string {
	if (i1 < i2) {
		return `${i1}-${i2}`;
	} else {
		return `${i2}-${i1}`;
	}
}

function traceRoute(
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

export const HomePage: FC = () => {
	const [solution, setSolution] = useState<Solution | null>(null);
	const [items, setItems] = useLocalStorage<Item[]>("scanned-items", []);

	function removeItem(index: number) {
		setItems((items) => items.filter((_, i) => i !== index));
	}

	function handleTraceRoute(startLocation: ShelfLocation | null) {
		setSolution(traceRoute(items, startLocation));
	}

	return (
		<Stack>
			{solution ? (
				<RouteSolution
					solution={solution}
					onEditItems={() => setSolution(null)}
					onRestart={() => {
						setSolution(null);
						setItems([]);
					}}
				/>
			) : (
				<>
					<PreviewMap />
					<Group align="start" justify="center" style={{ rowGap: 32 }}>
						<ItemForm
							onSubmit={(newItem) =>
								setItems([
									{
										...newItem,
										...shelfLocationToPosition(newItem.shelfLocation)!,
									},
									...items,
								])
							}
						/>
						<Container size={350} style={{ width: "100%" }}>
							<Stack style={{ width: "100%" }}>
								{items.length === 0 ? (
									<>
										<Text>No items yet</Text>
										<CartsModal onScan={(newItems) => setItems(newItems)} />
									</>
								) : (
									<>
										<Group justify="center">
											<Text style={{ textAlign: "center" }}>
												You have {items.length} Items
											</Text>
											<ShareButton items={items} />
										</Group>
										<TraceRouteButton onSubmit={handleTraceRoute} />
										{items.map((item, index) => (
											<ItemSmall
												key={index}
												item={item}
												onAction={() => removeItem(index)}
												icon={
													<IconTrash style={{ height: "70%", width: "70%" }} />
												}
											/>
										))}
									</>
								)}
							</Stack>
						</Container>
					</Group>
				</>
			)}
		</Stack>
	);
};
