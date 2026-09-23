import React from 'react';

export default function PresenceDot({ online }) {
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full border-2 border-(--color-card) ${
        online ? 'bg-green-500' : 'bg-(--color-muted-foreground)/40'
      }`}
    />
  );
}