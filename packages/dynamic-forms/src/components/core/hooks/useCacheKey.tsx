/**
 * Cache key hook for SWR
 */

import { useCallback, useState } from "react"

type ICacheKeyHookReturn = [number, () => void]

export const useCacheKey = (): ICacheKeyHookReturn => {
	const [ckey, setCkey] = useState(Date.now())

	const refresh = useCallback(() => {
		setCkey(Date.now())
	}, [])

	return [ckey, refresh]
}
