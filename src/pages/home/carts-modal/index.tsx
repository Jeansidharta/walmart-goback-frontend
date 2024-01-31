import { ActionIcon, Modal, Text } from "@mantine/core";
import { FC, useState } from "react";
import { Item, ShelfLocation } from "../../../models";
import { ScanCamera } from "./scan-camera";
import { SavedCartsList } from "./list";
import { fetcher } from "../../../utils/fetcher";
import { shelfLocationToPosition } from "../../../utils/shelf-location";
import { IconQrcode } from "@tabler/icons-react";

export type Cart = {
	id: number;
	name: string;
};

export const CartsModal: FC<{
	onScan: (cart: Cart, newItems: Item[]) => void;
}> = ({ onScan }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function fetchCart(cart_id: number) {
		if (isLoading) return;

		setIsLoading(true);
		try {
			const response = await fetcher
				.path("/cart/{cart_id}/")
				.method("get")
				.create()({ cart_id });

			const { items, cart } = response.data.data;
			if (items.length === 0) {
				setError("It seems this cart was empty");
				return;
			}
			onScan(
				cart,
				items.map((item) => {
					const location: ShelfLocation = {
						section: item.section,
						corridor: item.corridor,
						shelf: item.shelf,
						subshelf: item.subshelf,
					};

					const { x, y } = shelfLocationToPosition(location)!;

					return {
						photo: item.photo,
						shelfLocation: location,
						x,
						y,
						isCold: item.is_cold === 0 ? false : true,
					};
				}),
			);
			setError("");
		} catch (e) {
			console.error(e);
			setError("Failed to retrieve cart: " + e);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			<ActionIcon onClick={() => setIsOpen(true)}>
				<IconQrcode style={{ width: "70%", height: "70%" }} />
			</ActionIcon>
			<Modal
				opened={isOpen}
				onClose={() => setIsOpen(false)}
				title="Scan Cart QRCode"
				closeOnClickOutside={false}
			>
				{error && (
					<Text
						style={{
							color: "var(--mantine-color-error)",
							fontSize:
								"var(--input-error-size,calc(var(--mantine-font-size-sm) - .125rem*var(--mantine-scale)))",
						}}
						size="sm"
					>
						{error}
					</Text>
				)}
				{isOpen && !isLoading && (
					<>
						<ScanCamera onScan={fetchCart} />
						<SavedCartsList onSelect={fetchCart} />
					</>
				)}
			</Modal>
		</>
	);
};
