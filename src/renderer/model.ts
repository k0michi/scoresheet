import produce from "immer";
import { Observable } from "kyoka";
import { v4 as uuidv4 } from 'uuid';

export interface Attempt {
  question: string;
  date: string;
  grade: number;
}

export interface File {
  path: string | undefined;
  attempts: Attempt[];
  unsaved: boolean;
}

export default class Model {
  file = new Observable<File>({ path: undefined, attempts: [], unsaved: false });

  constructor() {
  }

  setFile(file: File) {
    this.file.set(file);
  }

  async save() {
    const file = this.file.get();
    let path = file?.path;

    if (path == undefined) {
      path = await bridge.saveDialog();
    }

    if (path == undefined) {
      // Canceled
      return;
    }

    await bridge.writeFile(path, JSON.stringify(file?.attempts));

    this.file.set(produce(this.file.get()!, d => {
      d.path = path;
      d.unsaved = false;
    }));
  }

  addAttempt(attempt: Attempt) {
    this.file.set(produce(this.file.get()!, d => {
      d.attempts.push(attempt);
      d.unsaved = true;
    }));
  }
}