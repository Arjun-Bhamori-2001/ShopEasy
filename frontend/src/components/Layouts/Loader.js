// import React from  "react"

// function Loader(){
//     return (<div className="loader"></div>);
// }

// export default Loader

import React from "react";
import {Spinner} from 'react-bootstrap'

const Loader = () => {
  return (
    <Spinner 
        animation='border'
        role='status'
        style={{
            width: '100px',
            height: '100px',
            margin: '200px auto',
            display:'block',
            color:'#00917C'
        }}
    >
        <span className='sr-only'>Loading...</span>
    </Spinner>
)
}

export default Loader;