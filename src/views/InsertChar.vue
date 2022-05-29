<template>
<div class="getchar">
    <form action="" @submit.prevent="submit()">
    <label>Enter char</label>
    <input v-model="char" type="text" autofocus>
    <input type="submit">
  </form>
</div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { ipcRenderer } from 'electron';

export default defineComponent({
  name: 'InsertChar',
  setup() {
    const char = ref('');
    const submit = () => {
      ipcRenderer.send('enterKey', char.value);
    };

    return {
      submit,
      char,
    };
  },
});
</script>

<style lang='scss' scoped>
.getchar {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
form {
  display: flex;
  flex-direction: column;
  label {
    color: #fff;
    text-align: center;
    font-size: 22px;
    margin-bottom: 10px;
  }
  input[type=text] {
    border: none;
    padding: 10px 15px;
    outline: none;
    margin-bottom: 10px;
  }

  input[type=submit] {
    border: none;
    background: rgb(36, 81, 173);
    padding: 5px 0;
    color: #fff;
  }
}
</style>
