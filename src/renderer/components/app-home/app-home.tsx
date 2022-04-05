import { Component, h, State } from '@stencil/core';
import { parse } from 'csv-parse/dist/esm/sync';

const bridge = globalThis.bridge;

interface Attempt {
  date: string;
  grade: number;
}

const palette = ['#6da2ff', '#83ff6d', '#ffd56d', '#ff6d6d'];

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true,
})
export class AppHome {
  @State() data;
  @State() questions: { [key: string]: Attempt[] } = {};

  async onOpen() {
    const file = await bridge.openFile();

    if (file != null) {
      const content = await bridge.readFile(file);
      this.data = parse(content);

      const questions = {};

      for (const attempt of this.data) {
        if (questions[attempt[0]] == null) {
          questions[attempt[0]] = [];
        }

        questions[attempt[0]].push({ date: attempt[1], grade: parseInt(attempt[2]) });
      }

      this.questions = questions;
    }
  }

  render() {
    let entries = Object.entries(this.questions);
    entries.sort((a, b) => a[0].localeCompare(b[0], 'en', { numeric: true }));

    return (
      <main>
        <div>
          <button onClick={this.onOpen.bind(this)}>Open</button>
        </div>
        <table id="board">{entries.map(([name, attempts]) =>
          <tr><td class="question-name">{name}</td>{attempts.map(a => <td class="cell" style={{ backgroundColor: palette[a.grade - 1] }}>{a.grade}</td>)}</tr>
        )}</table>
      </main>
    );
  }
}