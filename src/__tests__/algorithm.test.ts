import { DijkstraAlgorithm, AstarAlgorithm } from '../ts/algorithm';
import { GridGraph } from '../ts/graph';

describe('testing behavior of Dijkstra algorithm', () => {
    const TEST_DATA = {
        gridWidth: 4,
        gridHeight: 3,
        initNodeId: 1,
        targetNodeId: 10,
    };
    let graph: GridGraph = null;
    let algo: DijkstraAlgorithm = null;

    beforeEach(() => {
        graph = new GridGraph(TEST_DATA.gridWidth, TEST_DATA.gridHeight);
        graph.nodeIdsClicked = [TEST_DATA.initNodeId, TEST_DATA.targetNodeId];
        algo = new DijkstraAlgorithm(graph);
    });

    test('algorithm distance should be 0 for init and inifinity for others', () => {
        const expectedDistances = [
            Infinity, 0, Infinity, Infinity, Infinity,
            Infinity, Infinity, Infinity, Infinity, Infinity,
            Infinity, Infinity,
        ];
        
        expect(algo.shortestDistances).toEqual(expectedDistances);
    });

    test('shortest distances after first step', () => {
        const expectedDistances = [
            1, 0, 1, Infinity,
            Infinity, 1, Infinity, Infinity,
            Infinity, Infinity, Infinity, Infinity,
        ];
        
        algo.step();
        
        expect(algo.shortestDistances).toEqual(expectedDistances);
    });

    test('shortest distances after second step', () => {
        const expectedDistances = [
            1, 0, 1, Infinity,
            2, 1, Infinity, Infinity,
            Infinity, Infinity, Infinity, Infinity,
        ];
        
        algo.step();
        algo.step();
        
        expect(algo.shortestDistances).toEqual(expectedDistances);
    });

    test('shortest distances after completion', () => {
        const expectedDistances = [
            1, 0, 1, 2,
            2, 1, 2, 3,
            3, 2, 3, 4,
        ];

        while (!algo.isCompleted)
            algo.step();

        expect(algo.shortestDistances).toEqual(expectedDistances);
    });

    test('shortest path after completion', () => {
        const expectedPath = [ 10, 6, 2, 1 ];

        while (!algo.isCompleted)
            algo.step();

        expect(algo.calculateShortestPath()).toEqual(expectedPath);
    });

    test('shortest path before completion should return empty array', () => {
        const expectedPath: number[] = [];

        algo.step();
        algo.step();

        expect(algo.calculateShortestPath()).toEqual(expectedPath);
    });

    test('should throw when graph not clicked twice', () => {
        graph = new GridGraph(TEST_DATA.gridWidth, TEST_DATA.gridHeight);
        // graph.nodeIdsClicked is empty

        expect(() => {
            new DijkstraAlgorithm(graph);
        }).toThrow();
    });
});

describe('testing behavior of Astar algo', () => {
    const TEST_DATA = {
        gridWidth: 4,
        gridHeight: 3,
        initNodeId: 1,
        targetNodeId: 9,
    };
    let graph: GridGraph = null;
    let algo: AstarAlgorithm = null;

    beforeEach(() => {
        graph = new GridGraph(TEST_DATA.gridWidth, TEST_DATA.gridHeight);
        graph.nodeIdsClicked = [TEST_DATA.initNodeId, TEST_DATA.targetNodeId];
        algo = new AstarAlgorithm(graph);
    });

    test('algorithm distance should be 0 for init and inifinity for others', () => {
        const expectedDistances = [
            Infinity, 0, Infinity, Infinity,
            Infinity, Infinity, Infinity, Infinity,
            Infinity, Infinity, Infinity, Infinity,
        ];
        
        expect(algo.shortestDistances).toEqual(expectedDistances);
    });

    test('shortest distances after first step', () => {
        const expectedDistances = [
            1, 0, 1, Infinity,
            Infinity, 1, Infinity, Infinity,
            Infinity, Infinity, Infinity, Infinity,
        ];
        
        algo.step();
        
        expect(algo.shortestDistances).toEqual(expectedDistances);
    });

    test('shortest distances after second step', () => {
        const expectedDistances = [
            1, 0, 1, Infinity,
            2, 1, 2, Infinity,
            Infinity, 2, Infinity, Infinity,
        ];
        
        algo.step();
        algo.step();
        
        expect(algo.shortestDistances).toEqual(expectedDistances);
    });

    test('shortest distances after completion', () => {
        const expectedDistances = [
            1, 0, 1, Infinity,
            2, 1, 2, Infinity,
            Infinity, 2, Infinity, Infinity,
        ];

        while (!algo.isCompleted)
            algo.step();

        expect(algo.shortestDistances).toEqual(expectedDistances);
    });

    test('shortest path after completion', () => {
        const expectedPath = [ 9, 5, 1 ];

        while (!algo.isCompleted)
            algo.step();

        expect(algo.calculateShortestPath()).toEqual(expectedPath);
    });

    test('shortest path before completion should return empty array', () => {
        const expectedPath: number[] = [];

        algo.step();
        algo.step();

        expect(algo.calculateShortestPath()).toEqual(expectedPath);
    });

    test('should throw when graph not clicked twice', () => {
        graph = new GridGraph(TEST_DATA.gridWidth, TEST_DATA.gridHeight);
        // graph.nodeIdsClicked is empty

        expect(() => {
            new AstarAlgorithm(graph);
        }).toThrow();
    });
});
