import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || '');
    const userRole = ref(localStorage.getItem('userRole') || ''); 

    const isLogged = computed(() => !!token.value);
    const isAdmin = computed(() => userRole.value === 'Admin');

    function login(newToken: string, role: string) {
        token.value = newToken;
        userRole.value = role;
        localStorage.setItem('token', newToken);
        localStorage.setItem('userRole', role);
    }

    function logout() {
        token.value = '';
        userRole.value = '';
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
    }

    return { token, userRole, isLogged, isAdmin, login, logout };
});