import { useState } from "react";
import { useUpdateEffect } from "./use-update-effect";

export function useLocalStorage<T extends object>(
	key: string,
	initialValue: T,
): [T, (state: T) => void] {
	const [state, setState] = useState<T>(() => {
		const itemInStorage = localStorage.getItem(key);
		if (itemInStorage) {
			return JSON.parse(itemInStorage);
		} else {
			localStorage.setItem(key, JSON.stringify(initialValue));
			return initialValue;
		}
	});

	useUpdateEffect(() => {
		localStorage.setItem(key, JSON.stringify(state));
	}, [state, key, initialValue]);

	return [state, setState];
}
