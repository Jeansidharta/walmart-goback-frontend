import { FC } from "react";
import { Item } from "../page";
import { Map } from "../../../components/map";

const initialPosition = {
	x: 243.98216,
	y: 462.63477,
};

export const SolutionMap: FC<{
	solution: Item[];
}> = ({ solution }) => {
	const points = solution.map(({ position }) => ({
		x: position.x,
		y: position.y,
	}));

	const lines: [{ x: number; y: number }, { x: number; y: number }][] = [];
	solution.forEach(({ position }, index) => {
		if (index == 0) {
			lines.push([
				{ x: initialPosition.x, y: initialPosition.y },
				{ x: position.x, y: position.y },
			]);
			return;
		}
		const oldPoint = points[index - 1];
		lines.push([
			{ x: oldPoint.x, y: oldPoint.y },
			{ x: position.x, y: position.y },
		]);
	});

	return <Map points={points} lines={lines} />;
};
