import GridGraph, { GraphNode } from './graph';
import { Algorithm } from './algorithm';

class AlgoRunner {
    private readonly STEP_INTERVAL = 200;
    private currentJobId: any = null;

    constructor(
        private graph: GridGraph,
        private algoFactory: () => Algorithm
    ) {

    }

    run(): void {
        if (this.graph.nodesClicked.length <  2)
            throw 'Must click on 2 nodes';

        const algo = this.algoFactory();
        
        this.stepThroughAlgoRecursivelyWithTimer(algo);
    }

    stop(): void {
        clearTimeout(this.currentJobId);
    }

    private stepThroughAlgoRecursivelyWithTimer(algo: Algorithm): void {
        if (algo.isCompleted) {
            const shortestPath = this.calculateShortestPath(algo);
            this.recursivelyDesignateShortestPathNodes(shortestPath);
            return;
        }

        this.currentJobId = setTimeout(() => {
            this.stepThroughAlgo(algo);
            this.stepThroughAlgoRecursivelyWithTimer(algo);
        }, this.STEP_INTERVAL);
    }

    private recursivelyDesignateShortestPathNodes(shortestPath: number[]): void {
        if (shortestPath.length === 0)
            return;

        this.currentJobId = setTimeout(() => {
            const nodeInPath = this.graph.nodes[ shortestPath.pop() ];
            nodeInPath.designateShortestPath();
            console.log(nodeInPath.id);
            this.recursivelyDesignateShortestPathNodes(shortestPath);
        }, this.STEP_INTERVAL);
    }

    private stepThroughAlgo(algo: Algorithm): void {
        const prevVisited = [...algo.shortestDistances]; // create clone
        algo.step();
        const visited = algo.shortestDistances;

        const isNewlyVisited = (nodeId: number): boolean =>
            prevVisited[nodeId] === Infinity && visited[nodeId] !== Infinity;

        for (let nodeId = 0; nodeId < this.graph.nodes.length; ++nodeId) {
            if (isNewlyVisited(nodeId))
                this.graph.nodes[nodeId].visited();
        }
    }

    private calculateShortestPath(algo: Algorithm): number[] {
        const initialNodeId = this.graph.nodesClicked[0];
        let currentNodeId = this.graph.nodesClicked[1];
        const shortestPath = [currentNodeId];
        
        while (currentNodeId !== initialNodeId) {
            const neighbors = this.graph.nodes[currentNodeId].getAttachedNodes();
            const idx = this.getIndexOfMinimumDistance(neighbors, algo);
            const neighborOnShortestPath = neighbors[idx];

            shortestPath.push(neighborOnShortestPath.id);
            currentNodeId = neighborOnShortestPath.id;
        }

        // keep in mind here that shortestpath arary starts with targetnode, not initial
        return shortestPath;
    }

    private getIndexOfMinimumDistance(nodes: GraphNode[], algo: Algorithm): number {
        const distances = nodes.map(node => algo.shortestDistances[node.id]);
        
        let minDistance = Infinity;
        let minIdx = -1;
        distances.forEach((distance, idx) => {
            if (distance < minDistance) {
                minDistance = distance;
                minIdx = idx;
            }
        });

        return minIdx;
    }
}

export default AlgoRunner;
