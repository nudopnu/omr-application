
export interface FuseRule<T, R, S> {
    aItems: T[];
    bItems: R[];
    fuse: (a: T, b: R) => S;
}

export class RandomFuseBag { }