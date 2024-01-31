import { FC } from "react";
import {
	Line,
	LocationHightlight,
	Map,
	Dot,
	BoundingBox,
} from "../../../components/map";
import { Solution } from "../page";

export const SolutionMap: FC<{
	solution: Solution;
	currentIndex: number | null;
	boundingBox: BoundingBox;
}> = ({ solution, currentIndex, boundingBox }) => {
	const locationHighlight: LocationHightlight = {
		color: "var(--color-secondary-light)",
		locations: [],
	};
	const points: Dot[] = [];
	(solution?.route ?? []).forEach(({ item: { x, y, shelfLocation } }) => {
		if (shelfLocation.corridor) {
			locationHighlight.locations.push(shelfLocation);
		} else {
			points.push({
				x,
				y,
				radius: 10,
				color: "var(--color-secondary-light)",
			});
		}
	});

	const lines: Line[] = [];
	let prev_point = solution.initialPosition;
	solution.route.forEach(({ path }) => {
		path.forEach((point) => {
			const { x, y } = point;
			lines.push({
				points: [
					{ x: prev_point.x, y: prev_point.y },
					{ x, y },
				],
				width: 10,
				color: "var(--color-secondary-light)",
			});
			prev_point = point;
		});
		prev_point = path[path.length - 1];
	});

	if (currentIndex !== null) {
		points.push({
			...solution.route[currentIndex].item,
			radius: 15,
			color: "var(--color-primary)",
		});

		if (currentIndex === 0) {
			prev_point = solution.initialPosition;
		} else {
			prev_point =
				solution.route[currentIndex - 1].path[
				solution.route[currentIndex - 1].path.length - 1
				];
		}
		solution.route[currentIndex].path.forEach((point) => {
			const { x, y } = point;
			lines.push({
				points: [
					{ x: prev_point.x, y: prev_point.y },
					{ x, y },
				],
				width: 10,
				color: "var(--color-primary)",
			});
			prev_point = point;
		});
	}

	return (
		<Map
			points={points}
			lines={lines}
			locationsHighlight={[locationHighlight]}
			boundingBox={boundingBox}
		/>
	);
};
