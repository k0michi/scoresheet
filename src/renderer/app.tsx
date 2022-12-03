import { useModel } from 'kyoka';
import * as React from 'react';
import Model from './model';
import ListView from './list-view';
import TableView from './table-view';
import ToolBar from './tool-bar';

export interface ListView {
}

export default function App(props: ListView) {
  const model = useModel<Model>();

  React.useEffect(() => {
    const onDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      for (const f of e.dataTransfer!.files) {
        if (f.type == 'application/json') {
          const content = await bridge.readFile(f.path);
          model.setFile({ path: f.path, attempts: JSON.parse(content), unsaved: false });
        }
      }
    };

    document.addEventListener('drop', onDrop);

    const onDragover = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener('dragover', onDragover);

    return () => {
      document.removeEventListener('drop', onDrop);
      document.removeEventListener('dragover', onDragover);
    };
  }, []);

  return <div id='app'>
    <ToolBar />
    <div className='views'>
      <ListView />
      <TableView />
    </div>
  </div>
}