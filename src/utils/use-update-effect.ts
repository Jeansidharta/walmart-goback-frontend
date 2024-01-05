import { useEffect, useRef } from "react";

export const useUpdateEffect: typeof useEffect = (func, deps) => {
	const tracker = useRef(false);
	useEffect(() => {
		if (tracker.current === false) {
			tracker.current = true;
		} else {
			func();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
};
