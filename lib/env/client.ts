import { clientSchema } from "./schema";

export const clientEnv = clientSchema.parse(process.env);
