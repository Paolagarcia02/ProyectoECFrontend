<script setup lang="ts">
/**
 * Componente AppointmentFormModal
 * Modal para crear o editar citas en el panel de administración
 */
import { ref, watch } from 'vue';
import type { Appointment } from '@/stores/appointmentStore';
import type { Pet } from '@/models/type';
import type { User } from '@/models/type';

// Props: recibe si el modal está visible, la cita a editar (opcional) y las listas para los desplegables
const props = defineProps<{
    show: boolean;
    appointment?: Appointment | null;
    pets: Pet[];
    vets: User[];
    franchises: { franchise_id: number; name: string }[];
}>();

// Emits: emite eventos para cerrar el modal o guardar los datos
const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save', data: any): void;
}>();

// Estado del formulario
const formData = ref({
    date_time: '',
    reason: '',
    status: 'Pendiente',
    notes: '',
    pet_id: 0,
    vet_id: 0,
    franchise_id: 0
});

// Función para resetear el formulario
const resetForm = () => {
    formData.value = { date_time: '', reason: '', status: 'Pendiente', notes: '', pet_id: 0, vet_id: 0, franchise_id: 0 };
};

// Watcher: cuando cambia la prop 'appointment', rellenamos el formulario
watch(() => props.appointment, (newAppointment) => {
    if (newAppointment) {
        formData.value = {
            date_time: newAppointment.date_time.slice(0, 16),
            reason: newAppointment.reason,
            status: newAppointment.status || 'Pendiente',
            notes: newAppointment.notes || '',
            pet_id: newAppointment.pet_id,
            vet_id: newAppointment.vet_id,
            franchise_id: newAppointment.franchise_id
        };
    } else {
        resetForm();
    }
}, { immediate: true });

// Envío del formulario
const handleSubmit = () => {
    if (!formData.value.date_time || !formData.value.reason || !formData.value.pet_id || !formData.value.vet_id || !formData.value.franchise_id) return;
    const dataToSend = { ...formData.value };
    if (props.appointment) {
        // Si estamos editando, añadimos el ID igual que hace PetFormModal
        (dataToSend as any).appointment_id = props.appointment.appointment_id;
    }
    emit('save', dataToSend);
    resetForm();
};

const handleClose = () => {
    resetForm();
    emit('close');
};
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="show" class="modal-overlay" @click.self="handleClose">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>{{ appointment ? 'Editar Cita' : 'Nueva Cita' }}</h2>
                        <button @click="handleClose" class="close-btn">✕</button>
                    </div>

                    <form @submit.prevent="handleSubmit" class="modal-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Fecha y hora *</label>
                                <input v-model="formData.date_time" type="datetime-local" required />
                            </div>
                            <div class="form-group">
                                <label>Motivo *</label>
                                <input v-model="formData.reason" type="text" placeholder="Ej: Revisión anual" required />
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Mascota *</label>
                                <select v-model.number="formData.pet_id" required>
                                    <option value="0" disabled>Selecciona una mascota</option>
                                    <option v-for="pet in pets" :key="pet.pet_id" :value="pet.pet_id">
                                        {{ pet.name }} ({{ pet.species }})
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Veterinario *</label>
                                <select v-model.number="formData.vet_id" required>
                                    <option value="0" disabled>Selecciona un veterinario</option>
                                    <option v-for="vet in vets" :key="vet.user_id" :value="vet.user_id">
                                        {{ vet.full_name }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Clínica *</label>
                                <select v-model.number="formData.franchise_id" required>
                                    <option value="0" disabled>Selecciona una clínica</option>
                                    <option v-for="f in franchises" :key="f.franchise_id" :value="f.franchise_id">
                                        {{ f.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Estado</label>
                                <select v-model="formData.status">
                                    <option>Pendiente</option>
                                    <option>Confirmada</option>
                                    <option>Completada</option>
                                    <option>Cancelada</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Notas</label>
                            <input v-model="formData.notes" type="text" placeholder="Observaciones..." />
                        </div>

                        <div class="modal-actions">
                            <button type="button" @click="handleClose" class="btn btn-cancel">Cancelar</button>
                            <button type="submit" class="btn btn-save">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped lang="scss">
@use '@/assets/styles/base/variables' as v;

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    background: white;
    border-radius: 16px;
    width: 100%;
    max-width: 700px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 30px;
    border-bottom: 2px solid v.$color-green-light;

    h2 {
        font-family: v.$font-title;
        color: v.$color-green-dark;
        margin: 0;
    }
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.8rem;
    cursor: pointer;
    color: #999;
    &:hover { color: v.$color-peach-dark; }
}

.modal-form {
    padding: 30px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
}

.form-group {
    margin-bottom: 20px;

    label {
        display: block;
        font-family: v.$font-subtitle;
        font-weight: bold;
        color: v.$color-green-dark;
        margin-bottom: 8px;
    }

    input, select {
        width: 100%;
        padding: 10px 15px;
        border: 2px solid v.$color-green-light;
        border-radius: 8px;
        font-family: v.$font-subtitle;
        font-size: 1rem;
        box-sizing: border-box;
        background: white;
        &:focus { outline: none; border-color: v.$color-peach-dark; }
    }
}

.modal-actions {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    margin-top: 10px;
}

.btn {
    padding: 12px 30px;
    border: none;
    border-radius: 8px;
    font-family: v.$font-title;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-cancel {
    background: #e0e0e0;
    color: #555;
    &:hover { background: #d0d0d0; }
}

.btn-save {
    background: v.$color-peach-dark;
    color: white;
    &:hover { background: v.$color-green-dark; }
}

.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
