import classNames from 'classnames';

import Button from '@mui/material/Button';

import { LoaderSplash } from 'src/ui/Basic';

import styles from './TestPage.module.scss';

export function TestPage() {
  const waiting = true;
  return (
    <div className={classNames(styles.root)}>
      <div>TestPage</div>
      <Button variant="contained">Hello world</Button>
      <LoaderSplash show={waiting} mode="cover" fullSize />
    </div>
  );
}
