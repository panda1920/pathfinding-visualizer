import { GridGraph, GraphNode } from './graph';

abstract class Algorithm {
    readonly shortestDistances: number[];
    protected readonly initialNodeId: number;
    protected readonly targetNodeId: number;
    private _isCompleted = false;

    protected constructor(
        protected graph: GridGraph,
    ) {
        if (graph.nodesClicked.length < 2)
            throw 'Graph must have 2 nodes clicked';
        [ this.initialNodeId, this.targetNodeId ] = graph.nodesClicked;
        
        this.shortestDistances = graph.nodes.map(() => Infinity);
        this.shortestDistances[this.initialNodeId] = 0;
    }

    get isCompleted(): boolean {
        return this._isCompleted;
    }

    protected complete(): void {
        this._isCompleted = true;
    }

    abstract step(): void;

    abstract calculateShortestPath(): number[];
}

class DijkstraAlgorithm extends Algorithm {
    private unvisitedNodes: Set<number>;

    constructor(graph: GridGraph) {
        super(graph);

        this.unvisitedNodes = new Set( graph.nodes.map(node => node.id) );
    }

    step(): void {
        const currentNodeId = this.getCurrentNode();
        const newDist = this.shortestDistances[currentNodeId] + 1;
        const attachedNodes = this.graph.nodes[currentNodeId].getAttachedNodes();
        
        attachedNodes.forEach(node => {
            const nodeDist = this.shortestDistances[node.id];
            this.shortestDistances[node.id] = Math.min(newDist, nodeDist);
        });

        this.determineCompletion();
    }
        
    calculateShortestPath(): number[] {
        if (!this.isCompleted)
            return [];

        let currentNodeId = this.targetNodeId;
        const shortestPath = [currentNodeId];
        
        while (currentNodeId !== this.initialNodeId) {
            const nextNodeId = this.calculateNextNodeIdInShortestPath(currentNodeId);
            shortestPath.push(nextNodeId);
            currentNodeId = nextNodeId;
        }

        // keep in mind here that shortestpath arary starts with targetnode, not initial
        return shortestPath;
    }

    private getCurrentNode(): number {
        let minId: number;
        let minDistance = Infinity;
        const isNotVisited = (nodeId: number): boolean => this.unvisitedNodes.has(nodeId);

        this.shortestDistances.forEach((dist, nodeId) => {
            if ( isNotVisited(nodeId) && dist < minDistance ) {
                minId = nodeId;
                minDistance = dist;
            }
        });

        this.unvisitedNodes.delete(minId);
        return minId;
    }

    private determineCompletion(): void {
        if (!this.unvisitedNodes.has(this.targetNodeId))
            this.complete();
    }

    private calculateNextNodeIdInShortestPath(currentNodeId: number): number {
        const neighbors = this.graph.nodes[currentNodeId].getAttachedNodes();
        return this.getShortestDistanceNode(neighbors).id
    }

    private getShortestDistanceNode(nodes: GraphNode[]): GraphNode {
        const distances = nodes.map(node => this.shortestDistances[node.id]);
        
        let minDistance = Infinity;
        let minIdx = -1;
        distances.forEach((distance, idx) => {
            if (distance < minDistance) {
                minDistance = distance;
                minIdx = idx;
            }
        });

        return nodes[minIdx];
    }
}

export { Algorithm, DijkstraAlgorithm };
