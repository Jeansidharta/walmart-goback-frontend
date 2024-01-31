import { useState } from "react";
import { useUpdateEffect } from "./use-update-effect";

const appVersion = "1.0.1";

export function useLocalStorage<T extends object>(
	key: string,
	initialValue: T | null,
): [T, (state: T | ((s: T) => T)) => void] {
	const [state, setState] = useState<T>(() => {
		const itemInStorage = localStorage.getItem(key);

		function writeInitialValue() {
			localStorage.setItem(
				key,
				JSON.stringify({ value: initialValue, appVersion }),
			);
		}

		if (!itemInStorage) {
			writeInitialValue();
			return initialValue;
		}
		const rawJson = JSON.parse(itemInStorage);
		if (!rawJson || typeof rawJson !== "object") {
			writeInitialValue();
			return initialValue;
		}
		if (appVersion !== rawJson.appVersion) {
			writeInitialValue();
			return initialValue;
		} else {
			return rawJson.value;
		}
	});

	useUpdateEffect(() => {
		localStorage.setItem(key, JSON.stringify({ value: state, appVersion }));
	}, [state, key, initialValue]);

	return [state, setState];
}
