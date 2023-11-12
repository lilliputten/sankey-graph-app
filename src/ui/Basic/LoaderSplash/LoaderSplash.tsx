import { CircularProgress, Paper } from '@mui/material';
import classnames from 'classnames';

import styles from './LoaderSplash.module.scss';

export type TSplashMode = 'cover';

interface TLoaderSplashProps {
  className?: string;
  fullSize?: boolean;
  show?: boolean;
  mode?: TSplashMode;
}

export function LoaderSplash(props: TLoaderSplashProps): JSX.Element {
  const { className, fullSize, show = true, mode } = props;
  const resultedClassName = classnames(
    className,
    styles.container,
    mode && styles['mode_' + mode],
    fullSize && styles.fullSize,
    show || styles.hidden,
  );
  return (
    <Paper square elevation={0} className={resultedClassName}>
      <CircularProgress />
    </Paper>
  );
}
