import { Button, Select, Stack, Text } from "@mantine/core";
import { FC, useState } from "react";
import { IterationMap } from "./iteration-map";
import { AllPointsMap } from "./all-points-map";
import { RouteMap } from "./route-map";

export const TestPage: FC = () => {
	const [testType, setTestType] = useState<string | null>(null);
	return (
		<Stack>
			{testType === "Iteration map" && <IterationMap />}
			{testType === "All Points" && <AllPointsMap />}
			{testType === "Route Map" && <RouteMap />}
			{testType === null && (
				<>
					<Select
						placeholder="Pick a test type"
						data={["Iteration map", "All Points", "Route Map"]}
						onChange={(v) => setTestType(v)}
					/>
					<Text>Other options...</Text>
					<Button
						color="secondary"
						variant="outline"
						onClick={() => localStorage.clear()}
					>
						Clear Local Storage
					</Button>
				</>
			)}
		</Stack>
	);
};
