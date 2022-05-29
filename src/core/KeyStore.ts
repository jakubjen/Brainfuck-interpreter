import { reactive } from 'vue';

interface KeyStore {
    code: number;
    openModal: boolean;
}

const store: KeyStore = reactive({
  code: -1,
  openModal: false,
});

export default function useKeyStore(): KeyStore {
  return store;
}
