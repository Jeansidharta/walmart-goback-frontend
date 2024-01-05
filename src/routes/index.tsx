import { FC } from "react";
import {
	Navigate,
	RouterProvider,
	createBrowserRouter,
} from "react-router-dom";
import { HomePage } from "../pages/home/page";
import { AppLayout } from "../layouts/with-navbar/layout";
import { ROUTES } from "./routes";
import { TestPage } from "../pages/test/page";

const router = createBrowserRouter([
	{
		path: "/",
		element: <AppLayout />,
		children: [
			{ path: ROUTES.HOME.path, element: <HomePage /> },
			{ path: ROUTES.TEST.path, element: <TestPage /> },
			{ path: "/", element: <Navigate to={ROUTES.HOME.path} /> },
		],
	},
]);

export const Router: FC<unknown> = () => {
	return <RouterProvider router={router} />;
};
