import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import ProjectsList from '../pages/ProjectsList';
import ProjectsSingle from '../pages/ProjectsSingle';
import Header from '../shared/Header';
import '../assets/css/app.css';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <div className="container">
          <Route path="/" exact component={ProjectsList} />
          <Route path="/project/:id" component={ProjectsSingle} />
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
