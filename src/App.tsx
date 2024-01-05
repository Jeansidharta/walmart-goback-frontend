import "./App.css";
import init from "../tsp-pkg/travelling_salesman";
import { Router } from "./routes";

init();

export default function App() {
	return <Router />;
}
