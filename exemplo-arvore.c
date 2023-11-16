#include <stdio.h>
#include <stdlib.h>

typedef struct no{
    int dado;
    int cor;// 0 = black 1 = red
    struct no* pai;
    struct no* esq;
    struct no* dir;
}; No;

void trocaCor(struct no* k){
    printf("Troca de cor executada");
    printf("Trocou de %s para %s",(k->cor == 0) ? "black" : "red");
    k->cor = !k->cor;

    if (k->esq != NULL)
    {
        k->esq->cor = !k->esq->cor;
    }

    if (k->dir != NULL)
    {
        k->dir->cor = !k->dir->cor;
    }
}

void criaArvore(int n, int* n){
    for (size_t i = 0; i < n; i++)
    {
        struct no* aux = (struct no*) malloc(sizeof(struct no));
        aux -> cor = 1;//red
        aux -> pai = NULL;
        aux -> esq = NULL;
        aux -> dir = NULL;
        aux -> n[i];
        insereNo(raiz, aux);
    }
}

int buscaVermelho (raiz){

};

int main(){
    int n  = 6;
    int valores[n] = {7,6,3,5,8,1};

    criaArvore(n,valores);
    executaTeste01(raiz);
    limpaArvore(raiz);
};