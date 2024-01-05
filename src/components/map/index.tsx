import { FC } from "react";
import { PlantSvg } from "../../assets/plant";

import style from "./styles.module.css";

export type Point = { x: number; y: number };

export type Dot = Point & {
	radius?: number;
};

export type Line = [Point, Point];

export const Map: FC<{
	points?: Dot[];
	lines?: Line[];
}> = ({ points = [], lines = [] }) => {
	return (
		<div className={style.main}>
			<div className={style.container}>
				<svg
					viewBox="0 0 703.19202 480.76474"
					xmlns="http://www.w3.org/2000/svg"
					version="1.1"
					style={{ position: "absolute" }}
				>
					{points.map(({ x, y, radius }, index) => (
						<circle
							key={index}
							cx={x}
							cy={y}
							r={radius ?? 5}
							fill="var(--color-primary)"
						/>
					))}
					{lines.map(([{ x: x1, y: y1 }, { x: x2, y: y2 }], index) => (
						<line
							key={index}
							stroke="var(--color-primary)"
							x1={x1}
							y1={y1}
							x2={x2}
							y2={y2}
						/>
					))}
				</svg>
				<PlantSvg />
			</div>
		</div>
	);
};
