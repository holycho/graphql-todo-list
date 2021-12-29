import logo from './logo.svg';
import './App.css';

import apolloClient from './utils/apolloSetup';
import { ApolloProvider } from '@apollo/client';
import ToDoList from './components/todoList'
import AddToDoInput from './components/todoInput'
import { useState } from 'react';

function App() {
  const [selectedToDo, setSelectedToDo] = useState({})

  const handleSelectedToDo = toDo => {
    // console.log('[App]', toDo);
    setSelectedToDo(toDo);
  }

  const handleClearToDo = () => {
    setSelectedToDo({});
  }

  return (
    <ApolloProvider client={apolloClient}>
      <AddToDoInput selectedToDo={selectedToDo} onClearToDo={handleClearToDo} />
      <hr/>
      <div className='title'>ToDo List</div>
      <ToDoList onToDoSelected={handleSelectedToDo} />
    </ApolloProvider>
  );
}

export default App;
