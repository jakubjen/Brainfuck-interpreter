import { reactive } from 'vue';

interface DisplayStore{
    value: string;
}

const store: DisplayStore = reactive({ value: '' });
export default function useDisplayStore(): DisplayStore {
  return store;
}
