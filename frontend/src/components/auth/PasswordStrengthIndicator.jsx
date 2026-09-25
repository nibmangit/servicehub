import React from 'react';
import { Check, X } from 'lucide-react';
import { validatePassword } from '../../lib/validators';

export default function PasswordStrengthIndicator({ password }) {
  const { minLength, hasLetter, hasNumber } = validatePassword(password);

  const criteria = [
    { label: 'At least 6 characters long', met: minLength },
    { label: 'Contains at least one letter', met: hasLetter },
    { label: 'Contains at least one number', met: hasNumber },
  ];

  return (
    <div className="mt-2 space-y-1 text-xs">
      {criteria.map((item, index) => (
        <div
          key={index}
          className={`flex items-center gap-1.5 transition-colors ${
            item.met
              ? 'text-green-600 dark:text-green-400 font-medium'
              : 'text-(--color-muted-foreground)'
          }`}
        >
          {item.met ? <Check size={13} /> : <X size={13} />}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}