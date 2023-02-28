import { useCallback, useEffect, useState } from 'react'

const MIN_WIDTH = 1000
const MIN_HEIGHT = 900

export function useResize() {
    const [showOverlay, setShowOverlay] = useState(false)

    /* eslint-disable no-restricted-globals */
    const resizeCallback = useCallback(() => {
        setShowOverlay(innerWidth < MIN_WIDTH || innerHeight < MIN_HEIGHT)
    }, [])

    useEffect(() => {
        addEventListener('resize', resizeCallback)

        return () => {
            removeEventListener('resize', resizeCallback)
        }
    }, [])
    /* eslint-enable no-restricted-globals */

    return {
        showOverlay,
        setShowOverlay,
        resizeCallback
    }
}
