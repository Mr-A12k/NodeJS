import React ,{Fragment} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Product from './components/Product';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <App />
    <Product />
    </>
);


