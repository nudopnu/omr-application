export const Dynamics = [
    'f',
    'ff',
    'fff',
    'ffff',
    'mf',
    'p',
    'pp',
    'ppp',
    'pppp',
    'mp',
    'sfz',
] as const;

export type Dynamic = typeof Dynamics[number];