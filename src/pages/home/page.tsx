import { FC, useState } from "react";
import { SolutionMap } from "./solution-map";
import {
	solve as tspSolve,
	Position,
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
import positions from "../../assets/positions.json";
import { RouteSolution } from "./route-rolution";
import { shelfPositionString } from "../../utils";
import { useLocalStorage } from "../../utils/use-local-storage";

export type ShelfPosition = {
	corridor: keyof typeof positions;
	shelf: string;
	subshelf: string;
	x: number;
	y: number;
};

export type Item = {
	position: ShelfPosition;
	screenshot: string;
};

function shelfPositionToCoords(shelfPosition: ShelfPosition) {
	const corridor = positions[shelfPosition.corridor];
	const [x, y] = corridor.average_position;
	return Position.new(x, y);
}

export const HomePage: FC = () => {
	const [solution, setSolution] = useState<Item[] | null>(null);
	const [items, setItems] = useLocalStorage<Item[]>("scanned-items", []);

	function removeItem(index: number) {
		const newItems = items.filter((_, i) => i != index);
		setItems(newItems);
	}

	function traceRoute() {
		const solution_raw = tspSolve(
			items.map((item) => shelfPositionToCoords(item.position)),
		);
		const solution: Item[] = [];
		solution_raw.forEach((num) => solution.push(items[num]));

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
					<ItemForm onSubmit={(newItem) => setItems([newItem, ...items])} />
					<Container size={350} style={{ width: "100%" }}>
						<Stack style={{ width: "100%" }}>
							{items.length > 0 && (
								<Button onClick={traceRoute}>
									Trace Route <Space w="sm" /> <IconMap />
								</Button>
							)}
							{items.length == 0 && <Text>No items yet</Text>}
							{items.map((item, index) => (
								<Paper
									style={{ width: "100%" }}
									p="sm"
									withBorder
									key={item.position.corridor + "-" + item.position.shelf}
								>
									<Group justify="space-between">
										{shelfPositionString(item.position)}

										<ActionIcon onClick={() => removeItem(index)}>
											<IconTrash style={{ width: "70%", height: "70%" }} />
										</ActionIcon>
									</Group>
								</Paper>
							))}
						</Stack>
					</Container>
				</Group>
			)}
		</Stack>
	);
};
