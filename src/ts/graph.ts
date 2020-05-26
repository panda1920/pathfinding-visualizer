import { Blocker } from './blocker';

class GraphNode {
    readonly edges: GraphEdge[];
    private _isBlocked = false;
    
    constructor(public readonly id: number) {
        this.edges = [];
    }

    addEdge(edge: GraphEdge): void {
        this.edges.push(edge);
    }

    isAttachedTo(node: GraphNode): boolean {
        if ( this.getAttachedNodes().find(attachedNode => attachedNode.id === node.id) )
            return true;
        else
            return false;
    }

    getAttachedNodes(): GraphNode[] {
        if (this.isBlocked)
            return [];
            
        return this.edges
            .map(edge => edge.nodes.find(node => node.id !== this.id) )
            .filter(node => !node.isBlocked);
    }

    block(): void {
        this._isBlocked = true;
    }

    unblock(): void {
        this._isBlocked = false;
    }

    get isBlocked(): boolean {
        return this._isBlocked;
    }
}

// A class that represents nodes in a grid
// Diffence between a GraphNode is that
// GridNode is aware of the fact that it is part of a grid,
// and that it is going to be represented visually
class GridNode extends GraphNode {
    readonly html: HTMLElement;

    private static readonly NODE_WIDTH = 32;
    private static readonly NODE_HEIGHT = 32;
    private static readonly NEW_EXPIRE_DURATION = 200;
    private static readonly HTML_CLASSES = {
        visited: 'visited',
        newlyVisited: 'newlyvisited',
        clicked: 'clicked',
        shortestPath: 'shortest-path',
        blocked: 'blocked',
    }
    private timerJobId: ReturnType<typeof setTimeout>;

    constructor(
        id: number,
        private readonly gridWidth: number,
        private readonly gridHeight: number,
    ) {
        super(id);

        this.html = this.createHTML();
    }

    private createHTML(): HTMLElement {
        const html = document.createElement('div');
        html.id = `${this.id}`;
        html.className = 'node';
        html.style.width = `${GridNode.NODE_WIDTH}px`;
        html.style.height = `${GridNode.NODE_HEIGHT}px`;
        html.style.borderCollapse = 'collapse';
        html.innerHTML = '';

        return html;
    }

    visited(): void {
        this.html.classList.add(
            GridNode.HTML_CLASSES.visited,
            GridNode.HTML_CLASSES.newlyVisited,
        );

        this.timerJobId = setTimeout(() => {
            this.html.classList.remove(GridNode.HTML_CLASSES.newlyVisited);
        }, GridNode.NEW_EXPIRE_DURATION);
    }

    clicked(): void {
        this.html.classList.toggle(GridNode.HTML_CLASSES.clicked);
    }

    designateShortestPath(): void {
        this.html.classList.add(GridNode.HTML_CLASSES.shortestPath);
    }

    block(): void {
        super.block();
        this.html.classList.add(GridNode.HTML_CLASSES.blocked);
    }

    unblock(): void {
        super.unblock();
        this.html.classList.remove(GridNode.HTML_CLASSES.blocked);
    }

    reset(): void {
        this.cleanup();
        const classNamesToRemove = Object.values(GridNode.HTML_CLASSES)
            .filter(classname => classname !== GridNode.HTML_CLASSES.blocked);

        this.html.classList.remove(...classNamesToRemove);
    }
    
    cleanup(): void {
        clearTimeout(this.timerJobId);
    }
}

class GraphEdge {
    isBlocked: boolean;

    constructor(public readonly nodes: [GraphNode, GraphNode]) {

    }
}

class GridGraph {
    nodes: GridNode[];
    edges: GraphEdge[];
    nodesClicked: number[];
    private runCallback: () => void = null;

    constructor(public width: number, public height: number) {
        this.nodes = [];
        this.edges = [];
        this.nodesClicked = [];

        this.createNodes();
        this.createEdges();
    }

    private createNodes(): void {
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                const nodeId = x + (y * this.width);
                this.nodes.push( new GridNode(nodeId, this.width, this.height) );
            }
        }
    }

    private createEdges(): void {
        const isFirstRow = (node: GraphNode): boolean =>
            node.id < this.width;
        const isFirstCol = (node: GraphNode): boolean =>
            node.id % this.width === 0;

        this.nodes.forEach(node => {
            const connectedTo: GraphNode[] = [];
            if ( !isFirstRow(node) ) {
                const topNode = this.nodes[node.id - this.width];
                connectedTo.push(topNode);
            }
            if ( !isFirstCol(node) ) {
                const leftNode = this.nodes[node.id - 1];
                connectedTo.push(leftNode);
            }

            this.createEdge(node, connectedTo);
        });
    }

    private createEdge(node: GraphNode, connectedTo: GraphNode[]): void {
        connectedTo.forEach(connectedNode => {
            const edge = new GraphEdge([node, connectedNode]);
            node.addEdge(edge);
            connectedNode.addEdge(edge);
            this.edges.push(edge);
        });
    }

    drawGraphOnHtml(html: HTMLElement): void {
        let currentRow: HTMLElement;
        const firstNodeInRow = (nodeIdx: number): boolean => nodeIdx % this.width === 0;
        
        this.nodes.forEach((node, idx) => {
            if (firstNodeInRow(idx)) {
                currentRow && html.appendChild(currentRow);
                currentRow = document.createElement('div');
                currentRow.classList.add('nodes-row');
            }
            currentRow.appendChild( this.addClickHandler( node.html ) );
        });
        html.appendChild(currentRow);
    }

    private addClickHandler(html: HTMLElement): HTMLElement {
        html.addEventListener('click', this.clickHandler);
        return html;
    }

    private clickHandler = (e: Event): void => {
        if (this.nodesClicked.length >= 2)
            return;
        
        const target = e.target as HTMLElement;
        const id = parseInt( target.id );
        const node = this.nodes[id];
        
        if (this.nodesClicked.indexOf(id) === -1 && !node.isBlocked)
            this.nodesClicked.push(id);
        else
            this.nodesClicked = this.nodesClicked.filter(nodeId => nodeId !== id);
        node.clicked();

        if (this.nodesClicked.length == 2)
            this.runCallback && this.runCallback();
    };

    reset(): void {
        this.nodesClicked = [];
        this.nodes.forEach(node => {
            node.cleanup();
            node.reset();
            node.unblock();
        });
    }

    setRunCallback(callback: () => void): void {
        this.runCallback = callback;
    }
}

class BlockedGraph extends GridGraph {
    constructor(width: number, height: number, private blocker: Blocker) {
        super(width, height);

        blocker.block(this);
    }

    reset(): void {
        super.reset();
        this.blocker.block(this);
    }
}

export { GraphNode, GridGraph, BlockedGraph };
