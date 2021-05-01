import {createStore,combineReducers,applyMiddleware} from "redux"
import thunk from "redux-thunk"
import {composeWithDevTools} from "redux-devtools-extension" 
import { productsReducer,productDetailsReducer, newReviewReducer,reviewReducer,
   newProductReducer,productReducer,productReviewsReducer} from "./reducers/productsReducer"
import {authReducer,userReducer,forgotPasswordReducer,allUsersReducer,userDetailsReducer} from "./reducers/userReducer"
import {cartReducer} from "./reducers/cartReducers"
import {newOrderReducer,myOrdersReducer,orderDetailsReducer,allOrdersReducer,orderReducer} from "./reducers/orderReducers"


const reducer = combineReducers({
   products : productsReducer,
   productDetails : productDetailsReducer,
   auth : authReducer,
   user : userReducer,
   forgotPassword : forgotPasswordReducer,
   cart : cartReducer,
   newOrder : newOrderReducer,
   myOrders : myOrdersReducer,
   newReview: newReviewReducer,
   orderDetails : orderDetailsReducer,
   product : productReducer,
   newProduct : newProductReducer,
   allOrders : allOrdersReducer,
   order : orderReducer,
   userDetails: userDetailsReducer,
   productReviews : productReviewsReducer,
   review: reviewReducer,
   allUsers : allUsersReducer

})

const middleware = [thunk]
let initialState = {
 cart: {
      cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')): [],
      shippingInfo : localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')): {}
 }  
}

const store = createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)))

export default store

