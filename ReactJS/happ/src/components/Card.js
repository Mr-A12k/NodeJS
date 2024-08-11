import React, {Fragment} from "react";
import App from "../App";

function Card() {
    const [counter, setCounter] = useState(1);
  return (
    <>
      <div className='product-card'>
        <img src="https://media.istockphoto.com/id/1303978937/photo/white-sneaker-on-a-blue-gradient-background-mens-fashion-sport-shoe-sneakers-lifestyle.webp?b=1&s=170667a&w=0&k=20&c=MPOqUwkp7g0MawLUQsECgl1ME12YWNnqsFwracR9HQw=" alt="Product img" />
        <div className='product-info'>
          <h1 className='product-name'>Nike Air Force</h1>
          <p className='product-price'>₹3999.00</p>
          <div className='product-quantity'>
            <button onClick={()=>setCounter(counter>1?counter-1:counter)} className='quantity-btn2'>-</button>
            <div>
              {counter}
            </div>
            <button onClick={()=>setCounter(counter+1)} className='quantity-btn2'>+</button>
          </div>
          <button onClick={()=>alert("Next page!")} className='buy-btn'>Buy now</button>
        </div>
      </div>
    </>
  );
}