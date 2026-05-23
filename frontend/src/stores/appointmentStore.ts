import { defineStore } from 'pinia';
import api from '@/api/axios';

// Interfaz que define la estructura de una cita
export interface Appointment {
    appointment_id: number;
    date_time: string;
    duration_minutes: number;
    reason: string;
    status: string;
    notes?: string;
    pet_id: number;
    vet_id: number;
    franchise_id: number;
    room_id?: number;
}

// Store para manejar las citas veterinarias
export const useAppointmentStore = defineStore('appointmentStore', {
    state: () => ({
        appointments: [] as Appointment[],
        loading: false
    }),

    actions: {
        // Obtiene todas las citas desde el backend
        async fetchAppointments() {
            this.loading = true;
            try {
                const response = await api.get('/Appointment');
                this.appointments = response.data;
            } catch (error) {
                console.error('Error cargando citas:', error);
            } finally {
                this.loading = false;
            }
        },

        // Crea una nueva cita
        async createAppointment(data: { date_time: string; reason: string; pet_id: number; vet_id: number; franchise_id: number }) {
            try {
                await api.post('/Appointment', {
                    Date_time: data.date_time,
                    Reason: data.reason,
                    Pet_id: data.pet_id,
                    Vet_id: data.vet_id,
                    Franchise_id: data.franchise_id,
                    Duration_minutes: 30
                });
                await this.fetchAppointments();
            } catch (error) {
                console.error('Error creando cita:', error);
            }
        },

        // Actualiza una cita existente
        async updateAppointment(data: { appointment_id: number; date_time: string; reason: string; status: string; notes: string; vet_id: number }) {
            try {
                await api.put('/Appointment', {
                    Appointment_id: data.appointment_id,
                    Date_time: data.date_time || null,
                    Reason: data.reason || null,
                    Status: data.status || null,
                    Notes: data.notes || null,
                    Vet_id: data.vet_id || null
                });
                await this.fetchAppointments();
            } catch (error) {
                console.error('Error actualizando cita:', error);
            }
        },

        // Elimina una cita por su id
        async deleteAppointment(id: number) {
            try {
                await api.delete(`/Appointment?IdAppointment=${id}`);
                // Quitamos la cita del estado local sin recargar
                this.appointments = this.appointments.filter(a => a.appointment_id !== id);
            } catch (error) {
                console.error('Error eliminando cita:', error);
            }
        }
    }
});
