import { useCallback, useState } from "react";

export function useTriggerRefresh() {
	const [state, setState] = useState(false);
	const trigger = useCallback(() => setState((s) => !s), []);
	return [trigger, state] as const;
}
