import React, { useState } from 'react';

const Home = () => {
  const [switt, setSwitt] = useState('');
  const onSubmit = (event) => {
    event.preventDefault();
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setSwitt(value);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={switt}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Sweeter" />
      </form>
    </div>
  );
};

export default Home;
