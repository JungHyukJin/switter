import { dbService, storageService } from 'fbase';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const Switt = ({ swittObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newSwitt, setNewSwitt] = useState(swittObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this switt?');
    // console.log(ok);
    if (ok) {
      await dbService.doc(`switts/${swittObj.id}`).delete();
      await storageService.refFromURL(swittObj.attachmentUrl).delete();
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
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              placeholder="Edit your switt"
              value={newSwitt}
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input type="submit" value="Update" className="formBtn" />
          </form>
          <span onClick={onToggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{swittObj.text}</h4>
          {swittObj.attachmentUrl && <img src={swittObj.attachmentUrl} />}
          {isOwner && (
            <div class="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={onToggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Switt;
