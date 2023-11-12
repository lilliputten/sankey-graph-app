import classnames from 'classnames';

import { Spinner, TSpinnerSize, TSpinnerColor } from 'src/ui/Basic/Spinner';

import styles from './LoaderSplash.module.scss';

export type TSplashBackground = true | 'page' | 'white' | 'gray' | 'neutral' | 'primary' | 'black';
export type TSplashMode = 'cover';

interface TLoaderSplashProps {
  className?: string;
  spinnerSize?: TSpinnerSize;
  spinnerColor?: TSpinnerColor;
  fullSize?: boolean;
  bg?: TSplashBackground;
  show?: boolean;
  mode?: TSplashMode;
}

export function LoaderSplash(props: TLoaderSplashProps): JSX.Element {
  const { className, spinnerSize, spinnerColor, fullSize, bg, show = true, mode } = props;
  const bgId = bg && ['bg', bg].filter((x) => typeof x === 'string').join('_');
  const resultedClassName = classnames(
    className,
    styles.container,
    mode && styles['mode_' + mode],
    fullSize && styles.fullSize,
    bgId && styles[bgId],
    show || styles.hidden,
  );
  return (
    <div className={resultedClassName}>
      <Spinner className={styles.spinner} size={spinnerSize} color={spinnerColor} />
    </div>
  );
}
