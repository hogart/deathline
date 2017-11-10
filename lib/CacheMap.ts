export class CacheMap<TKey, TValue> {
    private cache = new Map<TKey, TValue>();
    private factory: (key: TKey) => TValue;

    constructor(factory: (key: TKey) => TValue) {
        this.factory = factory;
    }

    private set(key: TKey, value: TValue): TValue {
        this.cache.set(key, value);

        return value;
    }

    public get(key: TKey): TValue {
        if (this.cache.has(key)) {
            return this.cache.get(key) as TValue; // it will never be undefined, since we checked for that before
        } else {
            return this.set(key, this.factory(key));
        }
    }
}