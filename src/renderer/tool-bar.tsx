import { useModel, useObservable } from 'kyoka';
import * as React from 'react';
import Model from './model';

export interface ToolBarProps {
}

export default function ToolBar(props: ToolBarProps) {
  const model = useModel<Model>();
  const file = useObservable(model.file);

  return <div className='tool-bar'>
    <button onClick={e => {
      model.save();
    }}>Save{file.unsaved ? '*' : ''}</button>
  </div>;
}