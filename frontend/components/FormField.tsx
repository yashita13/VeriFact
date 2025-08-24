"use client";
import * as React from "react";
import { Controller, Control } from "react-hook-form";

interface Props {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
}

const FormField: React.FC<Props> = ({ control, name, label, placeholder, type = "text" }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm text-gray-300">{label}</label>}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              className={`w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 outline-none placeholder:text-gray-400 focus:border-purple-400`}
            />
            {fieldState.error && (
              <span className="text-xs text-red-400">{fieldState.error.message}</span>
            )}
          </>
        )}
      />
    </div>
  );
};

export default FormField;
