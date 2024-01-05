import { FC } from "react";
import { AppShell, Container, Paper, Stack } from "@mantine/core";
import { Outlet } from "react-router-dom";

export const AppLayout: FC = () => {
	return (
		<AppShell p="md">
			<AppShell.Header>
				<Paper p="md" shadow="md" withBorder />
			</AppShell.Header>
			<AppShell.Main>
				<Stack align="center" pt="xl">
					<Container size={600} style={{ padding: 0 }}>
						<Outlet />
					</Container>
				</Stack>
			</AppShell.Main>
		</AppShell>
	);
};
