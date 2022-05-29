export default function parse(data: string) {
  let lines = data.split('\n');
  lines = lines.map((lineToRemoveComment) => {
    let line = lineToRemoveComment;
    if (line.indexOf('#') !== -1) line = line.substring(0, line.indexOf('#'));
    return line;
  });
  let code = lines.join('').split('');
  code = code.filter((command) => {
    const allowCommand = ['<', '>', '+', '-', '.', ',', '[', ']'];
    return allowCommand.includes(command);
  });
  return code;
}
