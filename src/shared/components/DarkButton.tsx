import React from 'react';
import {AppButton} from './AppButton';

export function DarkButton(props: React.ComponentProps<typeof AppButton>) {
  return <AppButton {...props} variant="dark" />;
}
