export type Cell = string | number | string[];

export interface Dataset {
  title: string;
  header: string[];
  data: Cell[][];
}

export interface Diagnostic {
  /** Short name shown in the UI while the diagnostic is running. */
  title: string;
  /** Resolves to one table, or several (e.g. one per host). */
  run(): Promise<Dataset | Dataset[]>;
}
