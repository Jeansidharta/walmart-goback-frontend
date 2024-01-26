import { FC } from "react";
import { Line, Map } from "../../components/map";
import { Solution } from "./page";

export const SolutionMap: FC<{
	solution: Solution;
	currentIndex: number;
}> = ({ solution, currentIndex }) => {
	const points = (solution?.route ?? []).map(({ item: { x, y } }) => {
		return {
			x,
			y,
			radius: 10,
			color: "gray",
		};
	});
	points.push({
		...solution.route[currentIndex].item,
		radius: 15,
		color: "var(--color-primary)",
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
				width: 3,
				color: "gray",
			});
			prev_point = point;
		});
		prev_point = path[path.length - 1];
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
			width: 5,
			color: "var(--color-primary)",
		});
		prev_point = point;
	});

	return <Map points={points} lines={lines} />;
};
