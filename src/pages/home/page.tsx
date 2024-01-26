import { FC, useState } from "react";
import { SolutionMap } from "./solution-map";
import {
	Connection,
	Vec2,
	solve as tspSolve,
} from "../../../tsp-pkg/travelling_salesman";
import {
	ActionIcon,
	Button,
	Group,
	Text,
	Paper,
	Space,
	Stack,
	Container,
} from "@mantine/core";
import { IconTrash, IconMap } from "@tabler/icons-react";
import { ItemForm } from "./item-form";
import { RouteSolution } from "./route-rolution";
import { useLocalStorage } from "../../utils/use-local-storage";
import { ShareButton } from "./share-button";
import { Item } from "../../models";
import {
	shelfLocationString,
	shelfLocationToPosition,
	shelfLocationToProjection,
} from "../../utils/shelf-location";
import { CartsModal } from "./carts-modal";
import route from "../../assets/route.json";
import { Point } from "../../components/map";

export type Solution = [Item, Point, Point[]][];

export const HomePage: FC = () => {
	const [solution, setSolution] = useState<Solution | null>(null);
	const [items, setItems] = useLocalStorage<Item[]>("scanned-items", []);

	function removeItem(index: number) {
		setItems((items) => items.filter((_, i) => i !== index));
	}

	function traceRoute() {
		const target_points: number[] = [];

		const route_points = [...route.points];
		const route_connections = [...route.connections];

		const new_points_dict: Record<
			string,
			{ x: number; y: number; c1: number; c2: number; t: number }[]
		> = {};

		items.forEach((item) => {
			const { x, y, connection, t } = shelfLocationToProjection(
				item.shelfLocation,
			)!;
			let c1 = connection.i1;
			let c2 = connection.i2;
			if (c2 < c1) {
				c1 = connection.i2;
				c2 = connection.i1;
			}
			const key = `${c1}-${c2}`;
			if (new_points_dict[key]) {
				new_points_dict[key].push({ x, y, c1, c2, t });
			} else {
				new_points_dict[key] = [{ x, y, c1, c2, t }];
			}
		});
		Object.values(new_points_dict).forEach((isleItems) => {
			isleItems
				.sort((i1, i2) => i1.t - i2.t)
				.forEach(({ x, y, c1, c2 }, index) => {
					route_points.push(Vec2.new(x, y));
					target_points.push(route_points.length - 1);
					if (index === 0) {
						route_connections.push({ i1: c1, i2: route_points.length - 1 });
					} else {
						route_connections.push({
							i1: route_points.length - 2,
							i2: route_points.length - 1,
						});
					}
					if (index === isleItems.length - 1) {
						route_connections.push({ i1: route_points.length - 1, i2: c2 });
					}
				});
		});

		const solution_raw = tspSolve(
			route_points.map(({ x, y }) => Vec2.new(x, y)),
			route_connections.map(({ i1, i2 }) => Connection.new(i1, i2)),
			route.start,
			Uint32Array.from(target_points),
		);
		const solution: Solution = [];
		solution_raw.forEach(([num, path]) => {
			const path2 = (path as number[]).map((i) => route_points[i]);

			const item = items[num - route.points.length];
			solution.push([
				item,
				shelfLocationToPosition(item.shelfLocation)!,
				path2,
			]);
		});

		setSolution(solution);
	}

	return (
		<Stack>
			<SolutionMap solution={solution || []} />
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
									<Button onClick={traceRoute}>
										Trace Route <Space w="sm" /> <IconMap />
									</Button>
									{items.map((item, index) => (
										<Paper
											style={{ width: "100%" }}
											p="sm"
											withBorder
											key={index}
										>
											<Group justify="space-between">
												{shelfLocationString(item.shelfLocation)}
												<ActionIcon
													color="secondary"
													variant="outline"
													onClick={() => removeItem(index)}
												>
													<IconTrash style={{ width: "70%", height: "70%" }} />
												</ActionIcon>
											</Group>
										</Paper>
									))}
								</>
							)}
						</Stack>
					</Container>
				</Group>
			)}
		</Stack>
	);
};
