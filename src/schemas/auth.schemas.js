//Se importa zod para hacer un esquema de registro y logueo
import { z } from "zod";
//Se crea el esquema de registro
export const registerSchema = z.object({
  //Se pide el nombre de usuario y que sea un string
  name: z.string({
    required_error: "El nombre de usuario es requerido",
  }),
  lastName: z.string({
    required_error: "El apellido paterno de usuario es requerido",
  }),
  secondLastName: z.string({
    required_error: "El apellido materno de usuario es requerido",
  }),
  userName: z.string({
    required_error: "El ombre de usuario es requerido",
  }),
  //Se pide el email que sea un string y email
  email: z
    .string({
      required_error: "El email es requerido",
    })
    .email({
      message: "Email invalido",
    }),
  //Se pide que la contraseña sea de minimo 8 caracteres y que sea un string
  password: z
    .string({
      required_error: "La contraseña requerida",
    })
    .min(8, {
      message: "La contraseña debe tener al menos 8 caracteres",
    }),
});
//Se crea el esquema para el login
export const loginSchema = z.object({
  //Se pide el email que sea un string y email
  email: z
    .string({
      required_error: "El email es requerido",
    })
    .email({
      message: "Email invalido",
    }),
  //Se pide que la contraseña sea de minimo 8 caracteres y que sea un string
  password: z
    .string({
      required_error: "La contraseña requerida",
    })
    .min(8, {
      message: "La contraseña debe tener al menos 8 caracteres",
    }),
});
