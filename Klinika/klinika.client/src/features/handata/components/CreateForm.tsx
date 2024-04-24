import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Fragment } from "react/jsx-runtime";
import { Spinner, X } from "@phosphor-icons/react";
import { z } from "zod";
import getErrorMessage from "../../../util/http-handler";
import { isAxiosError } from "axios";
import Swal from "sweetalert2";
import {
  createGlobalSchema,
  GlobalError,
  Checkbox,
  Input,
  Select,
  File,
} from "../../validation/__validation";
import { zHandler } from "../__handata";
import Textarea from "../../validation/components/Textarea";
import { FormField } from "../utils/form-fields";

type FormProps<T> = {
  header: string;
  fields: FormField[];
  api: (data: T) => Promise<T>;
};

export default function CreateForm<T>({ header, fields, api }: FormProps<T>) {
  const global_schema = createGlobalSchema(fields);
  type RefinedInputs = z.infer<typeof global_schema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    watch,
  } = useForm<RefinedInputs>({
    mode: "onChange",
    resolver: zodResolver(global_schema),
  });
  const { closeCreate: close, setGlobalError } = zHandler();

  const onSubmit = async (data: RefinedInputs) => {
    try {
      const response = await api(data);
      if (response) {
        Swal.fire({
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1000,
        });
        close();
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const errorMessage = getErrorMessage(error);
        setGlobalError(errorMessage);
      }
    }
  };

  const generateInputs = (field: FormField) => {
    let inputElement;
    switch (field.type) {
      case "checkbox":
        inputElement = (
          <Checkbox
            type="checkbox"
            htmlFor={field.identifier}
            labelName={field.name}
            placeholder={field.placeholder}
            {...register(field.identifier)}
            error={errors[field.identifier]?.message}
            hidden={field.isHidden}
          />
        );
        break;
      case "file":
        inputElement = (
          <File
            type={field.type}
            htmlFor={field.identifier}
            labelName={field.name}
            placeholder={field.placeholder}
            {...register(field.identifier)}
            error={errors[field.identifier]?.message}
            hidden={field.isHidden}
          />
        );
        break;
      case "select":
        inputElement = (
          <Select
            htmlFor={field.identifier}
            labelName={field.name}
            options={field.options}
            {...register(field.identifier)}
            error={errors[field.identifier]?.message}
            hidden={field.isHidden}
          />
        );
        break;
      case "textarea":
        inputElement = (
          <Textarea
            htmlFor={field.identifier}
            labelName={field.name}
            placeholder={field.placeholder}
            {...register(field.identifier)}
            error={errors[field.identifier]?.message}
            hidden={field.isHidden}
          />
        );
        break;
      default:
        inputElement = (
          <Input
            type={field.type}
            htmlFor={field.identifier}
            labelName={field.name}
            placeholder={field.placeholder}
            {...register(field.identifier)}
            error={errors[field.identifier]?.message}
            hidden={field.isHidden}
          />
        );
    }

    return <Fragment key={field.identifier}>{inputElement}</Fragment>;
  };

  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 flex items-center bg-opacity-20 justify-center bg-black">
      <div className="flex overflow-y-auto flex-col gap-12 py-12 relative justify-center sm:px-40 px-4 items-center w-[700px] max-h-[900px] rounded-md bg-white">
        <h1 className="font-medium text-3xl">Create {header}</h1>
        <button
          title="Close create modal"
          type="button"
          onClick={close}
          className="absolute top-2 right-2 p-4 hover:bg-zinc-50 rounded-full hover:opacity-70"
        >
          <X size={24} />
        </button>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full"
        >
          {fields.map((field) => generateInputs(field))}
          <button
            type="submit"
            className="mt-4 py-2.5 flex justify-center items-center font-manrope hover:bg-primary/70 text-compact bg-primary/50 rounded-md active:cursor-wait"
          >
            {isSubmitting || isSubmitSuccessful ? (
              <Spinner size={24} className="animate-spin" />
            ) : (
              "Create"
            )}
          </button>
        </form>
      </div>
      <GlobalError />
    </div>
  );
}
