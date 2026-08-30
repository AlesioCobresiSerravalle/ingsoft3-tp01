export interface Persona {
  id: string;
  nombre: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonaInput {
  nombre: string;
  email: string;
}
