import { dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
import Switt from './Switt';

const Home = ({ userObj }) => {
  const [switt, setSwitt] = useState('');
  const [switts, setSwitts] = useState([]);

  useEffect(() => {
    dbService.collection('switts').onSnapshot((snapshot) => {
      const swittArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSwitts(swittArray);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection('switts').add({
      text: switt,
      createdAt: Date.now(),
      createrId: userObj.uid,
    });
    setSwitt('');
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setSwitt(value);
  };
  return (
    <>
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
          <input type="submit" value="Switt" />
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
    </>
  );
};

export default Home;
