import { DijkstraAlgorithm } from '../ts/algorithm';
import GridGraph from '../ts/graph';

describe('testing behavior of Dijkstra algorithm', () => {
    const TEST_DATA = {
        gridWidth: 4,
        gridHeight: 3,
        initNodeId: 1,
        targetNodeId: 10,
    }
    let graph = null;
    let algo: DijkstraAlgorithm = null;

    beforeEach(() => {
        graph = new GridGraph(TEST_DATA.gridWidth, TEST_DATA.gridHeight);
        algo = new DijkstraAlgorithm(graph, TEST_DATA.initNodeId, TEST_DATA.targetNodeId);
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

    // figure out how to traverse from init to at
});
