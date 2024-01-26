import { FC, useState } from "react";
import {
	Modal,
	Stack,
	TextInput,
	Text,
	Button,
	Space,
	Switch,
} from "@mantine/core";
import { IconMap } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import {
	isShelfLocationImplemented,
	stringToLocation,
} from "../../utils/shelf-location";
import { ShelfLocation } from "../../models";

export const TraceRouteButton: FC<{
	onSubmit?: (startPosition: ShelfLocation | null) => void;
}> = ({ onSubmit = () => { } }) => {
	const [isOpen, setIsOpen] = useState(false);
	const form = useForm({
		initialValues: {
			startPosition: "",
			startFromCustomerService: true,
		},
		validate: (value) => {
			if (value.startFromCustomerService) {
				return {};
			}
			if (!value.startPosition) {
				return { startPosition: "You must provide a start position!" };
			}

			const result = stringToLocation(value.startPosition);
			if (!result) return { startPosition: "Invalid position" };
			if (!isShelfLocationImplemented(result)) {
				return { startPosition: "This shelf location was not implemented" };
			}
			return {};
		},
	});

	return (
		<>
			<Button onClick={() => setIsOpen(true)}>
				Trace Route <Space w="sm" /> <IconMap />
			</Button>

			<Modal
				opened={isOpen}
				onClose={() => setIsOpen(false)}
				title="Trace Route!"
			>
				<form
					onSubmit={form.onSubmit((value) => {
						onSubmit(stringToLocation(value.startPosition));
						setIsOpen(false);
					})}
				>
					<Stack>
						<Text>Where do you want to start your path?</Text>
						<Switch
							label="Start from customer service"
							checked={form.values.startFromCustomerService}
							onChange={(e) =>
								form.setFieldValue("startFromCustomerService", e.target.checked)
							}
						/>
						{!form.values.startFromCustomerService && (
							<TextInput
								label="Shelf start position"
								{...form.getInputProps("startPosition")}
							/>
						)}
						<Button type="submit">Go!</Button>
					</Stack>
				</form>
			</Modal>
		</>
	);
};
