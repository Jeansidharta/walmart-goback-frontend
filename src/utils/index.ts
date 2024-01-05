import { ShelfPosition } from "../pages/home/page";

export function shelfPositionString(pos: ShelfPosition) {
	let res = pos.corridor + "-" + pos.shelf;
	if (pos.subshelf) {
		res += "-" + pos.subshelf;
	}
	return res;
}
