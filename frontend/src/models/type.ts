export interface Pet {
    pet_id: number;
    name: string;
    species: string;
    breed: string | null;
    birth_date: string; 
    photo_url: string;
    description?: string;
    status: 'Con Dueño' | 'En Adopción' | 'Adoptado';
    owner_id: number | null;
    created_at?: string;
}

export interface AdoptionPet extends Pet {
    age: string;
}

export interface User {
    user_id: number;
    full_name: string;
    email: string;
    role: 'Admin' | 'Vet' | 'User';
    created_at: string;
}