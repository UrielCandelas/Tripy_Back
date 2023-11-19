import { z } from 'zod'

export const travelSchema = z.object({
    id_user1: z.number({ required_error: "El id del usuario es requerido" }),
    id_location: z.number({ required_error: "El id de la locacion es requerido" }),
    travel_date: z.string({ required_error: "La fecha es requerida" }),
    id_transportation: z.number({ required_error: "El id del trasnporte es requerido" }),
    companions: z.number({ required_error: "Los compañeros son requeridos" }),
})
