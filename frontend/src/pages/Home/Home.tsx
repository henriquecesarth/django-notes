import { useState, useEffect } from 'react';
import api from '../../utils/api';
import type { NoteModel } from '../../models/NoteModel';
import Input from '../../components/Input/Input';
import TextArea from '../../components/TextArea/TextArea';
import Note from '../../components/Note/Note';
import styles from './Home.module.css';

const Home = () => {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

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
        if (res.status === 201) alert('Note created.');
        else alert('Failed to create note.');
        getNotes();
      })
      .catch((err) => alert(err));
  };

  return (
    <>
      <div className={styles.notesSection}>
        <h2>Notes</h2>
        {notes.map((note) => (
          <Note className={styles.note} key={note.id} note={note} onDelete={deleteNote} />
        ))}
      </div>
      <form className={styles.form} onSubmit={createNote}>
        <h2>Create a Note</h2>
        <Input
          id='note-title'
          className={styles.formInput}
          labelClassName={styles.formLabel}
          labelText='Title:'
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          id='note-content'
          className={styles.formTextArea}
          labelClassName={styles.formLabel}
          labelText='Content:'
          value={content}
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
    </>
  );
};

export default Home;
