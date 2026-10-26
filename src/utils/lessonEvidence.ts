export interface TaskEvidence {
  input: 'written' | 'spoken';
  assisted: boolean;
  listening: boolean;
  technicalText: boolean;
  transcriptShown?: boolean;
}
export interface LessonEvidence {
  written: number;
  spoken: number;
  listeningIndependent: number;
  listeningAssisted: number;
  technicalText: number;
  textHelp: number;
}
export function summarizeEvidence(tasks: readonly { resolved: boolean; evidence?: TaskEvidence }[]): LessonEvidence {
  return tasks.reduce((sum, task) => {
    if (task.evidence?.technicalText) sum.technicalText++;
    else if (task.evidence?.transcriptShown) sum.textHelp++;
    if (!task.resolved || !task.evidence) return sum;
    const e = task.evidence;
    sum[e.input === 'spoken' ? 'spoken' : 'written']++;
    if (!e.technicalText && !e.transcriptShown && e.listening) sum[e.assisted ? 'listeningAssisted' : 'listeningIndependent']++;
    return sum;
  }, { written: 0, spoken: 0, listeningIndependent: 0, listeningAssisted: 0, technicalText: 0, textHelp: 0 });
}

export interface ExamEvidence { technicalTextIds: string[]; writtenVoiceIds: string[]; pendingRequiredIds: string[] }
