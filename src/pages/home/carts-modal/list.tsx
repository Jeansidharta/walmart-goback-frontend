import { FC, useCallback, useEffect, useState } from "react";
import {
	ActionIcon,
	Divider,
	Group,
	Loader,
	Paper,
	Stack,
	Text,
} from "@mantine/core";
import { fetcher } from "../../../utils/fetcher";
import ago from "s-ago";
import { IconShoppingCart, IconTrash } from "@tabler/icons-react";
import { useTriggerRefresh } from "../../../utils/use-trigger-refresh";

type Cart = {
	creation_date: number;
	id: number;
	name: string;
};

const Cart: FC<{ cart: Cart; onSelect: () => void; onDelete: () => void }> = ({
	cart,
	onSelect,
	onDelete,
}) => {
	return (
		<Paper
			p="xs"
			withBorder
			variant="outline"
			onClick={onSelect}
			style={{ pointer: "cursor" }}
		>
			<Group justify="space-between">
				<ActionIcon onClick={onSelect}>
					<IconShoppingCart style={{ width: "70%", height: "70%" }} />
				</ActionIcon>
				<Group style={{ flex: 1 }} gap="xs">
					<Text>{cart.name}</Text>
					<Divider orientation="vertical" />
					<Text style={{ flex: 1 }}>{ago(new Date(cart.creation_date))}</Text>
				</Group>
				<ActionIcon
					onClick={(e) => {
						e.stopPropagation();
						onDelete();
					}}
				>
					<IconTrash style={{ width: "70%", height: "70%" }} />
				</ActionIcon>
			</Group>
		</Paper>
	);
};

export const SavedCartsList: FC<{ onSelect: (cartId: number) => void }> = ({
	onSelect,
}) => {
	const [error, setError] = useState("");
	const [data, setData] = useState<Cart[]>();
	const [isLoading, setIsLoading] = useState(false);
	const [triggerRefresh, refreshState] = useTriggerRefresh();

	const deleteCart = useCallback(
		async (cart_id: number) => {
			setIsLoading(true);
			try {
				await fetcher.path("/cart/{cart_id}/").method("delete").create()({
					cart_id,
				});
				triggerRefresh();
				setError("");
			} catch {
				setError("Failed to delete cart");
				setIsLoading(false);
			}
		},
		[triggerRefresh],
	);

	const fetchList = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await fetcher.path("/cart/").method("get").create()({});
			const carts = response.data.data.carts;
			setData(carts);
			setError("");
		} catch {
			setError("Failed to retrieve carts");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchList();
	}, [fetchList, refreshState]);

	function renderList() {
		if (!data) return null;
		if (data.length === 0) return <Text>No carts saved</Text>;
		return data.map((cart) => (
			<Cart
				key={cart.id}
				cart={cart}
				onSelect={() => onSelect(cart.id)}
				onDelete={() => deleteCart(cart.id)}
			/>
		));
	}

	return (
		<Paper>
			{isLoading ? (
				<Loader />
			) : error ? (
				<Text>{error}</Text>
			) : data ? (
				<Stack>{renderList()}</Stack>
			) : (
				<>Test</>
			)}
		</Paper>
	);
};
