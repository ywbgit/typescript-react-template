import './style/reset.less';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Hello from './components/Hello';

ReactDOM.render(
  <Hello compiler='typescript' framework='react' />,
  document.getElementById('app')
);
