import { useModel, useObservable } from 'kyoka';
import * as React from 'react';
import Model, { Attempt } from './model';

export interface TableViewProps {
}

const palette = ['#6da2ff', '#83ff6d', '#ffd56d', '#ff6d6d'];

export default function TableView(props: TableViewProps) {
  const model = useModel<Model>();
  const file = useObservable(model.file);
  const converted: Record<string, Attempt[] | undefined> = {};

  for (const a of file.attempts) {
    if (converted[a.question] == null) {
      converted[a.question] = [];
    }

    converted[a.question]?.push(a);
  }

  const entries = Object.entries(converted);
  entries.sort((a, b) => a[0].localeCompare(b[0], 'en', { numeric: true }));

  return <div className='table-view'>
    <table>
      <tbody>
        {entries.map(([question, attempts]) => <tr>
          <td>{question}</td>
          {attempts?.map(a => <td className='cell' style={{ backgroundColor: palette[a.grade - 1] }}>{a.grade}</td>)}
        </tr>)}
      </tbody>
    </table>
  </div>
}