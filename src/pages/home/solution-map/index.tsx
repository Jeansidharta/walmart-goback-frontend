import { FC } from "react";
import { Line, Map } from "../../../components/map";
import { Solution } from "../page";

const initialPosition = {
	x: 1149.8516,
	y: 2132.9524,
};

function randomColor() {
	const rand = () =>
		Math.floor(Math.random() * 0xff)
			.toString(16)
			.padStart(2, "0");
	return `#${rand()}${rand()}${rand()}`;
}

export const SolutionMap: FC<{
	solution: Solution;
}> = ({ solution }) => {
	const points = solution.map(([{ x, y }]) => {
		return {
			x,
			y,
			radius: 10,
		};
	});

	const lines: Line[] = [];
	let prev_point = initialPosition;
	solution.forEach(([, , path]) => {
		const color = randomColor();
		path.forEach((point) => {
			const { x, y } = point;
			lines.push({
				points: [
					{ x: prev_point.x, y: prev_point.y },
					{ x, y },
				],
				color,
			});
			prev_point = point;
		});
		prev_point = path[path.length - 1];
	});

	return <Map points={points} lines={lines} />;
};
