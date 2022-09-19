import { InputHTMLAttributes } from 'react';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

export function FileInput({ name, label, ...rest }: IProps) {
  return (
    <label
      htmlFor={name}
      className="text-light-on-surface-variant block flex-1"
    >
      {label}
      <input
        type="file"
        className="block w-full mt-2 text-sm text-light-on-surface-variant file:mr-4 file:p-2 file:rounded-full file:border-0 file:text-sm file:font-semibold
      file:bg-light-tertiary file:text-light-on-tertiary
      hover:file:brightness-90 duration-200"
        id={name}
        {...rest}
      />
    </label>
  );
}