export type ExtractedSubQuestion = {
  label: string;
  text: string;
  hint?: string;
};

export type ExtractedChart = {
  title: string;
  xLabel: string;
  yLabel: string;
  categories: string[];
  yMax: number;
  legend?: string[];
};

export type ExtractedTable = {
  headers: string[];
  rows: string[][];
};

export type ExtractedSection = {
  number: string;
  instructions: string;
  table?: ExtractedTable | null;
  subQuestions: ExtractedSubQuestion[];
  chart?: ExtractedChart | null;
};

export type ExtractedWorksheet = {
  title: string;
  studentInfoFields: string[];
  sections: ExtractedSection[];
};
