module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        extraFiles: ['src/worker.js', 'src/core/Interpreter.js', 'src/core/Memory.js'],
      },
    },
  },
};
