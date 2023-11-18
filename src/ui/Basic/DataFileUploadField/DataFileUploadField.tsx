import React from 'react';
import { Box, Button, ButtonOwnProps, CircularProgress } from '@mui/material';
import { Check, CloudUpload } from '@mui/icons-material';
import classNames from 'classnames';

import { PropsWithClassName } from 'src/core/types';
import * as toasts from 'src/ui/Basic/Toasts';

import styles from './DataFileUploadField.module.scss';
import {
  loadDataFile,
  getApproxSize,
  // getErrorText,
  TLoadDataFileProgressParams,
} from 'src/helpers';

export interface TDataFileUploadInfo {
  fileName: string;
  fileType: string;
  fileSize: number;
}

interface TDataFileUploadFieldProps<T = unknown> extends PropsWithClassName {
  id: string;
  /** Text string to show in file upload button */
  text?: string;
  setFileInfo?: (info?: TDataFileUploadInfo) => void;
  setData?: (data?: T) => void;
  setError?: (error?: Error) => void;
  buttonProps?: ButtonOwnProps;
}

export const DataFileUploadField = <T extends unknown>(props: TDataFileUploadFieldProps<T>) => {
  const {
    // prettier-ignore
    id,
    text = 'Upload file',
    className,
    setFileInfo,
    setData,
    setError,
    buttonProps,
  } = props;
  /** If data has already loaded then it's possible to go to core visualizer/editor */
  const [isLoaded, setLoaded] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [loadingProgress, setLoadingProgress] = React.useState<number | undefined>();
  const handleLoadingProgress = React.useCallback((params: TLoadDataFileProgressParams) => {
    const {
      // prettier-ignore
      progress,
      loaded,
      total,
      file,
      fileReader,
    } = params;
    console.log('[DataFileUploadField:handleLoadingProgress]', {
      progress,
      loaded,
      total,
      file,
      fileReader,
    });
    // TODO:
    setLoadingProgress(progress);
  }, []);
  const handleSelectFile: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    (ev) => {
      const files = ev.target.files;
      const file = files && files[0];
      if (!file) {
        // Error...
        toasts.showError('No file selected!');
        return;
      }
      const { name: fileName, type: fileType, size: fileSize } = file;
      const fileInfo = { fileName, fileType, fileSize };
      if (!/\.json$/.test(fileName) || fileType !== 'application/json') {
        // Error...
        toasts.showWarn('Expected json data file!');
        return;
      }
      const normalizedSize = getApproxSize(fileSize);
      // const formData = new FormData();
      console.log('[DataFileUploadField:handleSelectFile]', {
        fileInfo,
        normalizedSize,
        files,
        file,
        ev,
      });
      setLoaded(false);
      setLoading(true);
      loadDataFile(file, {
        timeout: 5000,
        onProgress: handleLoadingProgress,
      })
        .then((data) => {
          console.log('[DataFileUploadField:handleSelectFile] loadDataFile success', {
            data,
            fileInfo,
          });
          toasts.showSuccess('File successfully loaded!');
          setLoaded(true);
          if (setData) {
            setData(data as T);
          }
          if (setFileInfo) {
            setFileInfo(fileInfo);
          }
          if (setError) {
            setError(undefined);
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('[DataFileUploadField:handleSelectFile] loadDataFile error', {
            error,
            fileName,
            fileType,
            fileSize,
          });
          debugger; // eslint-disable-line no-debugger
          // Set error to parrent component or show the toast
          if (setError) {
            setError(error);
          } else {
            toasts.showError(error);
          }
          if (setData) {
            setData(undefined);
          }
          if (setFileInfo) {
            setFileInfo(undefined);
          }
        })
        .finally(() => {
          setLoading(false);
          setLoadingProgress(undefined);
        });
    },
    [handleLoadingProgress, setLoading, setFileInfo, setData, setError],
  );
  const IconNode = React.useMemo<JSX.Element>(() => {
    if (isLoaded) {
      return <Check />;
    } else if (isLoading) {
      return (
        <CircularProgress
          // prettier-ignore
          size={20} // Icon-size
          color="inherit" // Default color
          variant={loadingProgress ? 'determinate' : 'indeterminate'}
          value={loadingProgress}
        />
      );
    } else {
      return <CloudUpload />;
    }
  }, [isLoading, isLoaded, loadingProgress]);
  return (
    <Box className={classNames(className, styles.root)} id={'DataFileUploadField-' + id}>
      <Button
        {...buttonProps}
        className={styles.button}
        component="label"
        variant="contained"
        startIcon={IconNode} // Show icon depending on state...
        disabled={isLoading}
        color={isLoaded ? 'success' : 'primary'}
      >
        {text}
        <input
          // prettier-ignore
          className={styles.input}
          onChange={handleSelectFile}
          type="file"
          accept=".json"
          hidden
          disabled={isLoading}
        />
      </Button>
    </Box>
  );
};
