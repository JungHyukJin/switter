import { dbService } from 'fbase';
import React, { useState } from 'react';

const Switt = ({ swittObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newSwitt, setNewSwitt] = useState(swittObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this switt?');
    // console.log(ok);
    if (ok) {
      await dbService.doc(`switts/${swittObj.id}`).delete();
    }
  };
  const onToggleEditing = () => {
    setEditing((prev) => !prev);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`switts/${swittObj.id}`).update({
      text: newSwitt,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewSwitt(value);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your switt"
              value={newSwitt}
              required
              onChange={onChange}
            />
            <input type="submit" value="Update" />
          </form>
          <button onClick={onToggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{swittObj.text}</h4>
          {swittObj.attachmentUrl && (
            <img alt="?" src={swittObj.attachmentUrl} width="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={onToggleEditing}>Edit Switt</button>
              <button onClick={onDeleteClick}>Delete Switt</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Switt;
