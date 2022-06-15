import React, { useEffect } from 'react'
import { Fragment } from 'react';
import { CgMouse } from "react-icons/cg";
import ProductCard from './ProductCard';
import "./Home.css";
import MetaData from '../layout/MetaData';
import { clearErrors, getProduct } from '../../actions/productAction';
import { useSelector,useDispatch } from "react-redux"
import Loader from '../layout/loader/Loader';
import { useAlert } from 'react-alert';

// const product = {
//   name: "Blue Shirt",
//   images: [{url:"https://rukminim1.flixcart.com/image/714/857/jlsc58w0/shirt/8/e/n/xl-partywear-n-t-fashion-original-imaf8u2vs5guqjsa.jpeg?q=50"},],
//   price: "$3000",
//   _id: "Pratham"
// }

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  // the useSelector helps to divide data according to our needs
  // If we require loading , error , products ...etc then we can write it as follows
  const { loading , error , products } = useSelector(   // state to props func
    (state) => state.products
  )

  useEffect(()=>{
    if(error){
        alert.error(error);
        dispatch(clearErrors());
    }
    dispatch(getProduct());

  }, [dispatch , error , alert ]);

      return (
        <Fragment>
          {
            loading?
            <Loader />  : 
              <Fragment>
              <MetaData  title="Ecommerce"/>
              <div className="home__banner">
                  <p>Welcome to Ecommerce</p>
                  <h1>Find Amazing Products Below</h1>
                  <a href='#home__container'> <button> Scroll <CgMouse /> </button> </a>
              </div>
              <h2 className="home__heading"> Featured Products </h2>
    
              <div className="home__container" id="home__container">
                {products && products.map((product) => (
                  <ProductCard product = {product}/>
                ))}
              </div>
            </Fragment>
          }
        </Fragment>
      );
}

export default Home;



// 1:19:57