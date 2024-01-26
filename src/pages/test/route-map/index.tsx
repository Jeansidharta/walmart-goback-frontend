import { FC } from "react";
import route from "../../../assets/route.json";
import PlantSvg from "../../../assets/plant.svg";
import style from "./styles.module.css";

export const RouteMap: FC = () => {
	return (
		<div className={style.main}>
			<div className={style.container}>
				<svg
					viewBox="0 0 703.19202 480.76474"
					xmlns="http://www.w3.org/2000/svg"
					version="1.1"
					style={{ position: "absolute" }}
				>
					{route.points.map(({ x, y }, index) => (
						<circle
							key={index}
							cx={x}
							cy={y}
							r={5}
							fill="var(--color-primary)"
						/>
					))}
					{route.connections.map(({ i1: start, i2: end }) => (
						<line
							key={Math.random()}
							stroke="var(--color-primary)"
							x1={route.points[start].x}
							y1={route.points[start].y}
							x2={route.points[end].x}
							y2={route.points[end].y}
						/>
					))}
				</svg>
				<img src={PlantSvg} width={703} height={480} />
			</div>
		</div>
	);
};
