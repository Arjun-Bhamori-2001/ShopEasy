import React,{useEffect,useState} from "react"
import Header from "./components/Layouts/Header"
import Footer from "./components/Layouts/Footer"
import Home from "./components/Home"
import ProcessOrder from "./components/admin/ProcessOrder"
import OrderSuccess from "./components/cart/OrderSuccess"
import ListOrders from "./components/order/ListOrders"
import OrdersList from "./components/admin/OrdersList"
import OrderDetails from "./components/order/OrderDetails"
import {BrowserRouter as Router, Route} from "react-router-dom"
import ProductDetails from "./components/Product/ProductDetails"
import Login from "./components/user/Login"
import Register from "./components/user/Register"
import {loadUser} from "./actions/userActions"
import store from "./store"
import Profile from "./components/user/Profile"
import ProtectedRoute from "./route/ProtectedRoute"
import UpdateProfile from "./components/user/UpdateProfile"
import UpdatePassword from "./components/user/UpdatePassword"
import ForgotPassword from "./components/user/ForgotPassword"
import NewPassword from "./components/user/NewPassword"
import Cart from "./components/cart/Cart"
import Shipping from "./components/cart/Shipping"
import ConfirmOrder from "./components/cart/ConfirmOrder"
import axios from "axios"
import Payment from "./components/cart/Payment"
import Dashboard from "./components/admin/Dashboard"
import ProductList from "./components/admin/ProductList"
import NewProduct from "./components/admin/NewProducts"
import UpdateProduct from "./components/admin/UpdateProduct"
import UsersList from "./components/admin/UsersList"
import UpdateUser from "./components/admin/UpdateUser"
import ProductReviews from "./components/admin/ProductReviews"


import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

function App() {

  
  const [stripeApiKey, setStripeApiKey] = useState('');

  useEffect(() => {
    store.dispatch(loadUser())

    async function getStripApiKey() {
      const { data } = await axios.get('/api/v1/stripeapi');

      setStripeApiKey(data.stripeApiKey)
    }

    getStripApiKey();

  }, [])



  return (
    <Router>
    <div className="App">
     <Header />
     <div className="container container-fluid">
     <Route path ="/" component={Home} exact />
     <Route path ="/search/:keyword" component={Home} exact />
     <Route path ="/product/:id" component={ProductDetails} exact />
     

      {stripeApiKey &&
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment" component={Payment} />
            </Elements>
      }


    <Route path ="/login" component={Login} exact />
    <Route path ="/register" component={Register} exact />
    <ProtectedRoute path ="/me" component={Profile} exact />
    <ProtectedRoute path ="/me/update" component={UpdateProfile} exact />
    <ProtectedRoute path ="/password/update" component={UpdatePassword} exact />
    <Route path ="/password/forgot" component={ForgotPassword} exact />
    <Route path ="/password/reset/:token" component={NewPassword} exact />


    <Route path ="/cart" component={Cart} exact />
    <ProtectedRoute path ="/shipping" component={Shipping} exact />
    <ProtectedRoute path ="/confirm" component={ConfirmOrder} exact />
    <ProtectedRoute path ="/success" component={OrderSuccess} exact />
    <ProtectedRoute path ="/orders/me" component={ListOrders} exact />
    <ProtectedRoute path ="/order/:id" component={OrderDetails} exact />


     </div>
     <ProtectedRoute path ="/dashboard" isAdmin={true} component={Dashboard} exact />
     <ProtectedRoute path ="/admin/products" isAdmin={true} component={ProductList} exact />
     <ProtectedRoute path ="/admin/product" isAdmin={true} component={NewProduct} exact />
     <ProtectedRoute path ="/admin/product/:id" isAdmin={true} component={UpdateProduct} exact />
     <ProtectedRoute path ="/admin/orders" isAdmin={true} component={OrdersList} exact />
     <ProtectedRoute path ="/admin/order/:id" isAdmin={true} component={ProcessOrder} exact />


     <ProtectedRoute path ="/admin/users" isAdmin={true} component={UsersList} exact />
     <ProtectedRoute path ="/admin/user/:id" isAdmin={true} component={UpdateUser} exact />
     <ProtectedRoute path ="/admin/reviews" isAdmin={true} component={ProductReviews} exact />
     <Footer/>
    </div>
    </Router>
  );
}

export default App;
