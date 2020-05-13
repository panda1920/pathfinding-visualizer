import { Blocker } from '../ts/blocker';
import { GridGraph, BlockedGraph }  from '../ts/graph';

const mockBlock = jest.fn().mockName('Mocked block() method of Blocker');
const mockBlocker = jest.fn<Blocker, []>(() => {
    return { block: mockBlock };
});

describe('testing behavior of GridGraph without blockers', () => {
    let graph: GridGraph|null = null;
    const TEST_DATA = {
        width: 4,
        height: 3,
    };
    const renderHTML = (): void => {
        const html = document.createElement('div');
        html.classList.add('graph');
        graph.drawGraphOnHtml(html);
        window.document.body.appendChild(html);
    };
    const clearHTML = (): void => {
        window.document.body.innerHTML = '';
    }

    beforeEach(() => {
        graph = new GridGraph(TEST_DATA.width, TEST_DATA.height);
        renderHTML();
    });

    afterEach(() => {
        graph = null;
        clearHTML();
    });

    test('gridgraph should create 12 nodes', () => {
        expect((graph as GridGraph).nodes).toHaveLength(12);
    });

    test('nodes on corners should have 2 edges', () => {
        const nodeIdsOnCorers = [0, 3, 8, 11];
        nodeIdsOnCorers.forEach(id => {
            const node = graph.nodes[id];
            
            expect(node.edges).toHaveLength(2);
            expect(node.getAttachedNodes()).toHaveLength(2);
        });
    });

    test('nodes on edge should have 3 edges', () => {
        const nodeIdsOnEdge = [1, 7, 10, 4];
        nodeIdsOnEdge.forEach(id => {
            const node = graph.nodes[id];
            
            expect(node.edges).toHaveLength(3);
            expect(node.getAttachedNodes()).toHaveLength(3);
        });
    });

    test('nodes in middle should have 4 edges', () => {
        const nodeIdsInMiddle = [5, 6];
        nodeIdsInMiddle.forEach(id => {
            const node = graph.nodes[id];

            expect(node.edges).toHaveLength(4);
            expect(node.getAttachedNodes()).toHaveLength(4);
        });
    });

    test('clicking on a node should apply clicked class on node', () => {
        const node = graph.nodes[0];

        node.html.click();

        expect( node.html.classList.contains('clicked') ).toBe(true);
    });

    test('clicking on a node should push its id in clicked list', () => {
        const node = graph.nodes[0];

        node.html.click();

        expect(graph.nodesClicked).toContain(node.id);
    });

    test('should only be able to click up to 2 nodes', () => {
        const [node1, node2, node3, ..._ ] = graph.nodes;

        node1.html.click();
        node2.html.click();
        node3.html.click();

        expect(graph.nodesClicked).toHaveLength(2);
        expect(graph.nodesClicked).toContain(node1.id);
        expect(graph.nodesClicked).toContain(node2.id);
        expect(graph.nodesClicked).not.toContain(node3.id);
        expect(node3.html.classList.contains('clicked')).toBe(false);
    });

    test('clicking on same node should undo change', () => {
        const node = graph.nodes[0];

        node.html.click();
        node.html.click();

        expect(graph.nodesClicked).toHaveLength(0);
        expect(node.html.classList.contains('clicked')).toBe(false);
    });

    test('clicking on same node after having clicked 2 nodes should not undo', () => {
        const [node1, node2, ..._ ] = graph.nodes;

        node1.html.click();
        node2.html.click();
        node2.html.click();

        expect(graph.nodesClicked).toHaveLength(2);
        expect(graph.nodesClicked).toContain(node1.id);
        expect(graph.nodesClicked).toContain(node2.id);
        expect(node1.html.classList.contains('clicked')).toBe(true);
        expect(node2.html.classList.contains('clicked')).toBe(true);
    });

    test('clicking on 2 nodes should trigger run callback', () => {
        const mockCallback = jest.fn().mockName('Mocked callback');
        graph.setRunCallback(mockCallback);
        const [node1, node2, ..._ ] = graph.nodes;

        node1.html.click();

        expect(mockCallback).toHaveBeenCalledTimes(0);

        node2.html.click();

        expect(mockCallback).toHaveBeenCalledTimes(1);
    })
});

describe('testing behavior of GridGraph with blockers', () => {
    let graph: GridGraph = null;
    const TEST_DATA = {
        width: 4,
        height: 3,
        blockedNodes: [4, 5, ],
    };
    const renderHTML = (): void => {
        const html = document.createElement('div');
        html.classList.add('graph');
        graph.drawGraphOnHtml(html);
        window.document.body.appendChild(html);
    };
    const clearHTML = (): void => {
        window.document.body.innerHTML = '';
    }

    beforeEach(() => {
        graph = new GridGraph(TEST_DATA.width, TEST_DATA.height);
        TEST_DATA.blockedNodes.forEach(nodeId => {
            graph.nodes[nodeId].block();
        })
        renderHTML();
    });

    afterEach(() => {
        graph = null;
        clearHTML();
    });

    test('blocked nodes should have no attached nodes', () => {
        TEST_DATA.blockedNodes.forEach(nodeId => {
            const node = graph.nodes[nodeId];

            expect(node.getAttachedNodes()).toHaveLength(0);
        });
    });

    test('blocked nodes should be appiled blocked class', () => {
        TEST_DATA.blockedNodes.forEach(nodeId => {
            const node = graph.nodes[nodeId];

            expect( node.html.classList.contains('blocked') ).toBe(true);
        });
    });

    test('corner nodes adjacent to blocked node should have -1 non-blocked edges', () => {
        const nodeIds = [0, 8];
        nodeIds.forEach(nodeId => {
            const node = graph.nodes[nodeId];

            expect(node.edges).toHaveLength(2);
            expect(node.getAttachedNodes()).toHaveLength(1);
        });
    });

    test('edge nodes adjacent to blocked node should have -1 non-blocked edges', () => {
        const nodeIds = [1, 9];
        nodeIds.forEach(nodeId => {
            const node = graph.nodes[nodeId];

            expect(node.edges).toHaveLength(3);
            expect(node.getAttachedNodes()).toHaveLength(2);
        });
    });

    test('middle nodes adjacent to blocked node should have -1 non-blocked edges', () => {
        const nodeIds = [6];
        nodeIds.forEach(nodeId => {
            const node = graph.nodes[nodeId];

            expect(node.edges).toHaveLength(4);
            expect(node.getAttachedNodes()).toHaveLength(3);
        });
    });
});

describe('testing behavior of BlockedGraph', () => {
    let graph: BlockedGraph;
    let mockedBlocker: Blocker;
    const TEST_DATA = {
        width: 4,
        height: 3,
    };

    beforeEach(() => {
        mockedBlocker = new mockBlocker();
        graph = new BlockedGraph(TEST_DATA.width, TEST_DATA.height, mockedBlocker);
    });

    test('constructor should call block on blocker', () => {
        expect(mockBlock).toHaveBeenCalledTimes(1);
    });
});
