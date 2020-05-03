import GridGraph from '../ts/graph';
import { RandomBlocker } from '../ts/blocker';

describe('testing behavior of random blocker', () => {
    let graph: GridGraph = null;
    let blocker: RandomBlocker = null;
    const TEST_DATA = {
        graphHeight: 5,
        graphWidth: 5,
        blockerPercentage: 20,
    }
    
    beforeEach(() => {
        graph = new GridGraph(TEST_DATA.graphWidth, TEST_DATA.graphHeight);
        blocker = new RandomBlocker(TEST_DATA.blockerPercentage);
    });

    test('construction should throw when percentage is bigger than 100', () => {
        const percentagesToThrow = [101, 2000];

        percentagesToThrow.forEach(percentage => {
            expect(() => {
                blocker = new RandomBlocker(percentage);
            }).toThrow();
        });
    });

    test('construction should throw when percentage is lower than 0', () => {
        const percentagesToThrow = [-1, -1000];

        percentagesToThrow.forEach(percentage => {
            expect(() => {
                blocker = new RandomBlocker(percentage);
            }).toThrow();
        });
    });

    test('blocker should block 5 nodes if 20%', () => {
        blocker.block(graph);

        let blockCount = 0;
        graph.nodes.forEach(node => {
            if ( node.html.classList.contains('blocked') )
                blockCount++;
        })

        expect(blockCount).toBe(5);
    });

    test('blocker should block 10 nodes if 40%', () => {
        blocker = new RandomBlocker(40);

        blocker.block(graph);

        let blockCount = 0;
        graph.nodes.forEach(node => {
            if ( node.html.classList.contains('blocked') )
                blockCount++;
        })

        expect(blockCount).toBe(10);
    });
});
