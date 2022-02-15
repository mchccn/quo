export const getlast = (list: unknown) => (Array.isArray(list) ? list?.[list.length - 1] ?? null : list);
