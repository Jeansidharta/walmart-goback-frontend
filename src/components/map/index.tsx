import { FC, useEffect, useRef, useState } from "react";
import PlantSvg from "../../assets/plant.svg?raw";
import styled from "styled-components";

import style from "./styles.module.css";
import { ActionIcon } from "@mantine/core";
import { IconArrowsMaximize } from "@tabler/icons-react";
import { ShelfLocation } from "../../models";
import { shelfLocationString } from "../../utils/shelf-location";

export type Point = { x: number; y: number };
export type BoundingBox = { topLeft: Point; bottomRight: Point };
export type LocationHightlight = { locations: ShelfLocation[]; color: string };
export type Dot = Point & {
	radius?: number;
	color?: string;
};

export type Line = { points: [Point, Point]; color?: string; width?: number };

const SvgContainer = styled.div<{
	locationsHighlight?: LocationHightlight[];
}>`
  g[inkscape\\:label="Route"] {
    visibility: hidden;
  }
  [is-position="true"] {
    fill: var(--color-gray-dark) !important;
  }
  ${({ locationsHighlight = [] }) =>
		locationsHighlight.map(
			({ locations, color }) => `${locations
				.map(
					(location) =>
						`[is-position="true"][inkscape\\:label="${shelfLocationString(
							location,
						)}"]`,
				)
				.join(",")} {
			fill: ${color} !important;
		}`,
		)}
`;

function boundingBoxToViewBox({ topLeft, bottomRight }: BoundingBox) {
	const tx = Math.max(topLeft.x) - 5;
	const ty = Math.max(topLeft.y) - 5;
	const bx = Math.min(bottomRight.x) - tx + 5;
	const by = Math.min(bottomRight.y) - ty + 5;
	return `${tx} ${ty} ${bx} ${by}`;
}

const totalBoundingBox = {
	topLeft: { x: 0, y: 0 },
	bottomRight: { x: 2796.8547, y: 1681.7852 },
} as BoundingBox;

export const Map: FC<{
	points?: Dot[];
	lines?: Line[];
	lineWidth?: number;
	locationsHighlight?: LocationHightlight[];
	boundingBox?: BoundingBox;
}> = ({
	points = [],
	lines = [],
	lineWidth = 5,
	locationsHighlight = [],
	boundingBox = totalBoundingBox,
}) => {
		const svgRef = useRef<SVGElement | null>(null);
		const [isSizedUp, setIsSizedUp] = useState(false);

		useEffect(() => {
			if (!svgRef.current) return;
			svgRef.current.setAttribute("viewBox", boundingBoxToViewBox(boundingBox));
		}, [boundingBox]);

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
						viewBox={boundingBoxToViewBox(boundingBox)}
						xmlns="http://www.w3.org/2000/svg"
						version="1.1"
						style={{
							position: "absolute",
							width: isSizedUp ? "" : "100%",
							height: "calc(100% - 6.5px)",
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
					<SvgContainer
						ref={(ref) => {
							svgRef.current = ref?.querySelector("svg") ?? null;
						}}
						locationsHighlight={locationsHighlight}
						dangerouslySetInnerHTML={{ __html: PlantSvg }}
					/>
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
