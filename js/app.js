/*
 * Código baseado no meu projeto de Estrutura de Dados 1, que transforma expressões infixas em pós-fixas.
 * Foram feitas algumas modificações para que funcionasse com HTML.
 * Repositório original: https://github.com/MOR4Xx/InfixToPostfix
 */

// Classe para representar uma pilha que armazena operadores matemáticos
class PilhaDeOperadores {
  constructor() {
    this.elementos = []; // Array para armazenar os elementos da pilha
  }

  estaVazia() {
    return this.elementos.length === 0; // Retorna true se a pilha estiver vazia
  }

  empilhar(elemento) {
    this.elementos.push(elemento); // Adiciona um elemento no topo da pilha
  }

  desempilhar() {
    return this.elementos.pop(); // Remove e retorna o elemento do topo da pilha
  }

  espiar() {
    return this.elementos[this.elementos.length - 1]; // Retorna o elemento do topo sem removê-lo
  }
}

// Classe para representar uma pilha que armazena números
class PilhaDeNumeros {
  constructor() {
    this.elementos = []; // Array para armazenar os elementos da pilha
  }

  empilhar(elemento) {
    this.elementos.push(elemento); // Adiciona um número no topo da pilha
  }

  desempilhar() {
    return this.elementos.pop(); // Remove e retorna o número do topo da pilha
  }
}

// Função para obter a precedência de operadores matemáticos
function obterPrecedencia(operador) {
  switch (operador) {
    case '+':
    case '-':
      return 1; // Precedência mais baixa
    case '*':
    case '/':
      return 2; // Precedência mais alta
    case '(':
      return 0; // Parênteses abertos têm menor precedência
    default:
      return -1; // Operador inválido
  }
}

// Função para converter uma expressão infixa para pós-fixa
function converterParaPosfixa(expressaoInfixa) {
  let expressaoPosfixa = []; // Array para armazenar a expressão pós-fixa
  let pilhaDeOperadores = new PilhaDeOperadores(); // Pilha para operadores
  let numeroAtual = ''; // Variável para acumular números inteiros ou decimais

  for (let char of expressaoInfixa) {
    if (!isNaN(char) || char === '.') { // Se for número ou ponto decimal
      numeroAtual += char;
    } else {
      if (numeroAtual) {
        expressaoPosfixa.push(numeroAtual); // Adiciona o número acumulado à expressão pós-fixa
        numeroAtual = '';
      }

      if (char === '(') {
        pilhaDeOperadores.empilhar(char); // Empilha parênteses abertos
      } else if (char === ')') {
        // Desempilha até encontrar um parênteses aberto
        while (!pilhaDeOperadores.estaVazia() && pilhaDeOperadores.espiar() !== '(') {
          expressaoPosfixa.push(pilhaDeOperadores.desempilhar());
        }
        pilhaDeOperadores.desempilhar(); // Remove o parênteses aberto
      } else {
        // Desempilha operadores com precedência maior ou igual
        while (
            !pilhaDeOperadores.estaVazia() &&
            obterPrecedencia(char) <= obterPrecedencia(pilhaDeOperadores.espiar())
            ) {
          expressaoPosfixa.push(pilhaDeOperadores.desempilhar());
        }
        pilhaDeOperadores.empilhar(char); // Empilha o operador atual
      }
    }
  }

  if (numeroAtual) {
    expressaoPosfixa.push(numeroAtual); // Adiciona o último número acumulado
  }

  while (!pilhaDeOperadores.estaVazia()) {
    expressaoPosfixa.push(pilhaDeOperadores.desempilhar()); // Adiciona operadores restantes
  }

  return expressaoPosfixa.join(' '); // Retorna a expressão pós-fixa como string
}

// Função para avaliar uma expressão pós-fixa
function avaliarPosfixa(expressaoPosfixa) {
  let pilhaDeNumeros = new PilhaDeNumeros(); // Pilha para armazenar números
  let postfix = expressaoPosfixa.split(' '); // Divide a expressão em tokens

  for (let caracterAtual of postfix) {
    if (!isNaN(caracterAtual)) {
      pilhaDeNumeros.empilhar(Number(caracterAtual)); // Empilha números
    } else {
      // Realiza a operação correspondente
      let valor2 = pilhaDeNumeros.desempilhar();
      let valor1 = pilhaDeNumeros.desempilhar();

      switch (caracterAtual) {
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

  return pilhaDeNumeros.desempilhar(); // Retorna o resultado final
}

// Variáveis para controlar o estado da calculadora
let parentesesUsado = false; // Alterna entre parênteses aberto e fechado
const resultado = document.getElementById('resultado'); // Campo de exibição
let expressao = ''; // Expressão atual

// Atualiza o display da calculadora
function atualizarDisplay() {
  const displayFormatado = expressao
      .replace(/\*/g, 'x') // Substitui * por x
      .replace(/\//g, '÷') // Substitui / por ÷
      .replace(/\./g, ','); // Substitui ponto por vírgula
  resultado.value = displayFormatado;

  resultado.scrollLeft = resultado.scrollWidth; // Garante que o display mostre o final da expressão
}

// Event listener para os botões da calculadora
document.getElementById('buttons').addEventListener('click', (e) => {
  const target = e.target;

  if (target.classList.contains('numeros')) {
    expressao += target.dataset.number; // Adiciona número à expressão
  } else if (target.classList.contains('operadores')) {
    expressao += target.dataset.operation; // Adiciona operador
  } else if (target.classList.contains('parenteses')) {
    expressao += parentesesUsado ? ')' : '('; // Alterna parênteses
    parentesesUsado = !parentesesUsado;
  } else if (target.classList.contains('clear')) {
    expressao = ''; // Limpa a expressão
    parentesesUsado = false;
  } else if (target.classList.contains('igual')) {
    try {
      const expressaoComPontos = expressao.replace(/,/g, '.'); // Substitui vírgulas por pontos
      const posfixa = converterParaPosfixa(expressaoComPontos); // Converte para pós-fixa
      const resultadoCalculado = avaliarPosfixa(posfixa); // Avalia a expressão
      expressao = resultadoCalculado.toString().replace(/\./g, ','); // Formata o resultado
    } catch (error) {
      expressao = 'Erro'; // Exibe erro em caso de falha
    }
  } else if (target.classList.contains('decimal')) {
    if (!expressao.endsWith(',')) {
      expressao += ','; // Adiciona vírgula para números decimais
    }
  }

  atualizarDisplay(); // Atualiza o display
});
