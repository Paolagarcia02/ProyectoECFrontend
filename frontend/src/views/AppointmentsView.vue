<script setup lang="ts">
/**
 * Vista de gestión de citas veterinarias
 * Muestra el listado de citas y permite crear y eliminar
 */
import { ref, onMounted } from 'vue';
import { useAppointmentStore } from '@/stores/appointmentStore';

const appointmentStore = useAppointmentStore();

// Controla si el formulario de nueva cita está visible
const showForm = ref(false);

// Datos del formulario de nueva cita
const newAppointment = ref({
    date_time: '',
    reason: '',
    pet_id: 0,
    vet_id: 0,
    franchise_id: 1
});

// Al montar la vista, cargamos las citas
onMounted(() => {
    appointmentStore.fetchAppointments();
});

// Envía el formulario para crear una cita
async function submitForm() {
    if (!newAppointment.value.date_time || !newAppointment.value.reason || !newAppointment.value.pet_id || !newAppointment.value.vet_id) return;
    await appointmentStore.createAppointment(newAppointment.value);
    // Reseteamos el formulario y lo ocultamos
    newAppointment.value = { date_time: '', reason: '', pet_id: 0, vet_id: 0, franchise_id: 1 };
    showForm.value = false;
}

// Formatea la fecha para mostrarla de forma legible
function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}
</script>

<template>
    <main class="appointments-page">
        <section class="appointments-hero">
            <h1 class="appointments-hero__title">Citas Veterinarias</h1>
            <p class="appointments-hero__subtitle">Gestiona las citas de tus mascotas</p>
        </section>

        <section class="appointments-content">
            <div class="container">

                <!-- Botón para mostrar/ocultar el formulario -->
                <button class="btn btn--primary" @click="showForm = !showForm">
                    {{ showForm ? 'Cancelar' : '+ Nueva Cita' }}
                </button>

                <!-- Formulario de nueva cita -->
                <div v-if="showForm" class="form-card">
                    <h2>Nueva Cita</h2>
                    <form @submit.prevent="submitForm" class="appointment-form">
                        <div class="form-group">
                            <label>Fecha y hora</label>
                            <input v-model="newAppointment.date_time" type="datetime-local" required />
                        </div>
                        <div class="form-group">
                            <label>Motivo</label>
                            <input v-model="newAppointment.reason" type="text" placeholder="Ej: Revisión anual" required />
                        </div>
                        <div class="form-group">
                            <label>ID Mascota</label>
                            <input v-model.number="newAppointment.pet_id" type="number" min="1" required />
                        </div>
                        <div class="form-group">
                            <label>ID Veterinario</label>
                            <input v-model.number="newAppointment.vet_id" type="number" min="1" required />
                        </div>
                        <button type="submit" class="btn btn--submit">Guardar Cita</button>
                    </form>
                </div>

                <!-- Estado de carga -->
                <div v-if="appointmentStore.loading" class="loading">Cargando citas...</div>

                <!-- Sin citas -->
                <div v-else-if="appointmentStore.appointments.length === 0 && !showForm" class="no-results">
                    No hay citas registradas
                </div>

                <!-- Tabla de citas -->
                <div v-else-if="!appointmentStore.loading" class="table-wrapper">
                    <table class="appointments-table">
                        <thead>
                            <tr>
                                <th>Fecha y hora</th>
                                <th>Motivo</th>
                                <th>Estado</th>
                                <th>ID Mascota</th>
                                <th>ID Vet</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="appointment in appointmentStore.appointments" :key="appointment.appointment_id">
                                <td>{{ formatDate(appointment.date_time) }}</td>
                                <td>{{ appointment.reason }}</td>
                                <td>
                                    <span :class="['status-badge', appointment.status?.toLowerCase()]">
                                        {{ appointment.status || 'Pendiente' }}
                                    </span>
                                </td>
                                <td>{{ appointment.pet_id }}</td>
                                <td>{{ appointment.vet_id }}</td>
                                <td>
                                    <button
                                        class="btn btn--delete"
                                        @click="appointmentStore.deleteAppointment(appointment.appointment_id)"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </section>
    </main>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;

.appointments-page {
    background: v.$color-green-light;
    min-height: 100vh;
}

.appointments-hero {
    padding: 60px 20px;
    text-align: center;
    background: linear-gradient(135deg, v.$color-green-dark 0%, v.$color-green-medium 100%);
    color: white;

    &__title {
        font-family: v.$font-title;
        font-size: 3rem;
        margin-bottom: 15px;
    }

    &__subtitle {
        font-family: v.$font-subtitle;
        font-size: 1.3rem;
        opacity: 0.9;
    }
}

.appointments-content {
    padding: 40px 20px;

    .container {
        max-width: 1100px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 30px;
    }
}

.form-card {
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);

    h2 {
        font-family: v.$font-title;
        color: v.$color-green-dark;
        margin-bottom: 20px;
    }
}

.appointment-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
        font-family: v.$font-subtitle;
        font-size: 0.9rem;
        color: #555;
        text-transform: uppercase;
    }

    input {
        padding: 10px 14px;
        border: 2px solid v.$color-green-medium;
        border-radius: 8px;
        font-family: v.$font-subtitle;
        font-size: 1rem;
        outline: none;

        &:focus {
            border-color: v.$color-peach-dark;
        }
    }
}

.table-wrapper {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.appointments-table {
    width: 100%;
    border-collapse: collapse;
    font-family: v.$font-subtitle;

    th {
        background: v.$color-green-dark;
        color: white;
        padding: 14px 16px;
        text-align: left;
        font-size: 0.9rem;
        text-transform: uppercase;
    }

    td {
        padding: 14px 16px;
        border-bottom: 1px solid v.$color-green-light;
        color: #333;
    }

    tr:last-child td {
        border-bottom: none;
    }

    tr:hover td {
        background: v.$color-green-light;
    }
}

.status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: bold;
    background: #fff3e0;
    color: #f57c00;

    &.completada { background: #e8f5e9; color: #388e3c; }
    &.cancelada  { background: #ffebee; color: #c62828; }
    &.pendiente  { background: #fff3e0; color: #f57c00; }
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-family: v.$font-subtitle;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    align-self: flex-start;

    &--primary {
        background: v.$color-green-dark;
        color: white;
        &:hover { background: v.$color-green-medium; }
    }

    &--submit {
        background: v.$color-peach-dark;
        color: white;
        grid-column: 1 / -1;
        &:hover { opacity: 0.85; }
    }

    &--delete {
        background: #ffebee;
        color: #c62828;
        padding: 6px 14px;
        font-size: 0.85rem;
        &:hover { background: #c62828; color: white; }
    }
}

.loading, .no-results {
    text-align: center;
    font-family: v.$font-subtitle;
    font-size: 1.2rem;
    color: v.$color-green-dark;
    padding: 60px 20px;
}
</style>
