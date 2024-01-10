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
import { RouteSolution } from "./route-rolution";
import { useLocalStorage } from "../../utils/use-local-storage";
import { ShareButton } from "./share-button";
import { Item } from "../../models";
import {
	shelfLocationString,
	shelfLocationToPosition,
} from "../../utils/shelf-location";
import { CartsModal } from "./carts-modal";

export const HomePage: FC = () => {
	const [solution, setSolution] = useState<Item[] | null>(null);
	const [items, setItems] = useLocalStorage<Item[]>("scanned-items", []);

	function removeItem(index: number) {
		const newItems = items.filter((_, i) => i != index);
		setItems(newItems);
	}

	function traceRoute() {
		const solution_raw = tspSolve(
			items.map((item) => {
				const { x, y } = shelfLocationToPosition(item.shelfLocation)!;
				return Position.new(x, y);
			}),
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
							{items.length > 0 && (
								<Button onClick={traceRoute}>
									Trace Route <Space w="sm" /> <IconMap />
								</Button>
							)}
							{items.length == 0 ? (
								<>
									<Text>No items yet</Text>
									<CartsModal onScan={(newItems) => setItems(newItems)} />
								</>
							) : (
								<>
									{items.map((item, index) => (
										<Paper
											style={{ width: "100%" }}
											p="sm"
											withBorder
											key={
												item.shelfLocation.corridor +
												"-" +
												item.shelfLocation.shelf
											}
										>
											<Group justify="space-between">
												{shelfLocationString(item.shelfLocation)}
												<ActionIcon onClick={() => removeItem(index)}>
													<IconTrash style={{ width: "70%", height: "70%" }} />
												</ActionIcon>
											</Group>
										</Paper>
									))}

									<ShareButton items={items} />
								</>
							)}
						</Stack>
					</Container>
				</Group>
			)}
		</Stack>
	);
};
