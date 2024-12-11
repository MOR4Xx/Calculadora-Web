/* Codigo baseado no meu prijeto de estrutura de dados 1, de transformar infixa em posfixa disponivel no meu github.
*
* Foram feitas algumas modificações para que funcionasse com o html
*
* https://github.com/MOR4Xx/InfixToPostfix
*/

class PilhaDeOperadores {
  constructor() {
    this.elementos = [];
  }

  estaVazia() {
    return this.elementos.length === 0;
  }

  empilhar(elemento) {
    this.elementos.push(elemento);
  }

  desempilhar() {
    return this.elementos.pop();
  }

  espiar() {
    return this.elementos[this.elementos.length - 1];
  }
}

class PilhaDeNumeros {
  constructor() {
    this.elementos = [];
  }

  empilhar(elemento) {
    this.elementos.push(elemento);
  }

  desempilhar() {
    return this.elementos.pop();
  }
}

function obterPrecedencia(operador) {
  switch (operador) {
    case '+':
    case '-':
      return 1;
    case '*':
    case '/':
      return 2;
    case '(':
      return 0;
    default:
      return -1;
  }
}

function converterParaPosfixa(expressaoInfixa) {
  let expressaoPosfixa = [];
  let pilhaDeOperadores = new PilhaDeOperadores();
  let numeroAtual = '';

  for (let char of expressaoInfixa) {
    if (!isNaN(char) || char === '.') {
      numeroAtual += char;
    } else {
      if (numeroAtual) {
        expressaoPosfixa.push(numeroAtual);
        numeroAtual = '';
      }

      if (char === '(') {
        pilhaDeOperadores.empilhar(char);
      } else if (char === ')') {
        while (!pilhaDeOperadores.estaVazia() && pilhaDeOperadores.espiar() !== '(') {
          expressaoPosfixa.push(pilhaDeOperadores.desempilhar());
        }
        pilhaDeOperadores.desempilhar();
      } else {
        while (
          !pilhaDeOperadores.estaVazia() &&
          obterPrecedencia(char) <= obterPrecedencia(pilhaDeOperadores.espiar())
          ) {
          expressaoPosfixa.push(pilhaDeOperadores.desempilhar());
        }
        pilhaDeOperadores.empilhar(char);
      }
    }
  }

  if (numeroAtual) {
    expressaoPosfixa.push(numeroAtual);
  }

  while (!pilhaDeOperadores.estaVazia()) {
    expressaoPosfixa.push(pilhaDeOperadores.desempilhar());
  }

  return expressaoPosfixa.join(' ');
}

function avaliarPosfixa(expressaoPosfixa) {
  let pilhaDeNumeros = new PilhaDeNumeros();
  let tokens = expressaoPosfixa.split(' ');

  for (let token of tokens) {
    if (!isNaN(token)) {
      pilhaDeNumeros.empilhar(Number(token));
    } else {
      let valor2 = pilhaDeNumeros.desempilhar();
      let valor1 = pilhaDeNumeros.desempilhar();

      switch (token) {
        case '+':
          pilhaDeNumeros.empilhar(valor1 + valor2);
          break;
        case '-':
          pilhaDeNumeros.empilhar(valor1 - valor2);
          break;
        case '*':
          pilhaDeNumeros.empilhar(valor1 * valor2);
          break;
        case '/':
          pilhaDeNumeros.empilhar(valor1 / valor2);
          break;
      }
    }
  }

  return pilhaDeNumeros.desempilhar();
}

let parentesesUsado = false;

const resultado = document.getElementById('resultado');
let expressao = '';

function atualizarDisplay() {
  const displayFormatado = expressao
    .replace(/\*/g, 'x')
    .replace(/\//g, '÷')
    .replace(/\./g, ',');
  resultado.value = displayFormatado;

  resultado.scrollLeft = resultado.scrollWidth;
}

document.getElementById('buttons').addEventListener('click', (e) => {
  const target = e.target;

  if (target.classList.contains('numeros')) {
    expressao += target.dataset.number;
  } else if (target.classList.contains('operadores')) {
    expressao += target.dataset.operation;
  } else if (target.classList.contains('parenteses')) {
    expressao += parentesesUsado ? ')' : '(';
    parentesesUsado = !parentesesUsado;
  } else if (target.classList.contains('clear')) {
    expressao = '';
    parentesesUsado = false;
  } else if (target.classList.contains('igual')) {
    try {
      const expressaoComPontos = expressao.replace(/,/g, '.');
      const posfixa = converterParaPosfixa(expressaoComPontos);
      const resultadoCalculado = avaliarPosfixa(posfixa);
      expressao = resultadoCalculado.toString().replace(/\./g, ',');
    } catch (error) {
      expressao = 'Erro';
    }
  } else if (target.classList.contains('decimal')) {
    if (!expressao.endsWith(',')) {
      expressao += ',';
    }
  }

  atualizarDisplay();
});
