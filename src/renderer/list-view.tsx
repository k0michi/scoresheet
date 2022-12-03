import { useModel, useObservable } from 'kyoka';
import * as React from 'react';
import Model from './model';
import Timestamp from './timestamp';

export interface ListViewProps {
}

export default function ListView(props: ListViewProps) {
  const model = useModel<Model>();
  const file = useObservable(model.file);
  const [question, setQuestion] = React.useState<string>('');
  const [grade, setGrade] = React.useState<string>('');

  const onEnter = async (e: KeyboardEvent) => {
    if (e.key != 'Enter') {
      return;
    }

    const gradeNum = parseInt(grade);

    if (question.length > 0 && gradeNum >= 1 && gradeNum <= 4) {
      const now = Timestamp.fromNs(await bridge.now());
      model.addAttempt({ question, date: now.asString(), grade: gradeNum });

      setQuestion('');
      setGrade('');
    }
  }

  return <div className='list-view'>
    <table>
      <thead>
        <tr>
          <td>Question</td>
          <td>Date</td>
          <td>Grade</td>
        </tr>
      </thead>
      <tbody>
        {
          file.attempts.map(a => <tr>
            <td>{a.question}</td>
            <td>{(new Date(a.date)).toLocaleDateString()}</td>
            <td>{a.grade}</td>
          </tr>)
        }
        <tr>
          <td><input type='text' value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => {
            onEnter(e.nativeEvent)
          }}></input></td>
          <td>----</td>
          <td><input type='text' value={grade} onChange={e => setGrade(e.target.value)} onKeyDown={e => {
            onEnter(e.nativeEvent)
          }}></input></td>
        </tr>
      </tbody>
    </table>
  </div>;
}