import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // const response = await axios.get('http://localhost:5000/api/notes'); // Adjust this to your backend route
        setNotes(response.data); // Assuming the response contains an array of notes
        console.log(response.data); // For debugging
      } catch (err) {
        setError('Failed to load notes');
        console.error(err); // For debugging
      }
    };

    fetchNotes();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Notes</h1>
      {notes.length === 0 ? (
        <p>No notes available</p>
      ) : (
        <ul>
          {notes.map((note, index) => (
            <li key={index}>
              <strong>{note.fileName}</strong> - {note.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyNotesPage;
