import { ApproximatedFunction, TableFunction } from "./logic/definitions";
import { getCorrelationCoefficientPearson } from "./logic/utils";
import functionPlot, { FunctionPlotDatum } from "function-plot";

/** Количество выводимых знаков после запятой. */
const PRINT_PRECISION = 4;
const SPACE_BEFORE_AND_AFTER_INTERVAL = 10;

/** Float to string. */
export function fToS(value: number): string {
  return value.toFixed(PRINT_PRECISION);
}

export function showResult(
  input: Required<TableFunction>,
  result: Required<ApproximatedFunction> | null,
): void { //ts-ignore
  console.log(result)
  if (result === null
   || result.printableF.includes("NaN")
  ) {
    alert('Не удалось найти аппроксимирующую функцию');
    return;
  }
  renderPlot(input, result);
  printApproximatedFunction(result.printableF);
  printStdDev(result.standardDeviation);
  printXVector(input.x);
  printYVector(input.y);
  const phiVector = input.x.map(result.f);
  printPhiVector(phiVector);
  const epsilonVector = input.y.map((y, i) => y - phiVector[i]);
  printEpsilonVector(epsilonVector);
  if (result.name === 'Линейная аппроксимация') {
    const pearsonCoeff = getCorrelationCoefficientPearson(input);
    printPearsonCoeff(pearsonCoeff);
  }
  unhideResultSection();
}

function printApproximatedFunction(func: string): void {
  document.getElementsByClassName('result__best-approximated-function')[0].textContent = (
    func
  );
}

function printStdDev(stdDev: number): void {
  document.getElementsByClassName('result__std-dev')[0].textContent = (
    fToS(stdDev)
  );
}

function printXVector(xVector: number[]): void {
  document.getElementsByClassName('result__x')[0].textContent = (
    convertVectorToString(xVector)
  );
}

function printYVector(yVector: number[]): void {
  document.getElementsByClassName('result__y')[0].textContent = (
    convertVectorToString(yVector)
  );
}

function printPhiVector(phiVector: number[]): void {
  document.getElementsByClassName('result__phi')[0].textContent = (
    convertVectorToString(phiVector)
  );
}

function printEpsilonVector(epsilonVector: number[]): void {
  document.getElementsByClassName('result__epsilon')[0].textContent = (
    convertVectorToString(epsilonVector)
  );
}

function printPearsonCoeff(pearsonCoeff: number): void {
  document.getElementsByClassName('result__epsilon')[0].textContent = (
    fToS(pearsonCoeff)
  );
}

function convertVectorToString(vector: number[]): string {
  return `(${vector.map(x => fToS(x)).join(', ')})`;
}

function unhideResultSection(): void {
  document.getElementsByClassName('result')[0]?.classList.remove('hidden');
}

function renderPlot(
  input: TableFunction,
  result: ApproximatedFunction,
): void {
  let xDomain: number[] = [
    Math.min(...input.x) - SPACE_BEFORE_AND_AFTER_INTERVAL,
    Math.max(...input.x) + SPACE_BEFORE_AND_AFTER_INTERVAL,
  ];

  const data: FunctionPlotDatum = {
      fn: result.printableF,
  };

  if (
    [
      'Степенная аппроксимация',
      'Экспоненциальная аппроксимация'
    ]
      .includes(result.name)
  ) {
    data.graphType = 'polyline';
  }

  functionPlot({
    target: "#plot",
    width: 500,
    height: 500,
    xAxis: {
      domain: xDomain,
    },
    grid: true,
    data: [
      data
    ],
  });
}
