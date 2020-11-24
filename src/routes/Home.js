import { dbService, storageService } from 'fbase';
import React, { useEffect, useState } from 'react';
import Switt from '../components/Switt';
import SwittFactory from 'components/SwittFactory';

const Home = ({ userObj }) => {
  const [switts, setSwitts] = useState([]);

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

  return (
    <div className="container">
      <SwittFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
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
