import { defineStore } from 'pinia';
import axios from 'axios';
import type { Pet } from '../models/type';


export const usePetStore = defineStore('petStore', {
  state: () => ({
    pets: [] as Pet[],
    loading: false
  }),

  getters: {

    randomAdoptions: (state): Pet[] => {
      if (state.pets.length === 0) return [];

      const candidates = state.pets.filter(pet => pet.status === 'En Adopción');

      return [...candidates]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
    }
  },

  actions: {
    async fetchPets() {
      this.loading = true;
      try {
        const response = await fetch('http://localhost:8407/api/Pet');
        const data = await response.json();
        this.pets = data; // Rellenar con datos reales
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        this.loading = false;
      }
    }
  }
});