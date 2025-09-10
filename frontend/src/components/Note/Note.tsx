import { TrashIcon } from 'lucide-react';
import type { NoteModel } from '../../models/NoteModel';
import Button from '../Button/Button';
import styles from './Note.module.css';

type NoteProps = {
  note: NoteModel;
  onDelete: (id: number) => void;
  className?: string;
};

const Note = ({ note, onDelete, className }: NoteProps) => {
  const formattedDate = new Date(note.created_at).toLocaleString();

  return (
    <div className={className ?? styles.noteContainer}>
      <div className={styles.noteHeader}>
        <p className={styles.noteTitle}>{note.title}</p>
        <Button
          className={styles.deleteButton}
          onClick={() => onDelete(note.id)}
        >
          <TrashIcon />
        </Button>
      </div>
      <p className={styles.noteContent}>{note.content}</p>
      <p className={styles.noteDate}>{formattedDate}</p>
    </div>
  );
};

export default Note;
