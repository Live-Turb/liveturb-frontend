/**
 * Declarações de ambiente para resolver problemas de tipagem
 * Especialmente importantes para JSX e módulos sem definições claras
 */

// Definições para JSX
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Definição para NodeJS.Timeout
declare namespace NodeJS {
  type Timeout = number;
}
