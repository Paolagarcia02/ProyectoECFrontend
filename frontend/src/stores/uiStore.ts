import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
    const isLoading = ref(false);
    const showModal = ref(false);
    const modalData = ref<any>(null);

    function openModal(data?: any) {
        modalData.value = data;
        showModal.value = true;
    }

    function closeModal() {
        showModal.value = false;
        modalData.value = null;
    }

    function setLoading(value: boolean) {
        isLoading.value = value;
    }

    return { 
        isLoading, 
        showModal, 
        modalData, 
        openModal, 
        closeModal, 
        setLoading 
    };
});
