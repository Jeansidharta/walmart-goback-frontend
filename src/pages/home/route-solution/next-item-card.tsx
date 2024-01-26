import { FC } from "react";
import { Item } from "../../../models";
import { Group, Image, Stack, Text } from "@mantine/core";
import { shelfLocationString } from "../../../utils/shelf-location";

export const NextItemCard: FC<{ item: Item }> = ({ item }) => {
	return (
		<Stack>
			<Text>
				Location: <strong>{shelfLocationString(item.shelfLocation)}</strong>
			</Text>

			<Group
				align="center"
				justify="center"
				style={{ width: 200, height: 200 }}
			>
				<Image fit="contain" src={item.photo} h={200} w={200} />
			</Group>
		</Stack>
	);
};
