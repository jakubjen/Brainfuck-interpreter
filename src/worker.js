const { parentPort, workerData } = require('worker_threads');

const resovlePath = require('path').resolve;

const Interpreter = require(resovlePath('./src/core/Interpreter.js'));
const Memory = require(resovlePath('./src/core/Memory.js'));

const parse = (data) => {
  let lines = data.split('\n');
  lines = lines.map((line) => {
    if (line.indexOf('#') !== -1) line = line.substring(0, line.indexOf('#'));
    return line;
  });
  let code = lines.join('').split('');
  code = code.filter((command) => {
    const allowCommand = ['<', '>', '+', '-', '.', ',', '[', ']'];
    return allowCommand.includes(command);
  });
  return code;
};

const toDo = async () => {
  const codeToParse = workerData;
  const code = parse(codeToParse);
  const memory = new Memory();
  const interpreter = new Interpreter(memory);
  await interpreter.run(code);
  parentPort.postMessage({ name: 'end', value: 'done' });
};
toDo();
