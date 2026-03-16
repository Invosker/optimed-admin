'use client'
import { useLayoutEffect, useState } from "react";
import { useMediaQuery } from "./useMediaQuery";

export function useBreakpoints() {
    const [isClient, setIsClient] = useState(false);

    const breakpoints = {
        isXs: useMediaQuery("(max-width: 767px)"),
        isSm: useMediaQuery("(min-width: 768px) and (max-width: 1023px)"),
        isMd: useMediaQuery("(min-width: 1024px) and (max-width: 1279px)"),
        isLg: useMediaQuery("(min-width: 1280px)"),
        active: "SSR",
    };

    useLayoutEffect(() => {
        if (typeof window !== "undefined") setIsClient(true);
    }, []);

    if (isClient && breakpoints.isXs) breakpoints.active = "xs";
    if (isClient && breakpoints.isSm) breakpoints.active = "sm";
    if (isClient && breakpoints.isMd) breakpoints.active = "md";
    if (isClient && breakpoints.isLg) breakpoints.active = "lg";

    return breakpoints;
}