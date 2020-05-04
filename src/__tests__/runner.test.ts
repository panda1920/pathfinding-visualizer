import { GridGraph } from '../ts/graph';
import { Algorithm, DijkstraAlgorithm } from '../ts/algorithm';
import AlgoRunner from '../ts/runner';

describe('testing behavior of AlgoRunner', () => {
    let graph: GridGraph = null;
    let runner: AlgoRunner = null;
    const TEST_DATA = {
        width: 3,
        height: 3,
        initialNodeId: 0,
        targetNodeId: 8,
    };
    const algoFactory = (): Algorithm => {
        return new DijkstraAlgorithm(graph);
    }

    beforeEach(() => {
        jest.useFakeTimers();

        graph = new GridGraph(TEST_DATA.width, TEST_DATA.height);
        graph.nodesClicked.push(TEST_DATA.initialNodeId);
        graph.nodesClicked.push(TEST_DATA.targetNodeId);

        runner = new AlgoRunner(graph, algoFactory);
    });

    afterEach(() => {
        graph = null;
        runner = null;
    });

    test('run() should visit nodes around initialNode', async () => {
        const nodesVisited = [
            graph.nodes[1],
            graph.nodes[3],
        ]
        const nodesShouldNotVisit = [
            graph.nodes[2],
            graph.nodes[4],
            graph.nodes[5],
        ]
        
        runner.run();
        jest.runOnlyPendingTimers();

        expect( nodesVisited[0].html.classList.contains('visited') ).toBe(true);
        expect( nodesVisited[1].html.classList.contains('visited') ).toBe(true);
        expect( nodesShouldNotVisit[0].html.classList.contains('visited') ).toBe(false);
        expect( nodesShouldNotVisit[1].html.classList.contains('visited') ).toBe(false);
        expect( nodesShouldNotVisit[2].html.classList.contains('visited') ).toBe(false);
    });

    test('run() should visit nodes until target is reached', async () => {
        const nodesVisited = graph.nodes.filter(node => node.id !== TEST_DATA.initialNodeId);

        runner.run();
        jest.runAllTimers();

        nodesVisited.forEach(node => {
            expect( node.html.classList.contains('visited') ).toBe(true);
        })
    });

    test('run() should throw when clickedNodes < 2', async () => {
        graph.nodesClicked.pop();

        expect(() => {
            runner.run();
        }).toThrow();
    });

    test('run() should do nothing when algo is completed', async () => {
        const completedFactory = (): Algorithm => {
            const completedAlgo = algoFactory();
            while (!completedAlgo.isCompleted)
                completedAlgo.step();
            return completedAlgo;
        }
        runner = new AlgoRunner(graph, completedFactory);
        const fistNodesToVisit = [
            graph.nodes[1],
            graph.nodes[3],
        ]
                
        runner.run();

        expect( fistNodesToVisit[0].html.classList.contains('visited') ).toBe(false);
        expect( fistNodesToVisit[1].html.classList.contains('visited') ).toBe(false);
    });

    test('stop() should immediately stop runner from stepping through algo', () => {
        runner.run();
        runner.stop();
        jest.runAllTimers();

        graph.nodes.forEach(node => {
            expect( node.html.classList.contains('visited') ).toBe(false);
            expect( node.html.classList.contains('newlyvisited') ).toBe(false);
            expect( node.html.classList.contains('shortest-path') ).toBe(false);
        });
    });

    test('run() should designate nodes in shortestpath stepping through algorithm', () => {
        const expectedShortestPath = [0, 1, 2, 5, 8];

        runner.run();
        jest.runAllTimers();

        graph.nodes.forEach(node => {
            if (expectedShortestPath.indexOf(node.id) !== -1)
                expect( node.html.classList.contains('shortest-path') ).toBe(true);
            else
                expect( node.html.classList.contains('shortest-path') ).toBe(false);
        })
    });
});
