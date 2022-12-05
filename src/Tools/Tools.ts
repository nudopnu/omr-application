export const ToolTypes = [
    'ABC_EDITOR',
    'BOUNDING_BOX_CREATION',
] as const;

export type Tool = typeof ToolTypes[number];