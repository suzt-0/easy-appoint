import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

export default function InputSuccess({ message, className = '', ...props }: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p {...props} className={cn('text-sm text-green-800 dark:text-green-600', className)}>
            {message}
        </p>
    ) : null;
}
