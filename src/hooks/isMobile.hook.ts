import { useCallback, useEffect, useState } from 'react'

const DESKTOP_WIDTH = 1024

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false)

    /* eslint-disable no-restricted-globals */
    const resizeCallback = useCallback(() => {
        setIsMobile(innerWidth < DESKTOP_WIDTH)
    }, [])

    useEffect(() => {
        addEventListener('resize', resizeCallback)

        resizeCallback()

        return () => {
            removeEventListener('resize', resizeCallback)
        }
    }, [])
    /* eslint-enable no-restricted-globals */

    return {
        isMobile
    }
}
