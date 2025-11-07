import React, { useContext, useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { AuthContext } from '../../../context/AuthContext'
const Login = () => {
  const [currState,setCurrState] = useState("Sign up")
  const [fullName,setFullName]  = useState("");
  const [email,setEmail]  = useState("");
  const [password,setPassword]  = useState("");
  const [bio,setBio] = useState("hjefje");
  const [isDataSubmitted,setIsDataSubmitted]  = useState(false);

  const {login} = useContext(AuthContext);

  const OnSubmitHandler = (e) =>{
    e.preventDefault();

    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    };

    login(currState === "Sign up"?'signup' : 'login',{fullName,email,password,bio});
  };


  return (
    <div className='login'>
      <img src={assets.logo_big} alt="" className='logo' />

      <form onSubmit={OnSubmitHandler} className="login-form">
        <h2>{currState}</h2>
        {currState === "Sign up" ? <input type="text" onChange={(e)=>setFullName(e.target.value)} value={fullName} placeholder='username' className="form-input" required /> : null}
        <input type="email" onChange={(e)=>setEmail(e.target.value)} value={email} placeholder='Email address' className="form-input" required />
        <input type="password" onChange={(e)=>setPassword(e.target.value)} value={password} placeholder='password' className="form-input" required />
        <button type='submit'>{currState === "Sign up" ?"Create account":"Login now"}</button>
        <div className='login-term'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="login-forgot">
           {currState === "Sign up" ?
            <p className="login-toggle">Already have an account <span onClick={()=>setCurrState("Login")}>Login here</span></p>
            :<p className="login-toggle">Create an account <span onClick={()=>setCurrState("Sign up")}>click here</span></p>
           }
        </div>
      </form>
    </div>
  )
}

export default Login
