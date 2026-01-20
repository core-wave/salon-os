import { ZodError } from "zod";
import { clientSchema } from "./schema";

export const clientEnv = (() => {
  try {
    return clientSchema.parse(process.env);
  } catch (err) {
    if (err instanceof ZodError) {
      const vars = err.issues.map((issue) => `- ${issue.path.join(".")}`);

      throw new Error(`Missing or invalid env vars:\n${vars.join("\n")}`);
    }

    throw err;
  }
})();
