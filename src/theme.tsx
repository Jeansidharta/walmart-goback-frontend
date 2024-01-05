import { MantineProvider, createTheme } from "@mantine/core";
import { FC, ReactNode } from "react";

const theme = createTheme({
	primaryColor: "pink",
	black: "background",
	colors: {
		pink: [
			"#ffe8ff",
			"#ffcffe",
			"#ff9bf9",
			"#ff64f5",
			"#fe38f1",
			"#fe1cef",
			"#ff09ef",
			"#e400d5",
			"#cb00be",
			"#b100a6",
		],
	},
});

export const Theme: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<MantineProvider theme={theme} defaultColorScheme="dark">
			{children}
		</MantineProvider>
	);
};
