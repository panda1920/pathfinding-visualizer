class GraphNode {
    readonly edges: GraphEdge[];
    
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
        return this.edges.map(edge => {
            return edge.nodes.filter(node => node.id !== this.id)[0];
        });
    }
}

// A class that represents nodes in a grid
// Diffence between a GraphNode is that
// GridNode is aware of the fact that it is part of a grid,
// and that it is going to be represented visually
class GridNode extends GraphNode {
    readonly html: HTMLElement;
    private readonly width = 32;
    private readonly height = 32;

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
        html.style.display = 'inline-block';
        html.style.width = `${this.width}px`;
        html.style.height = `${this.height}px`;
        html.style.border = `1px solid black`;
        html.style.borderCollapse = 'collapse';
        html.innerHTML = this.id.toString();

        return html;
    }

    visited(): void {
        const visitedClassname = 'visited';
        this.html.classList.add(visitedClassname);
    }

    clicked(): void {
        const clickedClassname = 'clicked';
        this.html.classList.toggle(clickedClassname);
    }

    reset(): void {
        const visitedClassname = 'visited';
        const clickedClassname = 'clicked';

        this.html.classList.remove(visitedClassname, clickedClassname);
    }
}

class GraphEdge {
    isBlocked: boolean;

    constructor(public readonly nodes: [GraphNode, GraphNode]) {

    }
}

class GridGraph {
    width: number;
    height: number;
    nodes: GridNode[];
    edges: GraphEdge[];
    nodesClicked: number[];
    private runCallback: () => void = null;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
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
        this.nodes.forEach((node, idx) => {
            if (idx % this.width === 0 && idx !== 0) {
                html.appendChild( document.createElement('br') );
            }
            html.appendChild( this.addClickHandler( node.html ) );
        });
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
        
        if (this.nodesClicked.indexOf(id) === -1)
            this.nodesClicked.push(id);
        else
            this.nodesClicked = this.nodesClicked.filter(nodeId => nodeId !== id);
        node.clicked();

        if (this.nodesClicked.length == 2)
            this.runCallback && this.runCallback();
    }

    reset(): void {
        this.nodesClicked = [];
        this.nodes.forEach(node => {
            node.reset();
        });
    }

    setRunCallback(callback: () => void): void {
        this.runCallback = callback;
    }
}

export default GridGraph;
