import { FC } from "react";
import { Button, Paper, Stack, TextInput } from "@mantine/core";
import { WebcamCapture } from "../../components/webcam-capture";
import { useForm } from "@mantine/form";

import positionJson from "../../assets/positions.json";
import { ShelfPosition } from "./page";

const positionRegex = /^(\w\d{1,2})\D(\d{1,3})$/;

function parsePosition(
	positionRaw: string,
	subshelf: string,
): ShelfPosition | null {
	const position = positionRaw.trim();
	const result = positionRegex.exec(position);
	if (!result) return null;
	const [, corridor_raw, shelf] = result;
	const corridor =
		corridor_raw.toUpperCase() as unknown as ShelfPosition["corridor"];
	const [x, y] = positionJson[corridor]?.average_position ?? [];
	return {
		corridor,
		shelf,
		subshelf,
		x,
		y,
	};
}

type FormData = {
	position: string;
	shelfPosition: string;
	screenshot: string | null;
};

type FormSubmit = {
	position: ShelfPosition;
	screenshot: string;
};

export const ItemForm: FC<{
	onSubmit: (values: FormSubmit) => void;
}> = ({ onSubmit }) => {
	const form = useForm<FormData>({
		initialValues: {
			position: "",
			screenshot: "",
			shelfPosition: "",
		},
		validate: {
			position: (pos) => {
				const result = parsePosition(pos, "");
				if (!result) return "Invalid position";
				const { corridor } = result;
				if (!positionJson[corridor]) {
					return "This corridor was not implemented";
				}
			},
			screenshot: (screenshot) =>
				screenshot ? null : "You must take a picture",
		},
	});

	function handleSubmit(data: FormData) {
		const errors = form.validate();
		if (errors.hasErrors) {
			return;
		}

		const position = parsePosition(data.position, data.shelfPosition)!;

		onSubmit({
			position,
			screenshot: data.screenshot!,
		});

		form.reset();
	}

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Paper withBorder p="md">
				<Stack gap="xs">
					<TextInput
						label="Position"
						{...form.getInputProps("position")}
						required
					/>
					<TextInput
						label="Shelf Position"
						{...form.getInputProps("shelfPosition")}
					/>
					<WebcamCapture {...form.getInputProps("screenshot")} />
					<Button type="submit">Add item</Button>
				</Stack>
			</Paper>
		</form>
	);
};
