import { dbService, storageService } from 'fbase';
import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from 'react';
import Switt from '../components/Switt';

const Home = ({ userObj }) => {
  const [switt, setSwitt] = useState('');
  const [switts, setSwitts] = useState([]);
  const [attachment, setAttachment] = useState('');

  useEffect(() => {
    dbService
      .collection('switts')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const swittArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSwitts(swittArray);
      });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = '';
    if (attachment !== '') {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      // uuid는 랜덤 id를 생성해준다. npm install uuid & import 필요
      const response = await attachmentRef.putString(attachment, 'data_url');
      attachmentUrl = await response.ref.getDownloadURL();
      // console.log(response);
    }
    const swittObj = {
      text: switt,
      createdAt: Date.now(),
      createrId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection('switts').add(swittObj);
    setSwitt('');
    setAttachment('');
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setSwitt(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const imgReader = new FileReader();
    imgReader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    imgReader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => setAttachment('');

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={switt}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
          autoFocus
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Switt" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {switts.map((switt) => (
          <Switt
            key={switt.id}
            swittObj={switt}
            isOwner={switt.createrId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
