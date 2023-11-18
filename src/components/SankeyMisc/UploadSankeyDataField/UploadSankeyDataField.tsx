import React from 'react';
import { ButtonOwnProps } from '@mui/material';
import classNames from 'classnames';

import { DataFileUploadField, TDataFileUploadInfo } from 'src/ui/Basic/DataFileUploadField';
import { getApproxSize } from 'src/helpers';

import styles from './UploadSankeyDataField.module.scss';

interface TUploadSankeyDataField<T = unknown> {
  id: string;
  className?: string;
  /** Text string to show in file upload button */
  dataName?: string;
  setFileInfo?: (info?: TDataFileUploadInfo) => void;
  setData?: (data?: T) => void;
  setError?: (error?: Error) => void;
  // buttonProps?: ButtonOwnProps;
}

const buttonProps: ButtonOwnProps = {
  fullWidth: true,
};

export const UploadSankeyDataField = <T extends unknown>(props: TUploadSankeyDataField<T>) => {
  const {
    // prettier-ignore
    id,
    /** Data name to insert into button text */
    dataName = 'Data file',
    className,
    setData,
    setFileInfo: setParentFileInfo,
    setError,
  } = props;
  const [fileInfo, setFileInfo] = React.useState<TDataFileUploadInfo | undefined>();
  const handleFileInfo = React.useCallback(
    (fileInfo: TDataFileUploadInfo | undefined) => {
      setFileInfo(fileInfo);
      if (setParentFileInfo) {
        setParentFileInfo(fileInfo);
      }
    },
    [setParentFileInfo],
  );
  const text = React.useMemo(() => {
    if (fileInfo) {
      const {
        fileName,
        // fileType,
        fileSize,
      } = fileInfo;
      const size = getApproxSize(fileSize, { normalize: true }).join('');
      return `Loaded ${dataName}: ${fileName} (${size})`;
    }
    return `Load ${dataName}`;
  }, [dataName, fileInfo]);
  return (
    <DataFileUploadField
      // prettier-ignore
      className={classNames(className, styles.root)}
      id={id}
      text={text}
      setData={setData}
      setError={setError}
      setFileInfo={handleFileInfo}
      buttonProps={buttonProps}
    />
  );
};
