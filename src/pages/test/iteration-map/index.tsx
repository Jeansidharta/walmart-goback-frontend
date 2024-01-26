import { FC, useEffect, useMemo, useState } from "react";
import { Map } from "../../../components/map";
import positions from "../../../assets/positions.json";
import { ActionIcon, Group, Slider, Stack } from "@mantine/core";
import {
	IconCaretLeft,
	IconCaretRight,
	IconPlayerPause,
	IconPlayerPlay,
	IconPlayerSkipBack,
	IconPlayerSkipForward,
	IconPlayerTrackNext,
	IconPlayerTrackPrev,
} from "@tabler/icons-react";

export const IterationMap: FC = () => {
	const [speed, setSpeed] = useState<number>(500);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	const allPoints = useMemo(() => {
		const corridors = Object.values(positions);
		return corridors
			.flatMap((corridor) =>
				Object.values(corridor.shelves).map(({ corridor, shelf, x, y }) => ({
					name: `${corridor}-${shelf}`,
					section_name: corridor[0],
					section_number: Number(corridor.substring(1)),
					corridor_name: corridor,
					shelf_name: Number(shelf),
					radius: 10,
					x,
					y,
				})),
			)
			.sort(
				(a, b) =>
					a.section_name.localeCompare(b.section_name) ||
					a.section_number - b.section_number ||
					a.shelf_name - b.shelf_name,
			);
	}, []);

	const [pointIndex, setPointIndex] = useState<number>(0);

	function prevSection() {
		for (let i = pointIndex; i > 0; i--) {
			if (allPoints[i].section_name !== allPoints[pointIndex].section_name) {
				setPointIndex(i);
				return;
			}
		}
	}

	function nextSection() {
		for (let i = pointIndex; i < allPoints.length; i++) {
			if (allPoints[i].section_name !== allPoints[pointIndex].section_name) {
				setPointIndex(i);
				return;
			}
		}
	}

	function prevShelf() {
		for (let i = pointIndex; i > 0; i--) {
			if (allPoints[i].corridor_name !== allPoints[pointIndex].corridor_name) {
				setPointIndex(i);
				return;
			}
		}
	}
	function nextShelf() {
		for (let i = pointIndex; i < allPoints.length; i++) {
			if (allPoints[i].corridor_name !== allPoints[pointIndex].corridor_name) {
				setPointIndex(i);
				return;
			}
		}
	}

	useEffect(() => {
		if (!isPlaying) return;

		const handler = setInterval(() => {
			setPointIndex((p) => Math.min(p + 1, allPoints.length - 1));
		}, speed);
		return () => clearInterval(handler);
	}, [setPointIndex, allPoints, speed, isPlaying]);
	return (
		<Stack>
			<Map points={[allPoints[pointIndex]]} />
			<p>{allPoints[pointIndex].name}</p>
			<Group style={{ width: "100%" }} wrap="nowrap">
				<ActionIcon size="sm" variant="subtle" onClick={prevSection}>
					<IconPlayerSkipBack
						style={{ width: "70%", height: "70%" }}
						stroke={1.5}
					/>
				</ActionIcon>
				<ActionIcon size="sm" variant="subtle" onClick={prevShelf}>
					<IconPlayerTrackPrev
						style={{ width: "70%", height: "70%" }}
						stroke={1.5}
					/>
				</ActionIcon>
				<ActionIcon
					size="sm"
					variant="subtle"
					onClick={() => setPointIndex((p) => Math.max(p - 1, 0))}
				>
					<IconCaretLeft style={{ width: "70%", height: "70%" }} stroke={1.5} />
				</ActionIcon>
				<div style={{ width: "100%", position: "relative" }}>
					<Slider
						onChange={(val) => setSpeed(val)}
						value={speed}
						disabled={!isPlaying}
						min={0}
						max={1000}
					/>
					<ActionIcon
						onClick={() => setIsPlaying((v) => !v)}
						variant="subtle"
						style={{
							position: "absolute",
							left: "50%",
							bottom: "100%",
							transform: "translate(-50%, 0)",
						}}
					>
						{isPlaying ? (
							<IconPlayerPause
								style={{ width: "70%", height: "70%" }}
								stroke={1.5}
							/>
						) : (
							<IconPlayerPlay
								style={{ width: "70%", height: "70%" }}
								stroke={1.5}
							/>
						)}
					</ActionIcon>
				</div>
				<ActionIcon
					size="sm"
					variant="subtle"
					onClick={() =>
						setPointIndex((p) => Math.min(p + 1, allPoints.length - 1))
					}
				>
					<IconCaretRight
						style={{ width: "70%", height: "70%" }}
						stroke={1.5}
					/>
				</ActionIcon>
				<ActionIcon size="sm" variant="subtle" onClick={nextShelf}>
					<IconPlayerTrackNext
						style={{ width: "70%", height: "70%" }}
						stroke={1.5}
					/>
				</ActionIcon>
				<ActionIcon size="sm" variant="subtle" onClick={nextSection}>
					<IconPlayerSkipForward
						style={{ width: "70%", height: "70%" }}
						stroke={1.5}
					/>
				</ActionIcon>
			</Group>
		</Stack>
	);
};
