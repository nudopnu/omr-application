export type Optional<T> = {
    [key in keyof T]: T[key] | undefined;
} | undefined | null;