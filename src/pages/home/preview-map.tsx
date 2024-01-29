import { FC } from "react";
import { Map } from "../../components/map";
import { ShelfLocation } from "../../models";

export const PreviewMap: FC<{ locations: ShelfLocation[] }> = ({
	locations,
}) => {
	return (
		<Map locationsHighlight={[{ locations, color: "var(--color-primary)" }]} />
	);
};
