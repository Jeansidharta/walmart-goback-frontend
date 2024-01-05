import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Theme } from "./theme.tsx";

import "@mantine/core/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Theme>
			<App />
		</Theme>
	</React.StrictMode>,
);
