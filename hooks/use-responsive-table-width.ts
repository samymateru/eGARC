import { useEffect, useState, useCallback } from "react";

export function useResponsiveTableWidth(
  table: { getCenterTotalSize: () => number },
  offset: number = 0
) {
  const getWidth = useCallback(
    () => Math.max(table.getCenterTotalSize(), window.innerWidth - offset),
    [table, offset]
  );

  const [tableWidth, setTableWidth] = useState(getWidth);

  useEffect(() => {
    const handleResize = () => {
      setTableWidth(getWidth());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [table, offset, getWidth]);

  return tableWidth;
}