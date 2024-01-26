import positions_raw from "../assets/positions.json";

export const positionsJson = positions_raw as Record<
	string,
	{
		average_position: { x: number; y: number };
		name: string;
		section: string;
		shelves: Record<
			string,
			{
				corridor: string;
				shelf: string;
				x: number;
				y: number;
				route_projection: {
					connection: { i1: number; i2: number };
					t: number;
					point: { x: number; y: number };
				};
			}
		>;
	}
>;
