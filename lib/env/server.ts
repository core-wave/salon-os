import { ZodError } from "zod";
import { serverSchema } from "./schema";

export const serverEnv = (() => {
  try {
    return serverSchema.parse(process.env);
  } catch (err) {
    if (err instanceof ZodError) {
      const vars = err.issues.map((issue) => `- ${issue.path.join(".")}`);

      throw new Error(`Missing or invalid env vars:\n${vars.join("\n")}`);
    }

    throw err;
  }
})();
