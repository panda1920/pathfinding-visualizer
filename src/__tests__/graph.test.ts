import GridGraph from '../ts/graph';

describe('testing behavior of GridGraph', () => {
    let graph: GridGraph|null = null;
    const TEST_DATA = {
        width: 4,
        height: 3,
    };

    beforeEach(() => {
        graph = new GridGraph(TEST_DATA.width, TEST_DATA.height);
    });
    afterEach(() => {
        graph = null;
    });

    test('gridgraph should creates 12 nodes', () => {
        expect((graph as GridGraph).nodes).toHaveLength(12);
    });

    test('nodes on corners should have 2 edges', () => {
        const nodeIdsOnCorers = [0, 3, 8, 11];
        nodeIdsOnCorers.forEach(id => {
            const node = graph.nodes[id];
            
            expect(node.edges).toHaveLength(2);
        });
    });

    test('nodes on edge should have 3 edges', () => {
        const nodeIdsOnEdge = [1, 7, 10, 4];
        nodeIdsOnEdge.forEach(id => {
            const node = graph.nodes[id];
            
            expect(node.edges).toHaveLength(3);
        });
    });

    test('nodes in middle should have 4 edges', () => {
        const nodeIdsInMiddle = [5, 6];
        nodeIdsInMiddle.forEach(id => {
            const node = graph.nodes[id];

            expect(node.edges).toHaveLength(4);
        });
    });

    test('checking readonly', () => {
        // const nodeEdges = graph.nodes[0].edges;
    });
});
