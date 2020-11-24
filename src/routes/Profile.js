import { authService, dbService } from 'fbase';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Profile = ({ userObj }) => {
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push('/');
    // history를 사용하거나, Router.js에서 Redirect를 사용가능.
  };

  const getMySwitts = async () => {
    const switts = await dbService
      .collection('switts')
      .where('createrId', '==', userObj.uid)
      .orderBy('createdAt')
      .get();
    console.log(switts.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    getMySwitts();
  }, []);

  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
