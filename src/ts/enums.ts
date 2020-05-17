enum GridSizeChoice {
    Small,
    Medium,
    Large,
}
enum AlgoChoice {
    Dijkstra,
}

function createStringArrayFromEnum(e: typeof GridSizeChoice|typeof AlgoChoice): string[] {
    return Object.values(e).filter(val => typeof val === 'string');
}

function createKeysFromEnum<T>(e: T): (keyof T)[] {
    return Object.values(e).filter(val => typeof val === 'string');
}

export { GridSizeChoice, AlgoChoice, createStringArrayFromEnum };
