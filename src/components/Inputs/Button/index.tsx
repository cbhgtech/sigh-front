import { ButtonHTMLAttributes, ComponentType } from 'react';
import { IconBaseProps } from 'react-icons';
import { CgSpinner } from 'react-icons/cg';

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isLoading?: boolean;
  variant?: 'primary' | 'primary-border' | 'error';
  aditionalClasses?: string;
  icon?: ComponentType<IconBaseProps>;
}

const buttonStyle = {
  primary: 'bg-light-primary border-light-primary text-light-on-primary',
  'primary-border': 'bg-light-surface border-light-outline text-light-primary',
  error: 'bg-light-error border-light-error text-light-on-error',
};

const disabledButton =
  'disabled:hover:brightness-100 disabled:cursor-auto disabled:bg-gray-400 disabled:border-gray-400';

export function Button({
  label,
  isLoading,
  variant = 'primary',
  aditionalClasses,
  icon: Icon,
  ...rest
}: IButton) {
  return (
    <button
      className={`flex rounded-full  items-center justify-center w-full duration-200 border text-sm cursor-pointer hover:brightness-90 whitespace-nowrap p-2 my-2 font-medium  ${disabledButton} ${buttonStyle[variant]} ${aditionalClasses}`}
      type="button"
      {...rest}
    >
      {Icon && <Icon className="mr-2" size={20} />}
      {!isLoading && label}
      {isLoading && <CgSpinner className="animate-spin" size="1.5rem" />}
    </button>
  );
}
