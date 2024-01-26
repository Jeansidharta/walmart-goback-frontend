import { FC, useEffect, useMemo, useState } from "react";
import {
	Text,
	Group,
	Paper,
	Stack,
	Title,
	Button,
	Image,
	Space,
	ActionIcon,
	Divider,
} from "@mantine/core";
import {
	IconEdit,
	IconCheck,
	IconArrowBackUp,
	IconRefresh,
} from "@tabler/icons-react";
import { Item } from "../../models";
import { shelfLocationString } from "../../utils/shelf-location";
import { Solution } from "./page";

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

	const [visited, notVisited, alsoInThisIsle] = useMemo(() => {
		const visitedItems: [Item, number][] = [];
		const notVisitedItems: [Item, number][] = [];
		solution.forEach(([item], index) => {
			if (visitedDict[index]) {
				visitedItems.push([item, index] as const);
			} else {
				notVisitedItems.push([item, index] as const);
			}
		});

		const alsoInThisIsle: [Item, number][] = [];
		for (let i = 0; i < notVisitedItems.length; i++) {
			const [item, index] = notVisitedItems[i];
			if (i === 0) continue;
			if (
				item.shelfLocation.section ===
				notVisitedItems[0][0].shelfLocation.section &&
				item.shelfLocation.corridor ===
				notVisitedItems[0][0].shelfLocation.corridor
			) {
				alsoInThisIsle.push([item, index]);
			}
		}

		return [visitedItems, notVisitedItems, alsoInThisIsle] as const;
	}, [solution, visitedDict]);

	const [nextItem, nextItemIndex] =
		notVisited.length > 0 ? notVisited[0] : [null, null];

	return (
		<Stack>
			<Group justify="center" align="start">
				<Stack>
					<Paper withBorder p="md">
						{nextItem ? (
							<Stack>
								<Title order={2}>Next Item</Title>
								<Text>
									Location:{" "}
									<strong>{shelfLocationString(nextItem.shelfLocation)}</strong>
								</Text>

								<Group
									align="center"
									justify="center"
									style={{ width: 200, height: 200 }}
								>
									<Image fit="contain" src={nextItem.photo} h={200} w={200} />
								</Group>
								<Button onClick={() => visit(nextItemIndex)}>
									Delivered <Space w="sm" /> <IconCheck />
								</Button>
								{alsoInThisIsle.length > 0 && (
									<>
										<Divider />
										<Title order={3}>Also in this isle...</Title>
										{alsoInThisIsle.map(([item]) => (
											<>
												<Text>
													Location:{" "}
													<strong>
														{shelfLocationString(nextItem.shelfLocation)}
													</strong>
												</Text>
												<Image fit="contain" src={item.photo} h={200} w={200} />
											</>
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
						<>
							<Title order={2}>Not delivered</Title>
							{notVisited.map(([{ shelfLocation: position }, itemIndex]) => (
								<Paper
									style={{ width: "100%" }}
									p="sm"
									withBorder
									key={itemIndex}
								>
									<Group justify="space-between">
										{shelfLocationString(position)}
										<ActionIcon
											color="secondary"
											variant="outline"
											onClick={() => visit(itemIndex)}
										>
											<IconCheck />
										</ActionIcon>
									</Group>
								</Paper>
							))}
						</>
					)}
					{visited.length > 0 && (
						<>
							<Title order={2}>Delivered</Title>
							{visited.map(([{ shelfLocation: position }, itemIndex]) => (
								<Paper
									style={{ width: "100%" }}
									p="sm"
									withBorder
									key={itemIndex}
								>
									<Group justify="space-between">
										<Group>
											<IconCheck />
											{shelfLocationString(position)}
										</Group>
										<ActionIcon color="blue" onClick={() => unvisit(itemIndex)}>
											<IconArrowBackUp />
										</ActionIcon>
									</Group>
								</Paper>
							))}
						</>
					)}
				</Stack>
			</Group>
		</Stack>
	);
};
