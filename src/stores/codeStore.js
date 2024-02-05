import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCodeStore = defineStore('codeDetail', () => {
  const codeId = ref('11');
  const codeValue = ref('');
  const codeName = ref('');
  const codeDesc = ref('');
  const count = ref(0);

  const setCodeId = newCodeId => {
    codeId.value = newCodeId;
  };

  return { codeId, codeValue, codeName, codeDesc, count, setCodeId }; //모든 속성 반환 필요.
});
//값 변경 방법
