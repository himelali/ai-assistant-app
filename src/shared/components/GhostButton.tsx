import React from 'react';
import {AppButton} from './AppButton';

export function GhostButton(props: React.ComponentProps<typeof AppButton>) {
  return <AppButton {...props} variant="ghost" />;
}
