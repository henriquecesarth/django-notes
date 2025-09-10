import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import type { NoteModel } from '../../models/NoteModel';
import Input from '../../components/Input/Input';
import TextArea from '../../components/TextArea/TextArea';
import Note from '../../components/Note/Note';
import styles from './Home.module.css';
import { PlusIcon, XIcon } from 'lucide-react';

const Home = () => {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [createModalNote, setCreateModalNote] = useState(false);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get('api/notes/')
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id: number) => {
    api
      .delete(`api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert('Note deleted.');
        else alert('Failed to delete note.');
        setNotes(notes.filter((note) => note.id !== id));
      })
      .catch((err) => alert(err));
  };

  const createNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api
      .post('api/notes/', { title, content })
      .then((res) => {
        if (res.status === 201) {
          alert('Note created.');
          setTitle('');
          setContent('');
          setCreateModalNote(false);
          getNotes();
        } else alert('Failed to create note.');
      })
      .catch((err) => alert(err));
  };

  const handleClick = () => {
    setCreateModalNote(!createModalNote);
  };

  return (
    <>
      <div className={styles.container}>
        {createModalNote && (
          <form className={styles.form} onSubmit={createNote}>
            {createModalNote && (
              <XIcon className={`${styles.icon}`} onClick={handleClick} />
            )}
            <h2>Create a Note</h2>
            <Input
              id='note-title'
              labelClassName={styles.formLabel}
              labelText='Title'
              type='text'
              value={title}
              placeholder='Enter a title'
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextArea
              id='note-content'
              labelClassName={styles.formLabel}
              labelText='Content'
              value={content}
              placeholder='Enter content'
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <Input
              id='note-submit'
              className={styles.formInputSubmit}
              type='submit'
              value='Submit'
            />
          </form>
        )}
        <div className={styles.notesSection}>
          <div className={styles.notesSectionHeading}>
            <h2>Notes</h2>
            {!createModalNote && (
              <PlusIcon
                className={`${styles.icon} ${styles.green}`}
                onClick={handleClick}
              />
            )}
          </div>

          {notes.map((note) => (
            <Note
              className={styles.note}
              key={note.id}
              note={note}
              onDelete={deleteNote}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
