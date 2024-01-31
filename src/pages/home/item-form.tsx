import { FC } from "react";
import {
	Button,
	Group,
	Paper,
	Stack,
	Switch,
	TextInput,
	Tooltip,
} from "@mantine/core";
import { WebcamCapture } from "../../components/webcam-capture";
import { useForm } from "@mantine/form";

import { ShelfLocation } from "../../models";
import {
	isCorridorImplemented,
	stringToLocation,
} from "../../utils/shelf-location";
import { IconInfoCircle } from "@tabler/icons-react";

type FormData = {
	shelfLocation: string;
	photo: string | null;
	isCold: boolean;
};

type FormSubmit = {
	shelfLocation: ShelfLocation;
	photo: string;
	isCold: boolean;
};

export const ItemForm: FC<{
	onSubmit: (values: FormSubmit) => void;
}> = ({ onSubmit }) => {
	const form = useForm<FormData>({
		initialValues: {
			isCold: false,
			shelfLocation: "",
			photo: "",
		},
		validate: {
			shelfLocation: (pos) => {
				const result = stringToLocation(pos);
				if (!result) return "Invalid position";
				if (!isCorridorImplemented(result)) {
					return "This corridor was not implemented";
				}
			},
			photo: (photo) => (photo ? null : "You must take a picture"),
		},
	});

	function handleSubmit(data: FormData) {
		const errors = form.validate();
		if (errors.hasErrors) {
			return;
		}

		const position = stringToLocation(data.shelfLocation)!;

		onSubmit({
			isCold: data.isCold,
			shelfLocation: position,
			photo: data.photo!,
		});

		form.reset();
	}

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Paper withBorder p="md">
				<Stack gap="xs">
					<TextInput
						label="Position"
						{...form.getInputProps("shelfLocation")}
						required
					/>
					<WebcamCapture {...form.getInputProps("photo")} />
					<Group gap={4}>
						<Switch
							label="Is cold?"
							checked={form.values.isCold}
							onChange={(e) => form.setFieldValue("isCold", e.target.checked)}
						/>
						<Tooltip
							label="Cold items will be prioritized"
							events={{ touch: true, focus: true, hover: true }}
						>
							<sup>
								<IconInfoCircle width={10} height={10} />
							</sup>
						</Tooltip>
					</Group>
					<Button type="submit">Add item</Button>
				</Stack>
			</Paper>
		</form>
	);
};
