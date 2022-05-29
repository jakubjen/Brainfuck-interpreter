/* eslint-disable */
class Memory {
    private pointer = 0;

    private memory: number[] = [];

    increasePointer() {
      if (this.pointer < 30000 * 8) {
        this.pointer++;
      } else {
        throw ('"Memory pointer out of range.');
      }
    }

    decreasePointer() {
      if (this.pointer > 0) {
        this.pointer--;
      } else {
        throw ('Memory pointer out of range.');
      }
    }

    getValue() {
      const { memory, pointer } = this;
      return memory[pointer];
    }

    setValue(value: number) {
      const { memory, pointer } = this;
      memory[pointer] = value;
    }

    increaseValue() {
      const { memory, pointer } = this;
      memory[pointer] = (memory[pointer] || 0) + 1;
    }

    decreaseValue() {
      const { memory, pointer } = this;
      memory[pointer] = (memory[pointer] || 0) - 1;
    }
}

module.exports = Memory;