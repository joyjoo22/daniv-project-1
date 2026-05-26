// 폼 필드 — 시안의 .field + .field-label 패턴.
import { forwardRef } from 'react';
import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

type FieldLabelProps = {
  children: ReactNode;
  optional?: boolean;
  className?: string;
};

export function FieldLabel({ children, optional, className }: FieldLabelProps) {
  return (
    <label className={cn('field-label', className)}>
      {children}
      {optional && <span style={{ color: 'var(--ink-4)', fontWeight: 400 }}> (선택)</span>}
    </label>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  mono?: boolean;
};

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { mono, className, ...rest },
  ref,
) {
  return <input ref={ref} className={cn('field', mono && 'mono', className)} {...rest} />;
});

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
};

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { className, children, ...rest },
  ref,
) {
  return (
    <select ref={ref} className={cn('field', className)} {...rest}>
      {children}
    </select>
  );
});
