import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {AppButton} from './AppButton';
import {colors} from '../theme/colors';

type Props = React.ComponentProps<typeof AppButton> & {style?: StyleProp<ViewStyle>};

export function GradientButton(props: Props) {
  return (
    <AppButton
      {...props}
      variant="primary"
      style={[{backgroundColor: colors.primaryStart, borderColor: colors.primaryEnd}, props.style]}
    />
  );
}
