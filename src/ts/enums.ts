enum GridSizeChoice {
    Small,
    Medium,
    Large,
}
enum AlgoChoice {
    Dijkstra,
}

function createKeysFromEnum<T>(e: T): string[] {
    return Object.values(e).filter(val => typeof val === 'string');
}

export { GridSizeChoice, AlgoChoice, createKeysFromEnum };
