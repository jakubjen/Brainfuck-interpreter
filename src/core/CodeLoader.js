/* eslint-disable */
import { extname } from 'path';
import { readFileSync } from 'fs';
export default class CodeLoader {
    constructor(path) {
        this.path = '';
        this.path = path;
    }
    static getLoader(path) {
        if (path === 'demo') {
            return new DemoLoader(path);
        }
        if (extname(path) === '.txt') {
            return new FileLoader(path);
        }
        throw ('No match loader.');
    }
    pars(data) {
        let lines = data.split('\n');
        lines = lines.map((line) => {
            if (line.indexOf('#') !== -1)
                line = line.substring(0, line.indexOf('#'));
            return line;
        });
        let code = lines.join('').split('');
        code = code.filter((command) => {
            const allowCommand = ['<', '>', '+', '-', '.', ',', '[', ']'];
            return allowCommand.includes(command);
        });
        return code;
    }
}
class DemoLoader extends CodeLoader {
    load() {
        const staticCode = `++++++++++[>+++++++>++++++++++>+++>+<<<<-]
       >++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.`;
        return this.pars(staticCode);
    }
}
class FileLoader extends CodeLoader {
    load() {
        const readData = readFileSync(this.path, 'utf-8');
        return this.pars(readData);
    }
}
//# sourceMappingURL=CodeLoader.js.map