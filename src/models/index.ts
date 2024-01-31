export type ShelfLocation = {
	section: string;
	corridor: number;
	shelf: number;
	subshelf?: number | null;
};

export type Item = {
	shelfLocation: ShelfLocation;
	x: number;
	y: number;
	photo: string;
	isCold: boolean;
};
