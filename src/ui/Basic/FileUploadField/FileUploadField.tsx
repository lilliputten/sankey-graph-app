import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import classNames from 'classnames';

import { PropsWithClassName } from 'src/core/types';
import * as toasts from 'src/ui/Basic/Toasts';

import styles from './FileUploadField.module.scss';
import { getApproxSize, getErrorText } from 'src/helpers';

interface TFileUploadFieldProps extends PropsWithClassName {
  id: string;
  text?: string;
}

function loadFileData(file: File) {
  const { name, type, size } = file;
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    console.log('[loadFileData:onloadend] start', {
      fileReader,
      file,
      name,
      type,
      size,
    });
    // debugger;
    /* // TODO: Other events...
     * abort
     * error
     * load
     * loadend
     * loadstart
     * progress
     */
    fileReader.onloadend = (ev) => {
      const {
        // isTrusted, // true
        // bubbles, // false
        // cancelBubble, // false
        // cancelable, // false
        // composed, // false
        // currentTarget, // FileReader {readyState: 2, result: '[\n  {\n    "producer_graph_id": 0,\n    "consumer_gr…_id": 53,\n    "amount": 0.07788214412864229\n  }\n]', error: null, onloadstart: null, onprogress: null, …}
        // defaultPrevented, // false
        // eventPhase, // 2
        // lengthComputable, // true
        loaded, // 5878
        // returnValue, // true
        // srcElement, // FileReader {readyState: 2, result: '[\n  {\n    "producer_graph_id": 0,\n    "consumer_gr…_id": 53,\n    "amount": 0.07788214412864229\n  }\n]', error: null, onloadstart: null, onprogress: null, …}
        target, // FileReader {readyState: 2, result: '[\n  {\n    "producer_graph_id": 0,\n    "consumer_gr…_id": 53,\n    "amount": 0.07788214412864229\n  }\n]', error: null, onloadstart: null, onprogress: null, …}
        // timeStamp, // 25930.29999998212
        total, // 5878
      } = ev;
      try {
        const rawResult = target?.result as string;
        // TODO: Catch parse errors...
        const data = rawResult && JSON.parse(rawResult);
        console.log('[loadFileData] done', {
          data,
          rawResult,
          // isTrusted, // true
          // bubbles, // false
          // cancelBubble, // false
          // cancelable, // false
          // composed, // false
          // currentTarget, // FileReader {readyState: 2, result: '[\n  {\n    "producer_graph_id": 0,\n    "consumer_gr…_id": 53,\n    "amount": 0.07788214412864229\n  }\n]', error: null, onloadstart: null, onprogress: null, …}
          // defaultPrevented, // false
          // eventPhase, // 2
          // lengthComputable, // true
          loaded, // 5878
          // returnValue, // true
          // srcElement, // FileReader {readyState: 2, result: '[\n  {\n    "producer_graph_id": 0,\n    "consumer_gr…_id": 53,\n    "amount": 0.07788214412864229\n  }\n]', error: null, onloadstart: null, onprogress: null, …}
          target, // FileReader {readyState: 2, result: '[\n  {\n    "producer_graph_id": 0,\n    "consumer_gr…_id": 53,\n    "amount": 0.07788214412864229\n  }\n]', error: null, onloadstart: null, onprogress: null, …}
          // timeStamp, // 25930.29999998212
          total, // 5878
          ev,
          fileReader,
        });
        // debugger;
        resolve(data);
      } catch (error) {
        const errMsg = [
          'Data processing error for file "' + name + '"',
          getErrorText(error as Error),
        ]
          .filter(Boolean)
          .join(': ');
        const resultError = new Error(errMsg);
        console.error('[loadFileData] get data error', {
          resultError,
          error,
        });
        debugger;
        reject(resultError);
      }
    };
    fileReader.onerror = (ev) => {
      const {
        // isTrusted, // true
        // bubbles, // false
        // cancelBubble, // false
        // cancelable, // false
        // composed, // false
        // currentTarget, // FileReader {readyState: 2, result: null, error: DOMException: A requested file or directory could not be found at the time an operation was process…, onloadstart: null, onprogress: null, …}
        // defaultPrevented, // false
        // eventPhase, // 2
        // lengthComputable, // false
        loaded, // 0
        // returnValue, // true
        // srcElement, // FileReader {readyState: 2, result: null, error: DOMException: A requested file or directory could not be found at the time an operation was process…, onloadstart: null, onprogress: null, …}
        target, // FileReader {readyState: 2, result: null, error: DOMException: A requested file or directory could not be found at the time an operation was process…, onloadstart: null, onprogress: null, …}
        // timeStamp, // 17715.90000000596
        // total, // 0
        type, // "error"
      } = ev;
      console.error('[loadFileData] error', {
        // isTrusted, // true
        // bubbles, // false
        // cancelBubble, // false
        // cancelable, // false
        // composed, // false
        // currentTarget, // FileReader {readyState: 2, result: null, error: DOMException: A requested file or directory could not be found at the time an operation was process…, onloadstart: null, onprogress: null, …}
        // defaultPrevented, // false
        // eventPhase, // 2
        // lengthComputable, // false
        loaded, // 0
        // returnValue, // true
        // srcElement, // FileReader {readyState: 2, result: null, error: DOMException: A requested file or directory could not be found at the time an operation was process…, onloadstart: null, onprogress: null, …}
        target, // FileReader {readyState: 2, result: null, error: DOMException: A requested file or directory could not be found at the time an operation was process…, onloadstart: null, onprogress: null, …}
        // timeStamp, // 17715.90000000596
        // total, // 0
        type, // "error"
        ev,
      });
      if (!target) {
        // Unknown error
        const errMsg = [
          'Unknown data loading error for file "' + name + '"',
          // getErrorText(ev as Error),
        ]
          .filter(Boolean)
          .join(': ');
        const unknownError = new Error(errMsg);
        console.error('[loadFileData] unknown error', {
          unknownError,
        });
        debugger;
        return reject(unknownError);
      }
      // Error from event...
      const error = target.error;
      const errMsg = [
        // prettier-ignore
        'Data loading error for file "' + name + '"',
        getErrorText(error as Error),
      ]
        .filter(Boolean)
        .join(': ');
      const resultError = new Error(errMsg);
      console.error('[loadFileData] event error', {
        error,
        resultError,
      });
      debugger;
      reject(resultError);
    };
    fileReader.readAsText(file);
  });
}

export const FileUploadField: React.FC<TFileUploadFieldProps> = (props) => {
  const {
    // prettier-ignore
    id,
    text = 'Upload file',
    className,
  } = props;
  /** If data has already loaded then it's possible to go to core visualizer/editor */
  const [isLoaded, setLoaded] = React.useState(false);
  const doStart = React.useCallback(() => {
    console.log('[FileUploadField:doStart]', {
    });
    debugger;
  }, []);
  const onSelectFile: React.ChangeEventHandler<HTMLInputElement> = React.useCallback((ev) => {
    const files = ev.target.files;
    const file = files && files[0];
    if (!file) {
      // Error...
      toasts.showError('No file selected!');
      return;
    }
    const { name, type, size } = file;
    if (!/\.json$/.test(name) || type !== 'application/json') {
      // Error...
      toasts.showError('Expected json file!');
      return;
    }
    const normalizedSize = getApproxSize(size);
    // const formData = new FormData();
    console.log('[FileUploadField:onSelectFile]', {
      name,
      type,
      size,
      normalizedSize,
      files,
      file,
      ev,
    });
    loadFileData(file)
      .then((data) => {
        console.log('[FileUploadField:onSelectFile] loadFileData success', {
          data,
        });
        debugger;
        toasts.showSuccess('File successfully loaded!');
      })
      .catch((error) => {
        console.error('[FileUploadField:onSelectFile] loadFileData error', {
          error,
        });
        debugger;
        toasts.showError(error);
      });
  }, []);
  return (
    <Box className={classNames(className, styles.root)} id={id}>
      <Button
        className={styles.button}
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        {text}
        <input
          // prettier-ignore
          className={styles.input}
          onChange={onSelectFile}
          type="file"
          accept=".json"
          hidden
        />
      </Button>
    </Box>
  );
};

