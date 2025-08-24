"use client";
import * as React from "react";
import { FormProvider } from "react-hook-form";

// Minimal Form wrapper so <Form {...form}> works without strict typing issues
export function Form(props: any) {
  const { children, ...methods } = props || {};
  return React.createElement(FormProvider as any, methods || {}, children);
}

export default Form;
