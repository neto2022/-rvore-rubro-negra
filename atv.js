class Node {
    // Definição da classe Node que representa um nó da árvore
    constructor(data, color) {
        this.data = data;         // Valor do nó
        this.left = null;         // Referência para o filho esquerdo
        this.right = null;        // Referência para o filho direito
        this.parent = null;       // Referência para o pai
        this.color = color;       // Cor do nó ('R' para vermelho, 'B' para preto)
    }
}

class RedBlackTree {
    // Definição da classe RedBlackTree que representa uma árvore Rubro-Negra
    constructor() {
        this.root = null;         // Raiz da árvore
        this.NIL = new Node(null, 'B');  // Nó nulo, utilizado como folha e com cor preta
        this.NIL.left = null;
        this.NIL.right = null;
        this.NIL.parent = null;
    }

    insert(data) {
        // Inserção de um novo valor na árvore
        let node = new Node(data, 'R');  // Novo nó a ser inserido é inicialmente vermelho
        if (!this.root) {
            this.root = node;           // Se a árvore estiver vazia, o novo nó torna-se a raiz
            this.root.color = 'B';      // A raiz é sempre preta
        } else {
            this._insert(this.root, node);  // Chamada à função de inserção recursiva
            this.fixInsert(node);           // Ajusta a árvore após a inserção
        }
    }

    _insert(root, node) {
        // Função auxiliar para a inserção recursiva de um nó na árvore
        if (node.data < root.data) {
            // Se o valor a ser inserido é menor que o valor do nó atual, vai para a subárvore esquerda
            if (root.left === null) {
                root.left = node;      // Se não há filho esquerdo, insere o novo nó aqui
                node.parent = root;
            } else {
                this._insert(root.left, node);  // Caso contrário, continua a busca na subárvore esquerda
            }
        } else if (node.data > root.data) {
            // Se o valor a ser inserido é maior que o valor do nó atual, vai para a subárvore direita
            if (root.right === null) {
                root.right = node;     // Se não há filho direito, insere o novo nó aqui
                node.parent = root;
            } else {
                this._insert(root.right, node); // Caso contrário, continua a busca na subárvore direita
            }
        }
    }

    fixInsert(node) {
        // Ajusta a árvore após a inserção de um nó vermelho
        while (node.parent && node.parent.color === 'R') {
            if (node.parent === node.parent.parent.left) {
                // O pai do nó é o filho esquerdo de seu avô
                let uncle = node.parent.parent.right;  // Tio é o irmão do pai do nó
                if (uncle && uncle.color === 'R') {
                    // Caso 1: O tio é vermelho
                    node.parent.color = 'B';
                    uncle.color = 'B';
                    node.parent.parent.color = 'R';
                    node = node.parent.parent;
                } else {
                    // Caso 2: O tio é preto
                    if (node === node.parent.right) {
                        node = node.parent;
                        this.leftRotate(node);
                    }
                    node.parent.color = 'B';
                    node.parent.parent.color = 'R';
                    this.rightRotate(node.parent.parent);
                }
            } else {
                // O pai do nó é o filho direito de seu avô
                let uncle = node.parent.parent.left;  // Tio é o irmão do pai do nó
                if (uncle && uncle.color === 'R') {
                    // Caso 1: O tio é vermelho
                    node.parent.color = 'B';
                    uncle.color = 'B';
                    node.parent.parent.color = 'R';
                    node = node.parent.parent;
                } else {
                    // Caso 2: O tio é preto
                    if (node === node.parent.left) {
                        node = node.parent;
                        this.rightRotate(node);
                    }
                    node.parent.color = 'B';
                    node.parent.parent.color = 'R';
                    this.leftRotate(node.parent.parent);
                }
            }
        }
        this.root.color = 'B';
    }

    leftRotate(x) {
        // Rotação à esquerda
        let y = x.right;
        x.right = y.left;
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
        // Rotação à direita
        let x = y.left;
        y.left = x.right;
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
        // Remove um nó com o valor fornecido da árvore
        let node = this.search(data);
        if (node) {
            console.log(`Realizando a remoção do nó com valor ${data}`);
            this._remove(node);
        }
    }

    _remove(node) {
        // Função auxiliar para remoção de um nó da árvore
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
            console.log(`  - Nó removido era preto, ajustando a árvore`);
            this.fixRemove(x);
        }
    }

    transplant(u, v) {
        // Substitui a subárvore enraizada em u pela subárvore enraizada em v
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
        // Encontra o nó com valor mínimo a partir de um determinado nó
        while (node && node.left !== this.NIL) {
            node = node.left;
        }
        return node;
    }

    search(data) {
        // Busca um valor na árvore
        return this._search(this.root, data);
    }

    _search(node, data) {
        // Função auxiliar para a busca recursiva de um valor na árvore
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
        // Ajusta a árvore após a remoção de um nó preto
        while (x !== this.root && x.color === 'B') {
            if (x === x.parent.left) {
                let w = x.parent.right;
                if (w.color === 'R') {
                    // Caso 1: O irmão (w) é vermelho
                    w.color = 'B';
                    x.parent.color = 'R';
                    this.leftRotate(x.parent);
                    w = x.parent.right;
                } else if (w.right.color === 'B' && w.left.color === 'B') {
                    // Caso 2: O irmão (w) é preto e ambos os filhos são pretos
                    w.color = 'R';
                    x = x.parent;
                } else {
                    if (w.right.color === 'B') {
                        // Caso 3: O irmão (w) é preto e o filho direito é preto
                        w.left.color = 'B';
                        w.color = 'R';
                        this.rightRotate(w);
                        w = x.parent.right;
                    }
                    // Caso 4: O irmão (w) é preto e o filho direito é vermelho
                    w.color = x.parent.color;
                    x.parent.color = 'B';
                    w.right.color = 'B';
                    this.leftRotate(x.parent);
                    x = this.root;
                }
            } else {
                let w = x.parent.left;
                if (w.color === 'R') {
                    // Caso 1: O irmão (w) é vermelho
                    w.color = 'B';
                    x.parent.color = 'R';
                    this.rightRotate(x.parent);
                    w = x.parent.left;
                }
                if (w.right.color === 'B' && w.left.color === 'B') {
                    // Caso 2: O irmão (w) é preto e ambos os filhos são pretos
                    w.color = 'R';
                    x = x.parent;
                } else {
                    if (w.left.color === 'B') {
                        // Caso 3: O irmão (w) é preto e o filho esquerdo é preto
                        w.right.color = 'B';
                        w.color = 'R';
                        this.leftRotate(w);
                        w = x.parent.left;
                    }
                    // Caso 4: O irmão (w) é preto e o filho esquerdo é vermelho
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
        // Retorna a raiz da árvore
        return this.root;
    }

    printTree(node = this.root, level = 0, prefix = 'ROOT') {
        // Imprime a árvore de forma visual
        if (node !== null) {
            console.log('  '.repeat(level), `${prefix}(${node.color}) ${node.data}`);
            this.printTree(node.left, level + 1, 'Left');
            this.printTree(node.right, level + 1, 'Right');
        }
    }

    removeRedNodesRandomly() {
        // Remove nós vermelhos aleatoriamente da árvore
        console.log("\nRemovendo nós vermelhos aleatoriamente:");
    
        const redNodes = this.findRedNodes(this.root);
    
        if (redNodes.length > 0) {
            const randomIndex = Math.floor(Math.random() * redNodes.length);
            const randomRedNode = redNodes[randomIndex];
    
            console.log(`\nRemovendo nó vermelho aleatório com valor ${randomRedNode.data}`);
            console.log(`Operações realizadas:`);
            this.remove(randomRedNode.data);
            this.printTree();
        } else {
            console.log("Não há nós vermelhos para remover.");
        }
    }

    findRedNodes(node, redNodes = []) {
        // Encontra todos os nós vermelhos na árvore
        if (node !== null && node !== this.NIL) {
            if (node.color === 'R') {
                redNodes.push(node);
            }
            this.findRedNodes(node.left, redNodes);
            this.findRedNodes(node.right, redNodes);
        }
        return redNodes;
    }

    removeRoot() {
        // Remove a raiz da árvore
        if (this.root) {
            console.log(`Removendo a raiz com valor ${this.root.data}`);
            this._remove(this.root);

            // Define uma nova raiz (sucessor da raiz removida)
            if (this.root !== null) {
                while (this.root.parent !== null) {
                    this.root = this.root.parent;
                }
                this.root.color = 'B'; // Garante que a nova raiz seja preta
            }
        } else {
            console.log("A árvore está vazia. Não há raiz para remover.");
        }
    }
    
    clearTree(node) {
        // Limpa a árvore inteira
        if (node !== null && node !== this.NIL) {
            this.clearTree(node.left);
            this.clearTree(node.right);

            // Verifica se 'node' não é nulo antes de acessar suas propriedades
            if (node.parent !== null) {
                if (node === node.parent.left) {
                    node.parent.left = null;
                } else {
                    node.parent.right = null;
                }
            } else {
                // 'node' é a raiz
                this.root = null;
            }
        }
    }
}

let arr1 = [];
let arr2 = [];

// Função para gerar um número aleatório sem repetição
function generateUniqueRandomNumber(usedNumbers) {
    let randomNumber;
    do {
        randomNumber = Number((Math.random() * 10).toFixed(0));
    } while (usedNumbers.includes(randomNumber));
    return randomNumber;
}

// Preencher arr1
for (let i = 0; i < 10; i++) {
    arr1[i] = generateUniqueRandomNumber(arr1);
}

// Preencher arr2
for (let i = 0; i < 10; i++) {
    arr2[i] = generateUniqueRandomNumber(arr2);
}

// Teste

let tree = new RedBlackTree();

// Insere na árvore os elementos aleatóriamente, mas sem repetir
arr2.forEach((num) => {
    tree.insert(num);
});


// Imprime a árvore antes das remoções
console.log("Árvore antes da remoção do nó raiz:");
console.log("Raiz:", tree.getRoot().data);
tree.printTree();

// Imprime a árvore após a remoção do nó raiz
tree.removeRoot();
console.log("\nÁrvore após a remoção do nó raiz:");
console.log("Raiz:", tree.getRoot().data);
tree.printTree();


// Imprime a árvore antes da remoção dos nós vermelhos
console.log("Árvore antes da remoção dos nós vermelhos:");
console.log("Raiz:", tree.getRoot().data);
tree.printTree();

// Realiza a remoção dos nós vermelhos automaticamente
tree.removeRedNodesRandomly();

// Limpa a árvore inteira
tree.clearTree(tree.getRoot());

// Imprimir a árvore depois de limpar
console.log("\nÁrvore após limpar a árvore:");
console.log("Raiz:", tree.getRoot() ? tree.getRoot().data : "Árvore vazia");
tree.printTree();