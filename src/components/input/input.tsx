import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import { useField } from "@unform/core";

type InputType = "text" | "email" | "password" | "tel" | "file" | "search" | "date";
type InputColor = "light" | "extralight";
type InputSize = "sm" | "adjustable";

interface Props {
  name: string;
  label: string;
  type: InputType;
  color: InputColor;
  sizing: InputSize;
  placeholder: string;
  shape?: "rounded" | "square";
  className?: string;
};

// type InputProps = JSX.IntrinsicElements["input"] & Props;

export default function Input(props: Props) {
  const {
    name,
    label,
    type,
    sizing,
    color,
    shape = "rounded",
    placeholder,
    className,
  } = props;

  const styles = {
    sizes: {
      sm: "w-80 h-14 px-5 text-sm",
      adjustable: 'w-full h-14 px-5 text-sm'
    },
    shapes: {
      square: "rounded-none",
      rounded: "rounded-lg",
    },
    colors: {
      light: "bg-light",
      extralight: "bg-extralight",
    },
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: (ref) => {
        return ref.current.value;
      },
      setValue: (ref, value) => {
        ref.current.value = value;
      },
      clearValue: (ref) => {
        ref.current.value = "";
      },
    });
  }, [fieldName, registerField]);

  return (
    <div className="flex flex-col">
      {label && (
        <label
          className="font-['Poppins'] text-[#616161] font-bold text-sm md:text-md uppercase"
          htmlFor={fieldName}
        >
          {label}
        </label>
      )}

      <input
        className={clsx([
          styles.sizes[sizing],
          styles.colors[color],
          styles.shapes[shape],
          "text-gray",
          "placeholder-placeholder",
          "font-['Poppins']",
          "my-2",
          className,
        ])}
        id={fieldName}
        ref={inputRef}
        defaultValue={defaultValue}
        type={type}
        placeholder={placeholder}
      />
      {error && <span>{error}</span>}
    </div>
  );
}