import { Fetcher } from "openapi-typescript-fetch";
import { paths } from "../backend-schema";

export const fetcher = Fetcher.for<paths>();

fetcher.configure({
	baseUrl: import.meta.env.VITE_BACKEND_URL,
	init: {},
});
