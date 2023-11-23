import React from 'react';
import { Box } from '@mui/material';
import classNames from 'classnames';

import { TPropsWithChildrenAndClassName } from 'src/core/types';

import styles from './SidePanel.module.scss';

export interface TSidePanelProps extends TPropsWithChildrenAndClassName {
  withHeader?: boolean;
  headerTitle?: string;
  scrollableContent?: boolean;
  hidden?: boolean;
}

export const SidePanel: React.FC<TSidePanelProps> = (props) => {
  const {
    // prettier-ignore
    className,
    children,
    withHeader,
    headerTitle,
    scrollableContent,
    hidden,
  } = props;
  return (
    <Box className={classNames(className, styles.root, hidden && styles.hidden)}>
      {!hidden && (
        <Box className={classNames(styles.container)}>
          {!!withHeader && (
            <Box className={classNames(styles.header)}>
              <Box className={classNames(styles.headerTitle)}>{headerTitle}</Box>
            </Box>
          )}
          <Box
            className={classNames(styles.content, scrollableContent && styles.contentScrollable)}
          >
            {/* Content */}
            {children}
          </Box>
        </Box>
      )}
    </Box>
  );
};
