import { FC, useState } from "react";
import PlantSvg from "../../assets/plant.svg?raw";
import styled from "styled-components";

import style from "./styles.module.css";
import { ActionIcon } from "@mantine/core";
import { IconArrowsMaximize } from "@tabler/icons-react";

export type Point = { x: number; y: number };

export type Dot = Point & {
	radius?: number;
	color?: string;
};

export type Line = { points: [Point, Point]; color?: string; width?: number };

const SvgContainer = styled.div`
  g[inkscape\\:label="Route"] {
    visibility: hidden;
  }
`;

export const Map: FC<{
	points?: Dot[];
	lines?: Line[];
	lineWidth?: number;
}> = ({ points = [], lines = [], lineWidth = 5 }) => {
	const [isSizedUp, setIsSizedUp] = useState(false);

	return (
		<div
			className={style.main}
			style={isSizedUp ? { width: "max-content" } : {}}
		>
			<div
				className={style.container}
				style={isSizedUp ? { width: "max-content" } : {}}
				onClick={() => setIsSizedUp(false)}
			>
				<svg
					viewBox="0 0 3300 2550"
					xmlns="http://www.w3.org/2000/svg"
					version="1.1"
					style={{
						position: "absolute",
						width: isSizedUp ? "" : "100%",
						height: "max-content",
					}}
				>
					{points.map(({ x, y, color, radius }, index) => (
						<circle
							key={index}
							cx={x}
							cy={y}
							r={radius ?? 5}
							fill={color || "var(--color-primary)"}
						/>
					))}
					{lines.map(
						(
							{
								points: [{ x: x1, y: y1 }, { x: x2, y: y2 }],
								color = "var(--color-primary)",
								width = lineWidth,
							},
							index,
						) => (
							<line
								key={index}
								stroke={color}
								strokeWidth={width}
								x1={x1}
								y1={y1}
								x2={x2}
								y2={y2}
							/>
						),
					)}
				</svg>
				<SvgContainer dangerouslySetInnerHTML={{ __html: PlantSvg }} />
				<ActionIcon
					style={{
						position: "absolute",
						bottom: 8,
						right: 8,
					}}
					color="blue"
					onClick={(e) => {
						e.stopPropagation();
						setIsSizedUp(true);
					}}
				>
					<IconArrowsMaximize />
				</ActionIcon>
			</div>
		</div>
	);
};
