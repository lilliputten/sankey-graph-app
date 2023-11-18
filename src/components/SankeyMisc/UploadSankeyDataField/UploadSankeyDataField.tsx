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
  /** Initial loaded flag */
  defaultLoaded?: boolean;
  dataInfo?: string;
}

const buttonProps: ButtonOwnProps = {
  fullWidth: true,
};

// TODO: Move the following helpers to an external module?

function getFileInfoText(fileInfo?: TDataFileUploadInfo) {
  if (fileInfo) {
    const {
      fileName,
      // fileType,
      fileSize,
    } = fileInfo;
    const name = '"' + fileName + '"';
    const size = getApproxSize(fileSize, { normalize: true }).join('');
    return `${name}, ${size}`;
  }
}

function getInfoText(
  isLoaded: boolean,
  dataName: string,
  fileInfo?: TDataFileUploadInfo,
  dataInfo?: string,
) {
  const statusText = isLoaded ? 'Loaded' : 'Load';
  let extraText = '';
  if (isLoaded) {
    let fileInfoText = getFileInfoText(fileInfo);
    if (fileInfoText && dataInfo) {
      fileInfoText = `(${fileInfoText})`;
    }
    extraText = [dataInfo, fileInfoText].filter(Boolean).join(' ');
  }
  const text = [
    // prettier-ignore
    `${statusText} ${dataName}`,
    extraText,
    // isLoaded && getFileInfoText(fileInfo),
    // isLoaded && dataInfo,
  ]
    .filter(Boolean)
    .join(': ');
  return text;
}

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
    defaultLoaded,
    dataInfo,
  } = props;
  const [fileInfo, setFileInfo] = React.useState<TDataFileUploadInfo | undefined>();
  const [isLoaded, setLoaded] = React.useState(!!defaultLoaded);
  const handleFileInfo = React.useCallback(
    (fileInfo: TDataFileUploadInfo | undefined) => {
      setFileInfo(fileInfo);
      setLoaded(!!fileInfo);
      if (setParentFileInfo) {
        setParentFileInfo(fileInfo);
      }
    },
    [setParentFileInfo],
  );
  const text = React.useMemo(() => {
    return getInfoText(isLoaded, dataName, fileInfo, dataInfo);
  }, [dataName, isLoaded, fileInfo]);
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
      defaultLoaded={defaultLoaded}
    />
  );
};
