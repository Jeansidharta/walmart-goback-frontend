import { Select, Stack } from "@mantine/core";
import { FC, useState } from "react";
import { IterationMap } from "./iteration-map";
import { AllPointsMap } from "./all-points-map";

export const TestPage: FC = () => {
	const [testType, setTestType] = useState<string | null>(null);
	return (
		<Stack>
			{testType === "Iteration map" && <IterationMap />}
			{testType === "All Points" && <AllPointsMap />}
			<Select
				placeholder="Pick a test type"
				data={["Iteration map", "All Points"]}
				onChange={(v) => setTestType(v)}
			/>
		</Stack>
	);
};
