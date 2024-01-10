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
} from "@mantine/core";
import {
	IconEdit,
	IconCheck,
	IconArrowBackUp,
	IconRefresh,
} from "@tabler/icons-react";
import { Item } from "../../models";
import { shelfLocationString } from "../../utils/shelf-location";

export const RouteSolution: FC<{
	solution: Item[];
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

	const [visited, notVisited] = useMemo(() => {
		const visitedItems: [Item, number][] = [];
		const notVisitedItems: [Item, number][] = [];
		solution.forEach((item, index) => {
			if (visitedDict[index]) {
				visitedItems.push([item, index] as const);
			} else {
				notVisitedItems.push([item, index] as const);
			}
		});
		return [visitedItems, notVisitedItems] as const;
	}, [solution, visitedDict]);

	const [nextItem, nextItemIndex] =
		notVisited.length > 0 ? notVisited[0] : [null, null];

	return (
		<Stack>
			<Paper shadow="xl" withBorder p="md">
				<Group wrap="nowrap" align="start">
					<Stack style={{ width: "100%" }}>
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
											<ActionIcon color="blue" onClick={() => visit(itemIndex)}>
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
											<ActionIcon
												color="blue"
												onClick={() => unvisit(itemIndex)}
											>
												<IconArrowBackUp />
											</ActionIcon>
										</Group>
									</Paper>
								))}
							</>
						)}
					</Stack>
					<Paper withBorder style={{ height: "100%" }} p="md">
						{nextItem ? (
							<Stack>
								<Title order={2}>Next Item</Title>
								<Text>{shelfLocationString(nextItem.shelfLocation)}</Text>

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
				</Group>
			</Paper>
			<Button onClick={onEditItems}>
				Change Items <Space w="sm" /> <IconEdit />
			</Button>
		</Stack>
	);
};
