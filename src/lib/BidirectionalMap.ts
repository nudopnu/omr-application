export class BidirectionalMap<K, V> {

    private map: Map<K, V> = new Map();
    private reverseMap: Map<V, K> = new Map();

    constructor() {
        this.reset();
    }

    reset() {
        this.map = new Map();
        this.reverseMap = new Map();
    }

    set(key: K, value: V) {
        this.map.set(key, value);
        this.reverseMap.set(value, key);
    }

    hasKey(key: K): boolean {
        return this.map.has(key);
    }

    hasValue(key: V): boolean {
        return this.reverseMap.has(key);
    }

    getKey(value: V) {
        return this.reverseMap.get(value);
    }

    getValue(key: K) {
        return this.map.get(key);
    }

    removeValue(value: V) {
        const key = this.reverseMap.get(value);
        if (!key) return;
        this.map.delete(key);
        this.reverseMap.delete(value);
    }

    removeKey(key: K) {
        const value = this.map.get(key);
        if (!value) return;
        this.reverseMap.delete(value);
        this.map.delete(key);
    }

    values(): V[] {
        return [...this.reverseMap.keys()];
    }

    keys(): K[] {
        return [...this.map.keys()];
    }
}