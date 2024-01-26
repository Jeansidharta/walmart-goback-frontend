import { FC, useMemo, useState } from "react";
import { Line, Map } from "../../../components/map";
import { Group, Stack, Switch } from "@mantine/core";
import { positionsJson } from "../../../utils/typed-positions";
import route from "../../../assets/route.json";

export const AllPointsMap: FC = () => {
	const [showProjections, setShowProjections] = useState(true);
	const [showPath, setShowPath] = useState(true);

	const allPoints = useMemo(() => {
		const corridors = Object.values(positionsJson);
		return corridors.flatMap((corridor) =>
			Object.values(corridor.shelves).map(({ x, y }) => ({
				x,
				y,
				radius: 5,
			})),
		);
	}, []);

	const projections = useMemo(() => {
		if (!showProjections) return [];
		const corridors = Object.entries(positionsJson);
		return corridors.flatMap(([corridorName, corridor]) =>
			Object.entries(corridor.shelves).map(
				([
					shelfName,
					{
						route_projection: {
							point: { x, y },
						},
					},
				]) => ({
					x,
					y,
					corridorName,
					shelfName,
					radius: 3,
					color: "var(--color-secondary)",
				}),
			),
		);
	}, [showProjections]);

	const pointProjectionLines = useMemo(() => {
		if (!showProjections) return [];
		return projections.map(
			({ x, y, corridorName, shelfName }) =>
				({
					points: [
						{
							x,
							y,
						},
						{
							x: positionsJson[corridorName].shelves[shelfName].x,
							y: positionsJson[corridorName].shelves[shelfName].y,
						},
					],
					color: "var(--color-secondary)",
					width: 2,
				}) as Line,
		);
	}, [projections, showProjections]);

	const pathLines = useMemo(() => {
		if (!showPath) return [];
		return route.connections.map(({ i1, i2 }) => {
			const { x: x1, y: y1 } = route.points[i1];
			const { x: x2, y: y2 } = route.points[i2];
			return {
				points: [
					{ x: x1, y: y1 },
					{ x: x2, y: y2 },
				],
				color: "black",
				width: 1,
			} as Line;
		});
	}, [projections, showPath]);

	return (
		<Stack>
			<Map
				points={[...allPoints, ...projections]}
				lines={[...pointProjectionLines, ...pathLines]}
			/>
			<form>
				<Group>
					<Switch
						label="Show path"
						checked={showPath}
						onChange={(e) => setShowPath(e.target.checked)}
					/>
					<Switch
						label="Show projections"
						checked={showProjections}
						onChange={(e) => setShowProjections(e.target.checked)}
					/>
				</Group>
			</form>
		</Stack>
	);
};
