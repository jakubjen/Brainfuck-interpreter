/* eslint-disable */
class Interpreter {
    private memory: Memory;

    constructor(memory: Memory) {
      this.memory = memory;
    }

    public async run(code: string[]) {
      return new Promise(async (resole) => {
        const { memory } = this;
        for (let i = 0; i < code.length; i++) {
          const command = code[i];
          if (command != '[' && command != ']') {
            await this.execute(command);
          } else if (command == '[') {
            const endBracket = this.findEndBracket(code, i);
            const codeInLoop = code.slice(i + 1, endBracket);
            while (memory.getValue() != 0) {
              await this.run(codeInLoop);
            }
            i = endBracket;
          }          
        }
        resole('');
      })
    }

    private findEndBracket(code: string[], i: number) {
      let nested = 0;
      for (let j = i; j < code.length; j++) {
        if (code[j] == '[') {
          nested++;
        } else if (code[j] == ']') {
          nested--;
          if (nested == 0) {
            return j;
          }
        }
      }
      throw ('Syntax error');
    }

    private async execute(command: string) {
      const { memory } = this;
      const { parentPort} = require('worker_threads');
      if (command == '>') memory.increasePointer();
      else if (command == '<') memory.decreasePointer();
      else if (command == '+') memory.increaseValue();
      else if (command == '-') memory.decreaseValue();
      else if (command == '.') {
        const char = String.fromCharCode(memory.getValue())
        parentPort.postMessage({name: 'printChar', value: char});
      }
      else if (command == ',') {
        parentPort.postMessage({name: 'userNeedEnterKey', value: ''});
        const assciCode = await new Promise(resolve => {
          let assciCode = '0';              
          parentPort.once('message', ({name, value}) => {
            if(name === 'insertChar') { 
              assciCode = value.charCodeAt(0);              
              resolve(assciCode)
            }
          });
        });        
        this.memory.setValue(assciCode);
        //  const userInput= '';
        //  watch(keyStore, (value) => {
        //   console.log(value);
        // });
        //  const key = userInput ?? "";
        //  this.memory.setValue(key.charCodeAt(0));
      }
    }
}

module.exports = Interpreter;
