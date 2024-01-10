import { FC, useCallback, useEffect, useState } from "react";
import { ActionIcon, Group, Loader, Paper, Stack, Text } from "@mantine/core";
import { fetcher } from "../../../utils/fetcher";
import ago from "s-ago";
import { IconShoppingCart } from "@tabler/icons-react";

type Cart = {
	creation_date: number;
	id: number;
	name: string;
};

const Cart: FC<{ cart: Cart; onClick: () => void }> = ({ cart, onClick }) => {
	return (
		<Paper
			p="xs"
			withBorder
			variant="outline"
			onClick={onClick}
			style={{ pointer: "cursor" }}
		>
			<Group justify="space-between">
				<ActionIcon onClick={onClick}>
					<IconShoppingCart style={{ width: "70%", height: "70%" }} />
				</ActionIcon>
				<Text style={{ flex: 1 }}>{cart.name}</Text>
				{ago(new Date(cart.creation_date))}
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
	}, [fetchList]);

	function renderList() {
		if (!data) return null;
		if (data.length === 0) return <Text>No carts</Text>;
		return data.map((cart) => (
			<Cart key={cart.id} cart={cart} onClick={() => onSelect(cart.id)} />
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
