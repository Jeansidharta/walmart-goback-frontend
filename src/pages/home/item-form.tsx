import { FC } from "react";
import { Button, Paper, Stack, TextInput } from "@mantine/core";
import { WebcamCapture } from "../../components/webcam-capture";
import { useForm } from "@mantine/form";

import { ShelfLocation } from "../../models";
import {
	isCorridorImplemented,
	stringToLocation,
} from "../../utils/shelf-location";

type FormData = {
	shelfLocation: string;
	photo: string | null;
};

type FormSubmit = {
	shelfLocation: ShelfLocation;
	photo: string;
};

export const ItemForm: FC<{
	onSubmit: (values: FormSubmit) => void;
}> = ({ onSubmit }) => {
	const form = useForm<FormData>({
		initialValues: {
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
					<Button type="submit">Add item</Button>
				</Stack>
			</Paper>
		</form>
	);
};
