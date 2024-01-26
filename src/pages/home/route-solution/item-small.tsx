import { FC } from "react";
import { Item } from "../models";
import { ActionIcon, Group, Paper, Image } from "@mantine/core";
import { shelfLocationString } from "../utils/shelf-location";
import { IconCheck } from "@tabler/icons-react";

export const ItemSmall: FC<{ item: Item; onVisit: () => void }> = ({
	item: { shelfLocation, photo },
	onVisit,
}) => {
	return (
		<Paper style={{ width: "100%" }} p="sm" withBorder>
			<Group justify="space-between">
				<Image src={photo} />
				{shelfLocationString(shelfLocation)}
				<ActionIcon color="secondary" variant="outline" onClick={onVisit}>
					<IconCheck />
				</ActionIcon>
			</Group>
		</Paper>
	);
};
