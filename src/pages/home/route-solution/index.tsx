import { FC, useEffect, useMemo, useState } from "react";
import {
	Group,
	Paper,
	Stack,
	Title,
	Button,
	Space,
	Divider,
	Accordion,
} from "@mantine/core";
import { IconEdit, IconCheck, IconRefresh } from "@tabler/icons-react";
import { Item } from "../../../models";
import { Solution } from "../page";
import { SolutionMap } from "./solution-map";
import { NextItemCard } from "./next-item-card";
import { ItemSmall } from "../../../components/item-small";

export const RouteSolution: FC<{
	solution: Solution;
	onRestart: () => void;
	onEditItems: () => void;
}> = ({ solution, onRestart, onEditItems }) => {
	const [visitedDict, setVisitedDict] = useState<Record<number, true>>({});

	function unvisit(itemIndex: number) {
		const newVisitDict = { ...visitedDict };
		delete newVisitDict[itemIndex];
		setVisitedDict(newVisitDict);
	}
	function visit(itemIndex: number) {
		setVisitedDict({ ...visitedDict, [itemIndex]: true });
	}

	useEffect(() => {
		setVisitedDict({});
	}, [solution, setVisitedDict]);

	const [visited, notVisited, alsoInThisAisle] = useMemo(() => {
		const visitedItems: [Item, number][] = [];
		const notVisitedItems: [Item, number][] = [];
		solution.route.forEach(({ item }, index) => {
			if (visitedDict[index]) {
				visitedItems.push([item, index] as const);
			} else {
				notVisitedItems.push([item, index] as const);
			}
		});

		const alsoInThisAisle: [Item, number][] = [];
		for (let i = 0; i < notVisitedItems.length; i++) {
			const [item, index] = notVisitedItems[i];
			if (i === 0) continue;
			if (
				item.shelfLocation.section ===
				notVisitedItems[0][0].shelfLocation.section &&
				item.shelfLocation.corridor ===
				notVisitedItems[0][0].shelfLocation.corridor
			) {
				alsoInThisAisle.push([item, index]);
			}
		}

		return [visitedItems, notVisitedItems, alsoInThisAisle] as const;
	}, [solution, visitedDict]);

	const [nextItem, nextItemIndex] =
		notVisited.length > 0 ? notVisited[0] : [null, null];

	return (
		<Stack>
			<SolutionMap solution={solution} currentIndex={nextItemIndex} />
			<Group justify="center" align="start">
				<Stack>
					<Paper withBorder p="md">
						{nextItem ? (
							<Stack>
								<Title order={2}>Next Item</Title>
								<NextItemCard item={nextItem} />
								<Button onClick={() => visit(nextItemIndex)}>
									Delivered <Space w="sm" /> <IconCheck />
								</Button>
								{alsoInThisAisle.length > 0 && (
									<>
										<Divider />
										<Title order={3}>Also in this aisle...</Title>
										{alsoInThisAisle.map(([item]) => (
											<NextItemCard item={item} />
										))}
									</>
								)}
							</Stack>
						) : (
							<>
								<Title>All done!</Title>
								<div style={{ width: 200, height: 1 }} />
								<Button fullWidth mt="md" onClick={onRestart}>
									Restart
									<Space w="sm" />
									<IconRefresh />
								</Button>
							</>
						)}
					</Paper>
					<Button color="secondary" variant="outline" onClick={onEditItems}>
						Change Items <Space w="sm" /> <IconEdit />
					</Button>
				</Stack>
				<Stack style={{ maxWidth: 250, width: "100%" }}>
					{notVisited.length > 0 && (
						<Accordion>
							<Accordion.Item value="0">
								<Accordion.Control>
									<Title order={2}>Not delivered</Title>
								</Accordion.Control>
								<Accordion.Panel>
									{notVisited.map(([item, itemIndex]) => (
										<ItemSmall
											key={itemIndex}
											item={item}
											onAction={() => visit(itemIndex)}
											icon={
												<IconCheck style={{ height: "70%", width: "70%" }} />
											}
										/>
									))}
								</Accordion.Panel>
							</Accordion.Item>
						</Accordion>
					)}
					{visited.length > 0 && (
						<Accordion>
							<Accordion.Item value="0">
								<Accordion.Control>
									<Title order={2}>Delivered</Title>
								</Accordion.Control>
								<Accordion.Panel>
									{visited.map(([item, itemIndex]) => (
										<ItemSmall
											key={itemIndex}
											item={item}
											onAction={() => unvisit(itemIndex)}
											icon={
												<IconCheck style={{ height: "70%", width: "70%" }} />
											}
										/>
									))}
								</Accordion.Panel>
							</Accordion.Item>
						</Accordion>
					)}
				</Stack>
			</Group>
		</Stack>
	);
};
