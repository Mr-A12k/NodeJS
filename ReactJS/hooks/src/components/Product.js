import React, { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const initialState = { count: 1 };

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count > 0 ? state.count - 1 : 0 };
    default:
      throw new Error();
  }
};

const Product = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/result', { state: { finalCount: state.count } });
  };

  return (
    <>
      <div className="product-card">
        <img src="https://media.istockphoto.com/id/1303978937/photo/white-sneaker-on-a-blue-gradient-background-mens-fashion-sport-shoe-sneakers-lifestyle.webp?b=1&s=170667a&w=0&k=20&c=MPOqUwkp7g0MawLUQsECgl1ME12YWNnqsFwracR9HQw=" alt="Product img" />
        <div className="product-info">
          <h1 className="product-name">Nike Air Force</h1>
          <p className="product-price">₹3999.00</p>
          <div className="product-quantity">
            <button className="quantity-btn1" onClick={() => dispatch({ type: 'decrement' })}>-</button>
            <span className="product-count">{state.count}</span>
            <button className="quantity-btn2" onClick={() => dispatch({ type: 'increment' })}>+</button>
          </div>
          <button className="buy-btn" onClick={handleSubmit}>Buy now</button>
        </div>
      </div>
    </>
  );
};

export default Product;
