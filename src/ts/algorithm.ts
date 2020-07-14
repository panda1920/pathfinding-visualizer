import TinyQueue from 'tinyqueue';

import { GridGraph, GraphNode, GridNode } from './graph';

abstract class Algorithm {
    readonly shortestDistances: number[];
    protected readonly initialNodeId: number;
    protected readonly targetNodeId: number;
    private _isCompleted = false;

    protected constructor(
        protected graph: GridGraph,
    ) {
        if (graph.nodeIdsClicked.length < 2)
            throw 'Graph must have 2 nodes clicked';
        [ this.initialNodeId, this.targetNodeId ] = graph.nodeIdsClicked;
        
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
    private unvisitedNodeIds: Set<number>;

    constructor(graph: GridGraph) {
        super(graph);

        this.unvisitedNodeIds = new Set( graph.nodes.map(node => node.id) );
    }

    step(): void {
        const currentNodeId = this.getNextNodeToTravel().id;
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

    private getNextNodeToTravel(): GraphNode {
        let minDistance = Infinity;
        let nodeWithMinDistance: GraphNode;
        const isNotVisited = (nodeId: number): boolean => this.unvisitedNodeIds.has(nodeId);

        this.shortestDistances.forEach((dist, nodeId) => {
            if ( isNotVisited(nodeId) && dist < minDistance ) {
                minDistance = dist;
                nodeWithMinDistance = this.graph.nodes[nodeId];
            }
        });

        this.unvisitedNodeIds.delete(nodeWithMinDistance.id);
        return nodeWithMinDistance;
    }

    private determineCompletion(): void {
        if (!this.unvisitedNodeIds.has(this.targetNodeId))
            this.complete();
    }

    private calculateNextNodeIdInShortestPath(currentNodeId: number): number {
        const neighbors = this.graph.nodes[currentNodeId].getAttachedNodes();
        return this.getShortestDistanceNode(neighbors).id;
    }

    private getShortestDistanceNode(nodes: GraphNode[]): GraphNode {
        const distances = nodes.map(node => this.shortestDistances[node.id]);
        let minDistance = Infinity;
        let minNodeId: number;

        distances.forEach((estimatedDistance, nodeId) => {
            if (estimatedDistance < minDistance) {
                minDistance = estimatedDistance;
                minNodeId = nodeId;
            }
        });

        return nodes[minNodeId];
    }
}

class AstarAlgorithm extends Algorithm {
    private nodeToVisit: TinyQueue<{ node: GridNode; estimatedDistance: number }>;
    private previousShortestNode: number[]; // used to trace back nodes for shortest path

    constructor(graph: GridGraph) {
        super(graph);

        this.previousShortestNode = graph.nodes.map(() => -1);
        this.nodeToVisit = new TinyQueue([], (a, b) => a.estimatedDistance - b.estimatedDistance);
        this.enqueNodeIdToVisit(this.initialNodeId);
    }

    step(): void {
        const currentNode = this.nodeToVisit.pop().node;
        if (currentNode.id === this.targetNodeId)
            return this.complete();

        const neighbors = currentNode.getAttachedNodes();

        for (const neighbor of neighbors) {
            const distanceToNeighbor = this.shortestDistances[currentNode.id] + 1;
            if (distanceToNeighbor >= this.shortestDistances[neighbor.id])
                continue;
            
            this.shortestDistances[neighbor.id] = distanceToNeighbor;
            this.previousShortestNode[neighbor.id] = currentNode.id;
            this.enqueNodeIdToVisit(neighbor.id);
        }
    }

    calculateShortestPath(): number[] {
        const shortestPath: number[] = [];
        if (!this.isCompleted)
            return shortestPath;

        let currentNodeId = this.targetNodeId;
        
        while (true) {
            shortestPath.push(currentNodeId);
            if (currentNodeId === this.initialNodeId)
                break;
            currentNodeId = this.previousShortestNode[currentNodeId];
        }

        return shortestPath;
    }


    private enqueNodeIdToVisit(nodeId: number): void {
        const estimatedDistance = this.estimateShortestDistanceToTarget(nodeId) +
            this.shortestDistances[nodeId];
        this.nodeToVisit.push({
            node: this.graph.nodes[nodeId],
            estimatedDistance: estimatedDistance
        });
    }

    private estimateShortestDistanceToTarget(nodeId: number): number {
        const node = this.graph.nodes[nodeId];
        const targetNode = this.graph.nodes[this.targetNodeId];

        const shortestDistanceBetween = Math.abs(node.x - targetNode.x)
            + Math.abs(node.y - targetNode.y);
        return shortestDistanceBetween;
    }
}

export { Algorithm, DijkstraAlgorithm, AstarAlgorithm };
