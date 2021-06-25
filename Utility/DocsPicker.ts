import { Dispatch, SetStateAction } from 'react';
import * as DocsPicker from 'expo-document-picker';
import { DocsObjects } from '../Component/DataInterface';

export const TakeDocuments = async (
  SetDocs: Dispatch<SetStateAction<DocsObjects>>
) => {
  const result: DocsObjects = await DocsPicker.getDocumentAsync({
    copyToCacheDirectory: false,
    multiple: false,
    type: '*/*',
  });

  if (result.type === 'success') {
    SetDocs(result);
  }
};
