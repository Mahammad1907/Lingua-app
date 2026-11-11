import type { PropsWithChildren, ReactNode } from 'react';
import LessonSheet from './LessonSheet';
import { LessonButton } from './ApprovedLessonSurface';
export default function LessonExplanationCard({ visible, onClose, children, title = 'Mənə başa sal', action }: PropsWithChildren<{ visible: boolean; onClose: () => void; title?: string; action?: ReactNode }>) {
  return <LessonSheet visible={visible} onClose={onClose} title={title} action={action} footer={<LessonButton label="Başa düşdüm" onPress={onClose} />}>{children}</LessonSheet>;
}
