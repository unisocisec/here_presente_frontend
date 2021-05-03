
import React from 'react';

import './styles.css';
import trademark from '../../images/trademark.png';

export default function topBar() {
  return (
    <aside className="topBar">
      <img id="trademark" src={trademark} alt="trademark"/>
    </aside>
  );
}