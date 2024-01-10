import { FC } from "react";
import { Map } from "../../../components/map";
import { Item } from "../../../models";

const initialPosition = {
	x: 243.98216,
	y: 462.63477,
};

export const SolutionMap: FC<{
	solution: Item[];
}> = ({ solution }) => {
	const points = solution.map(({ x, y }) => ({
		x,
		y,
	}));

	const lines: [{ x: number; y: number }, { x: number; y: number }][] = [];
	solution.forEach(({ x, y }, index) => {
		if (index == 0) {
			lines.push([
				{ x: initialPosition.x, y: initialPosition.y },
				{ x, y },
			]);
			return;
		}
		const oldPoint = points[index - 1];
		lines.push([
			{ x: oldPoint.x, y: oldPoint.y },
			{ x, y },
		]);
	});

	return <Map points={points} lines={lines} />;
};
