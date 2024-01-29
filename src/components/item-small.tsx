import { FC, ReactNode, useState } from "react";
import { Item } from "../models/index.ts";
import { ActionIcon, Group, Paper, Image, Text, Modal } from "@mantine/core";
import { subshelfLocationString } from "../utils/shelf-location.ts";

export const ItemSmall: FC<{
	item: Item;
	onAction?: () => void;
	icon: ReactNode;
}> = ({ item: { shelfLocation, photo }, onAction, icon }) => {
	const [zoomImage, setZoomImage] = useState(false);
	return (
		<Paper style={{ width: "100%" }} p="sm" withBorder>
			<Group justify="space-between">
				<Image onClick={() => setZoomImage(true)} w={40} h={40} src={photo} />
				<Text style={{ flex: 1 }}>{subshelfLocationString(shelfLocation)}</Text>
				<ActionIcon color="secondary" variant="outline" onClick={onAction}>
					{icon}
				</ActionIcon>
			</Group>

			{zoomImage && (
				<Modal opened onClose={() => setZoomImage(false)}>
					<Image src={photo} w="100%" h="100%" />
				</Modal>
			)}
		</Paper>
	);
};
