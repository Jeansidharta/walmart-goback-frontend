import { FC, useState } from "react";
import {
	ActionIcon,
	Button,
	Modal,
	Stack,
	TextInput,
	Text,
} from "@mantine/core";
import { IconShare } from "@tabler/icons-react";
import { fetcher } from "../../utils/fetcher";
import { useForm } from "@mantine/form";
import { Item } from "../../models";
import { QRCodeSVG } from "qrcode.react";

type FormData = {
	name: string;
};

export const ShareButton: FC<{ items: Item[] }> = ({ items }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [cartId, setCartId] = useState<string | null>(null);
	const form = useForm<FormData>({
		initialValues: {
			name: "",
		},
		validate: {
			name: (name) => (name ? null : "You must provide a name!"),
		},
	});

	async function handleSubmit({ name }: FormData) {
		if (isLoading) return;

		setIsLoading(true);
		try {
			const response = await fetcher.path("/cart/").method("post").create()({
				name,
				items: items.map((item) => ({
					...item.shelfLocation,
					photo: item.photo,
				})),
			});
			setCartId(response.data.data.cart.id.toString());
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			<ActionIcon
				color="secondary"
				variant="outline"
				onClick={() => setIsOpen(true)}
			>
				<IconShare style={{ width: "70%", height: "70%" }} />
			</ActionIcon>

			<Modal
				opened={isOpen}
				onClose={() => setIsOpen(false)}
				title="You're sharing your cart"
				closeOnClickOutside={false}
			>
				{cartId ? (
					<QRCodeSVG
						value={cartId}
						style={{
							width: "100%",
							height: "max-content",
							backgroundColor: "white",
							padding: "16px",
						}}
					/>
				) : (
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<Stack>
							<Text>
								This cart has <strong>{items.length}</strong> items
							</Text>
							<TextInput
								label="Cart Name"
								{...form.getInputProps("name")}
								required
							/>
							<Button type="submit" loading={isLoading}>
								Share
							</Button>
						</Stack>
					</form>
				)}
			</Modal>
		</>
	);
};
