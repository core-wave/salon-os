"use server";

import z from "zod";
import { FormState } from "../types";
import { salonCore } from "../core";
import { revalidatePath } from "next/cache";
import { CustomerFormProps, customerFormSchema } from "./schemas";

export async function deleteCustomer(
  id: string,
  prevState: "default" | "error" | "success"
): Promise<"default" | "error" | "success"> {
  const success = await salonCore.deleteCustomer(id);

  if (!success) {
    return "error";
  }

  revalidatePath("/");

  return "success";
}

export async function createCustomer(
  organizationId: string,
  prevState: FormState<CustomerFormProps>,
  formData: FormData
): Promise<FormState<CustomerFormProps>> {
  const rawData: CustomerFormProps = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    notes: formData.get("notes") as string,
  };

  const parsed = customerFormSchema.safeParse(rawData);

  if (!parsed.success) {
    console.error("parsing error in createCustomer:", parsed.error);
    return {
      status: "error",
      fieldErrors: z.treeifyError(parsed.error).properties,
      fieldValues: rawData,
    };
  }

  const success = await salonCore.createCustomer({
    ...parsed.data,
    organizationId,
  });

  if (!success) {
    return {
      status: "error",
      fieldValues: parsed.data,
      formErrors: ["error creating customer"],
    };
  }

  revalidatePath("/");

  return {
    status: "success",
  };
}

export async function updateCustomer(
  id: string,
  prevState: FormState<CustomerFormProps>,
  formData: FormData
): Promise<FormState<CustomerFormProps>> {
  const rawData: CustomerFormProps = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    notes: formData.get("notes") as string,
  };

  const parsed = customerFormSchema.safeParse(rawData);

  if (!parsed.success) {
    console.error("parsing error in updateCustomer:", parsed.error);
    return {
      status: "error",
      fieldErrors: z.treeifyError(parsed.error).properties,
      fieldValues: rawData,
    };
  }

  const success = await salonCore.updateCustomer(id, parsed.data);

  if (!success) {
    return {
      status: "error",
      fieldValues: parsed.data,
      formErrors: ["error updating customer"],
    };
  }

  revalidatePath("/");

  return {
    status: "success",
    fieldValues: parsed.data,
  };
}
