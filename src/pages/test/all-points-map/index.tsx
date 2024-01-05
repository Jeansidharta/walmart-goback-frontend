import { FC, useMemo } from "react";
import { Map } from "../../../components/map";
import positions from "../../../assets/positions.json";
import { Stack } from "@mantine/core";

export const AllPointsMap: FC = () => {
	const allPoints = useMemo(() => {
		const corridors = Object.values(positions);
		return corridors.flatMap((corridor) =>
			corridor.shelves.map(({ x, y }) => ({
				x,
				y,
				radius: 2,
			})),
		);
	}, []);

	return (
		<Stack>
			<Map points={allPoints} />
		</Stack>
	);
};
