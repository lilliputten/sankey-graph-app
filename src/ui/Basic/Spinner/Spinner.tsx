/** @module Spinner
 *  @since 2023.01.27, 20:59
 *  @changed 2023.01.27, 21:24
 */

import classnames from 'classnames';

import styles from './Spinner.module.scss';

export type TSpinnerSize = 'small' | 'medium' | 'large';
export type TSpinnerColor = 'primary' | 'white' | 'black';

interface TSpinnerProps {
  className?: string;
  size?: TSpinnerSize;
  color?: TSpinnerColor;
}

export function Spinner(props: TSpinnerProps): JSX.Element {
  const { className, size, color } = props;
  const sizeId = size && 'size_' + size;
  const colorId = color && 'color_' + color;
  const resultedClassName = classnames(
    className,
    styles.container,
    sizeId && styles[sizeId],
    colorId && styles[colorId],
  );
  return <div className={resultedClassName} />;
}
