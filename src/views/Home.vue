<template>
  <div class="home">
    <div class="left">
      <div class="display">
          {{ displayText }}
      </div>
      <button v-if="!interpreterIsRunning" @click="run()" class="run">Run</button>
      <button v-if="interpreterIsRunning" @click="stop()" class="stop">Stop</button>
    </div>
    <div class="codSection">
      <ul>
        <li v-for="tab in tabs" :key="tab.id"
        :class="{ active: (tab.id === currentTab.id)}">

          <div class="name" @click="changeTab(tab)">
            {{ tab.name }}<span v-show="tab.index>0">[{{ tab.index }}]</span>
          </div>

          <div class="close" @click="closeTab(tab)">
            x
          </div>
        </li>
        <li class="newTab" @click="handleNewTabClick()"><span>+</span></li>
      </ul>
      <form action="">
        <textarea v-for="tab in tabs" :key="tab.id"
        v-show="tab.id === currentTab.id" v-model="tab.code">

        </textarea>
      </form>
     <!-- <textarea v-model="currentTab.code"> -->
     <!-- </textarea> -->
    </div>
  </div>
</template>

<script lang="js">

import { defineComponent, ref } from 'vue';
import { ipcRenderer, remote } from 'electron';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { basename, extname } from 'path';
import { homedir } from 'os';

export default defineComponent({
  name: 'Home',
  setup() {
    const { dialog } = remote;
    const displayText = ref('');
    const currentTab = ref({ name: '', code: '' });
    const tabs = ref([]);

    function* generateId() {
      let id = 0;
      while (true) {
        id += 1;
        yield id;
      }
    }
    const idGenerator = generateId();

    const creatTab = (name, code, path) => {
      const id = idGenerator.next().value;
      const index = tabs.value.filter((tab) => tab.name === name).length;
      const newTab = {
        id, name, code, path, index,
      };
      tabs.value.push(newTab);
      return newTab;
    };

    const changeTab = (tab) => {
      currentTab.value = tab;
    };

    const handleNewTabClick = () => {
      changeTab(creatTab('Untitle', '', ''));
    };
    changeTab(creatTab('Untitle', '', ''));
    // creatTab('cos.txt', ',>++++++[<-------->-],[<+>-]<.', '');
    // // creatTab('qwddqwd.txt', '', '');
    // creatTab('wd.cos', '', '');
    // creatTab('brain.txt', '++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+
    // ++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.', '');

    const closeTab = (tabToDelete) => {
      tabs.value = tabs.value.filter((tab) => tab.id !== tabToDelete.id);
      if (tabs.value.length === 0) {
        const newTab = creatTab('Untitle', '', '');
        changeTab(newTab);
      }

      if (currentTab.value.id === tabToDelete.id) {
        const firstTab = tabs.value[0];
        changeTab(firstTab);
      }
    };

    const interpreterIsRunning = ref(false);
    const run = async () => {
      displayText.value = '';
      const { code } = currentTab.value;
      interpreterIsRunning.value = true;
      await ipcRenderer.invoke('runInterpreter', code);
      interpreterIsRunning.value = false;
    };

    const stop = () => {
      ipcRenderer.send('stopInterpreter');
    };

    ipcRenderer.on('openFile', (e, args) => {
      const paths = args.filePaths;
      paths.forEach((path) => {
        try {
          const data = readFileSync(path, 'utf8');
          const newTab = creatTab(basename(path), data, path);
          changeTab(newTab);
        } catch (err) {
          console.error(err);
        }
      });
    });

    const getFromUserPathToSaveFile = (path) => {
      console.log(path);
      let pathToSave = path;
      if (extname(pathToSave) === '') pathToSave += '.brain';
      const filter = [];
      if (process.platform === 'win32') {
        filter.push({
          name: 'Brain fuck files',
          extensions: ['txt'],
        });
      }

      const saveDialog = dialog.showSaveDialogSync({
        defaultPath: pathToSave,
        filters: [],
      });
      if (!saveDialog) return undefined;
      pathToSave = saveDialog;
      const fileExist = (existsSync(pathToSave));
      const extension = extname(pathToSave);
      const allowExtension = (extension === '.txt' || extension === '.brain');
      if (!fileExist && allowExtension) return pathToSave;
      if (!allowExtension) {
        dialog.showErrorBox(
          'Save error',
          `Extension: ${extension} is not allow!`,
        );
        return getFromUserPathToSaveFile(pathToSave);
      }
      const confirm = dialog.showMessageBoxSync({
        title: 'Save error',
        message: `File: ${pathToSave} already exist!`,
        type: 'warning',
        buttons: ['Yes', 'No'],
      });
      if (confirm === 0) return pathToSave;
      return getFromUserPathToSaveFile(pathToSave);
    };

    const saveFileAs = () => {
      let filename = currentTab.value.name;
      if (extname(filename) === '') filename += '.brain';
      const defaultPathToSave = `${homedir()}/${filename}`;
      const pathToSave = getFromUserPathToSaveFile(defaultPathToSave);
      if (pathToSave) {
        writeFileSync(pathToSave, currentTab.value.code);
        currentTab.value.path = pathToSave;
      }

      currentTab.value.name = basename(pathToSave);
    };

    ipcRenderer.on('printChar', (e, char) => {
      displayText.value += char;
    });

    ipcRenderer.on('saveFileAs', () => {
      saveFileAs();
    });

    ipcRenderer.on('saveFile', () => {
      console.log('cos');
      const { path } = currentTab.value;
      if (path === '') return saveFileAs();
      writeFileSync(path, currentTab.value.code);
      return path;
    });

    return {
      tabs,
      currentTab,
      changeTab,
      closeTab,
      run,
      displayText,
      stop,
      interpreterIsRunning,
      handleNewTabClick,
    };
  },

});
</script>

<style lang="scss" scoped>
  .home {
    display: flex;
    justify-content: space-between;
    padding: 20px 40px;
    box-sizing: border-box;
    min-height: 100vh;;
    @media screen and (min-width: 750px) {
      height: 100vh;
    }
    @media screen and (max-width: 750px) {
      flex-direction: column;
      justify-content: flex-start;
    }

    .left {
      width: 40%;
      @media screen and (max-width: 750px) {
        width: 100%;
      }

      .display {
        min-height: 60vh;
        background: #232731;
        color: #FFF;
        padding: 15px 18px;
        box-sizing: border-box;
        border-radius: 10px;
        box-shadow: 1px 1px 3px 0 rgba(51, 47, 47, 1);
        @media screen and (max-width: 750px) {
          height: 100%;
        }
      }

      button {
        border: none;
        outline: none;
        box-shadow: 1px 1px 3px 0 rgba(51, 47, 47, 1);
        padding: 5px 15px;
        color: #FFF;
        font-size: 14px;
        margin-top: 10px;

        &.run {
          background: rgb(36, 81, 173);
        }

        &.stop {
          background: rgb(245, 29, 0);
        }
      }
    }

    .codSection {
      max-width: 60%;
      min-width: 60%;
      padding-left: 20px;
      @media screen and (max-width: 750px) {
        max-width: 100%;
        min-width: 100%;

        padding: 20px 0 10px 0;
      }
      ul {
        width: 100%;
        display: flex;
        list-style: none;
        overflow-x: auto;
        li {
          background: #232731;
          color:  #FFF;
          padding-right: 22px;
          border-right: 4px solid rgb(31, 68, 140);
          cursor: pointer;
          position: relative;
          font-size: 14px;

          .name {
            padding: 8px 0 8px 15px;
          }

          &.active {
            border-right-color: rgb(89, 137, 233);
          }

          .close {
            display: none;
            position: absolute;
            right: 6px;
            top: 8px;
            color: red;
          }

          &:hover {
            .close {
              display: block;
            }
          }

          &.newTab {
            border: none;
            padding: 8px 10px 8px 10px;
            background: rgb(0, 0, 0);
          }
        }
      }

      form {
        height: 90%;
        @media screen and (max-width: 750px) {
          height: 400px;
        }
        textarea{
          resize: none;
          width: 100%;
          height: 100%;
          color: #FFF;
          background: rgb(36, 29, 29);
          border-radius: 0 0 15px 15px;
          border: 3px solid rgb(36, 29, 29);
          box-shadow: 1px 1px 3px 0 rgba(51, 47, 47, 1);
          padding: 5px;
        }

        textarea:focus {
          outline: none;
          border: 3px solid rgb(36, 81, 173);
      }
      }
    }
  }
</style>
