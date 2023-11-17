class Node {
    constructor(data, color) {
        this.data = data;
        this.left = null;
        this.right = null;
        this.parent = null;
        this.color = color; // 'R' for red, 'B' for black
    }
}

class RedBlackTree {
    constructor() {
        this.root = null;
        this.NIL = new Node(null, 'B');
    }

    insert(data) {
        let node = new Node(data, 'R');
        if (!this.root) {
            this.root = node;
            this.root.color = 'B';  // Define a cor da raiz como preta
        } else {
            this._insert(this.root, node);
            this.fixInsert(node);
        }
    }

    _insert(root, node) {
        if (node.data < root.data) {
            if (root.left === null) {
                root.left = node;
                node.parent = root;
            } else {
                this._insert(root.left, node);
            }
        } else if (node.data > root.data) {
            if (root.right === null) {
                root.right = node;
                node.parent = root;
            } else {
                this._insert(root.right, node);
            }
        }
    }

    fixInsert(node) {
        while (node.parent && node.parent.color === 'R') {
            if (node.parent === node.parent.parent.left) {
                let uncle = node.parent.parent.right;
                if (uncle && uncle.color === 'R') {
                    console.log(`Troca de cor executada em ${node.parent.parent.data}`);
                    if (node.parent.parent === this.root) {
                        console.log(`Raiz detectada, então permanece preto`);
                    } else {
                        console.log(`Trocou a cor de black para red`);
                    }
                    node.parent.color = 'B';
                    uncle.color = 'B';
                    node.parent.parent.color = 'R';
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.right) {
                        node = node.parent;
                        this.leftRotate(node);
                    }
                    node.parent.color = 'B';
                    node.parent.parent.color = 'R';
                    console.log(`Troca de cor executada em ${node.parent.parent.data}`);
                    console.log(`Trocou a cor de red para black`);
                    this.rightRotate(node.parent.parent);
                }
            } else {
                let uncle = node.parent.parent.left;
                if (uncle && uncle.color === 'R') {
                    node.parent.color = 'B';
                    uncle.color = 'B';
                    node.parent.parent.color = 'R';
                    console.log(`Troca de cor executada em ${node.parent.parent.data}`);
                    console.log(`Trocou a cor de red para black`);
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.left) {
                        node = node.parent;
                        this.rightRotate(node);
                    }
                    node.parent.color = 'B';
                    node.parent.parent.color = 'R';
                    console.log(`Troca de cor executada em ${node.parent.parent.data}`);
                    console.log(`Trocou a cor de red para black`);
                    this.leftRotate(node.parent.parent);
                }
            }
        }
        this.root.color = 'B';
    }

    leftRotate(x) {
        let y = x.right;
        x.right = y.left;
        if (y.left !== this.NIL) {
            y.left.parent = x;
        }
        y.parent = x.parent;
        if (x.parent === null) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        y.left = x;
        x.parent = y;
    }

    rightRotate(y) {
        let x = y.left;
        y.left = x.right;
        if (x.right !== this.NIL) {
            x.right.parent = y;
        }
        x.parent = y.parent;
        if (y.parent === null) {
            this.root = x;
        } else if (y === y.parent.right) {
            y.parent.right = x;
        } else {
            y.parent.left = x;
        }
        x.right = y;
        y.parent = x;
    }

    remove(data) {
        let node = this.search(data);
        if (node) {
            this._remove(node);
        }
    }

    _remove(node) {
        let y = node;
        let yOriginalColor = y ? y.color : 'B';
        let x;

        if (node.left === this.NIL) {
            x = node.right;
            this.transplant(node, node.right);
        } else if (node.right === this.NIL) {
            x = node.left;
            this.transplant(node, node.left);
        } else {
            y = this.minimum(node.right);
            if (y) {
                yOriginalColor = y.color;
                x = y.right;

                if (y.parent === node) {
                    x.parent = y;
                } else {
                    this.transplant(y, y.right);
                    y.right = node.right;
                    y.right.parent = y;
                }

                this.transplant(node, y);
                y.left = node.left;
                y.left.parent = y;
                y.color = node.color;
            } else {
                x = node.left;
                this.transplant(node, node.left);
            }
        }

        if (yOriginalColor === 'B') {
            this.fixRemove(x);
        }
    }

    transplant(u, v) {
        if (u.parent === null) {
            this.root = v;
        } else if (u === u.parent.left) {
            u.parent.left = v;
        } else {
            u.parent.right = v;
        }

        if (v) {
            v.parent = u.parent;
        }
    }

    minimum(node) {
        while (node && node.left !== this.NIL) {
            node = node.left;
        }
        return node;
    }

    search(data) {
        return this._search(this.root, data);
    }

    _search(node, data) {
        if (node === null || data === node.data) {
            return node;
        }

        if (data < node.data) {
            return this._search(node.left, data);
        } else {
            return this._search(node.right, data);
        }
    }

    fixRemove(x) {
        while (x !== this.root && x.color === 'B') {
            if (x === x.parent.left) {
                let w = x.parent.right;
                if (w.color === 'R') {
                    console.log(`Troca de cor executada em ${w.data}`);
                    if (w === this.root) {
                        console.log(`Raiz detectada, então permanece preto`);
                    } else {
                        console.log(`Manteve a cor vermelha (devido à rotação)`);
                    }
                    w.color = 'B';
                    x.parent.color = 'R';
                    this.leftRotate(x.parent);
                    w = x.parent.right;
                } else if (w.right.color === 'B' && w.left.color === 'B') {
                    console.log(`Troca de cor executada em ${w.data}`);
                    console.log(`Manteve a cor preta`);
                    w.color = 'R';
                    x = x.parent;
                } else {
                    if (w.right.color === 'B') {
                        console.log(`Troca de cor executada em ${w.left.data}`);
                        console.log(`Trocou de red para black`);
                        w.left.color = 'B';
                        w.color = 'R';
                        this.rightRotate(w);
                        w = x.parent.right;
                    }
                    console.log(`Troca de cor executada em ${w.data}`);
                    console.log(`Trocou de red para ${x.parent.color}`);
                    w.color = x.parent.color;
                    x.parent.color = 'B';
                    w.right.color = 'B';
                    this.leftRotate(x.parent);
                    x = this.root;
                }
            } else {
                let w = x.parent.left;
                if (w.color === 'R') {
                    console.log(`Troca de cor executada em ${w.data}`);
                    console.log(`Trocou de red para black`);
                    w.color = 'B';
                    x.parent.color = 'R';
                    this.rightRotate(x.parent);
                    w = x.parent.left;
                }
                if (w.right.color === 'B' && w.left.color === 'B') {
                    console.log(`Troca de cor executada em ${w.data}`);
                    console.log(`Trocou de red para black`);
                    w.color = 'R';
                    x = x.parent;
                } else {
                    if (w.left.color === 'B') {
                        console.log(`Troca de cor executada em ${w.right.data}`);
                        console.log(`Trocou de red para black`);
                        w.right.color = 'B';
                        w.color = 'R';
                        this.leftRotate(w);
                        w = x.parent.left;
                    }
                    console.log(`Troca de cor executada em ${w.data}`);
                    console.log(`Trocou de red para ${x.parent.color}`);
                    w.color = x.parent.color;
                    x.parent.color = 'B';
                    w.left.color = 'B';
                    this.rightRotate(x.parent);
                    x = this.root;
                }
            }
        }
        x.color = 'B';
    }

    getRoot() {
        return this.root;
    }

    printTree(node = this.root, level = 0, prefix = 'ROOT') {
        if (node !== null) {
            console.log('  '.repeat(level), `${prefix}(${node.color}) ${node.data}`);
            this.printTree(node.left, level + 1, 'Left');
            this.printTree(node.right, level + 1, 'Right');
        }
    }
}


// Teste

let tree = new RedBlackTree();

// Insere na árvore os elementos {5, 3, 8, 2, 4, 7, 9, 1, 6, 10}
[5, 3, 8, 2, 4, 7, 9, 1, 6, 10].forEach((num) => {
    tree.insert(num);
});

// Imprime a árvore antes das remoções
console.log("Árvore antes da remoção do nó raiz:");
console.log("Raiz:", tree.getRoot().data);
tree.printTree();

// Realiza a remoção do nó raiz (5)
tree.remove(5);

// Imprime a árvore após a remoção do nó raiz
console.log("\nÁrvore após a remoção do nó raiz:");
console.log("Nova Raiz:", tree.getRoot().data);
tree.printTree();

// Realiza a remoção dos nós vermelhos (3, 7, 1, 6)
tree.remove(3);
tree.remove(7);
tree.remove(1);
tree.remove(6);

// Imprime a árvore após a remoção dos nós vermelhos
console.log("\nÁrvore após a remoção dos nós vermelhos:");
console.log("Nova Raiz:", tree.getRoot().data);
tree.printTree();
