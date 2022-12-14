import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "../styles/cart.css";
import { addCart, ADDCART, style, updateCart } from "../redux/Action";
import { Link } from "react-router-dom";
import {CiLogIn} from 'react-icons/fi'
export const Cart = () => {
  const { cart } = useSelector((state) => state);
  const Auth   = useSelector((store) => store.isAuth)

  let dispatch = useDispatch();

  const getCartData = useCallback(async () => {
    if(Auth){
      let response = await axios.get(`https://localhost:8080/cart`);
      dispatch(addCart(response.data));
    }
  });

  const handleAdd = async (cartItem, val) => {
    console.log(val);
    let quantity = cartItem.quantity + val;
    const product = { ...cartItem, quantity };

    let response = await axios.put(
      `https://localhost:8080/cart/${cartItem.id}`,
      product,
      { mode: "cors" }
    );
    dispatch(updateCart(response.data));
    getCartData();
  };

  useEffect(() => {
    const abortController = new AbortController();
      getCartData();
    return () => {
      abortController.abort();
    };
  }, []);

  const handleDelete = (element) => {
    axios
      .delete(`https://localhost:8080/cart/${element.id}`, {
        headers: {
          "x-access-token": "token-value",
        },
      })
      .then(() => getCartData());
  };

   if(Auth === false){
        return <div className="login__wrapper">
            <h1>Please Login</h1>
            <Link to={`/login`} className="login"  onClick = {() => dispatch(style({div1:"inactive", div2:"inactive", div3:"active"}))} >
                  <p>Login</p>
                  <div><CiLogIn /></div>
            </Link>
            </div>
    }
  return (
    <div>
      { cart.length == 0 ? (
        <div>Please Do the shopping 

        </div>
      ) : (
        cart.map((element) => {
          return (
            <div className="cart" key={element.id}>
              <div>{element.id} </div>

              <div> {element.quantity} </div>

              <button
                disabled={element.quantity > 9}
                onClick={() => handleAdd(element, 1)}
              >
                increase
              </button>

              <button
                disabled={element.quantity < 1}
                onClick={() => handleAdd(element, -1)}
              >
                decrease
              </button>

              <button onClick={() => handleDelete(element)}>remove</button>
            </div>
          );
        })
      )}

      <button>Make Payment</button>
    </div>
  );
};
