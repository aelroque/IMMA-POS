import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [clockState, setClockState] = useState();
  const [dateState, setDateState] = useState();

  useEffect(() => {
    setInterval(() => {
      const date = new Date();
      setClockState(date.toLocaleTimeString());
      setDateState(date.toDateString());
    }, 1000);
  }, []);

  return (
    <footer>
      <h3 className="text-white text-center">
        {clockState} {dateState}
      </h3>
      <div className="text-white text-center py-3">
        immature &copy; All rights reserved. afourrs. 2022
      </div>
    </footer>
  );
};

export default Footer;
