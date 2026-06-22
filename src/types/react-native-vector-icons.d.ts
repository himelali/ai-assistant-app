declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import {ComponentType} from 'react';

  type IconProps = {
    name: string;
    size?: number;
    color?: string;
    style?: unknown;
  };

  const MaterialCommunityIcons: ComponentType<IconProps>;

  export default MaterialCommunityIcons;
}
