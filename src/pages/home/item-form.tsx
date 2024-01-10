import { FC } from "react";
import { Button, Paper, Stack, TextInput } from "@mantine/core";
import { WebcamCapture } from "../../components/webcam-capture";
import { useForm } from "@mantine/form";

import { ShelfLocation } from "../../models";
import { isShelfLocationImplemented } from "../../utils/shelf-location";

const positionRegex = /^(\w)(\d{1,2})\D+(\d{1,3})\D?(\d*)$/;

function parseLocation(positionRaw: string): ShelfLocation | null {
	const position = positionRaw.trim();
	const result = positionRegex.exec(position);
	if (!result) return null;
	const [, section_raw, corridor_raw, shelf_raw, subshelf_raw] = result;
	const section = section_raw.toUpperCase();
	const corridor = Number(corridor_raw);
	const shelf = Number(shelf_raw);
	const subshelf = subshelf_raw ? Number(subshelf_raw) : undefined;
	return {
		section,
		corridor,
		shelf,
		subshelf,
	};
}

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
				const result = parseLocation(pos);
				if (!result) return "Invalid position";
				if (!isShelfLocationImplemented(result)) {
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

		const position = parseLocation(data.shelfLocation)!;

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
