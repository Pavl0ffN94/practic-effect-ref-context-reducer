import React, { useState, useReducer, useEffect, useContext, useRef} from "react";

import Card from "../UI/Card/Card";
import styles from "./Login.module.css";
import Button from "../UI/Button/Button";
import { AuthContext } from "../../store/auth-context";
import { InputField } from "./InputField";

const emailReducer = (prevState, action) => {
  if(action.type === 'USER_INPUT') {
    return {
      value: action.value,
      isValid: action.value.includes('@')
    };
  }
  if(action.type === 'INPUT_BLUR'){
    return {
      value: prevState.value,
      isValid: prevState.value.includes('@')
  }    
  }
  return {
    value: '',
    isValid: false
  };
}

const passwordReducer = (prevState, action) => {
  if(action.type === 'USER_INPUT') {
    return {
      value: action.value,
      isValid: action.value.trim().length > 7
    };
  }
  if(action.type === 'INPUT_BLUR'){
    return {
      value: prevState.value,
      isValid: prevState.value.trim().length > 7
  }    
  }
  return {
    value: '',
    isValid: false
  };
}

const Login = () => {
  // const [inputEmail, setInputEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [inputPassword, setInputPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);
  const [emailState, dispatchEmailState] = useReducer(emailReducer, {value: '', isValid: null});
  const [passwordState, dispatchPassworState] = useReducer(passwordReducer, {value: '', isValid: null});

  const {isValid: emailIsValide} = emailState;
  const {isValid: passwordIsValide} = passwordState;
  const ctx = useContext(AuthContext);
  const emailInputRef = useRef();
  const passwordlInputRef = useRef();

  const emailChangeHandler = (event) => {
    dispatchEmailState({type: 'USER_INPUT', value: event.target.value})
    // setFormIsValid(
    //   event.target.value.includes('@') && passwordState.isValid
    //  );
  };

  const passwordChangeHandler = (event) => {
    dispatchPassworState({type: 'USER_INPUT', value: event.target.value})

    // setFormIsValid(
    //   event.target.value.trim().length > 7 && emailState.isValid
    //  );
  };

  const validateEmailHandler = () => {
   dispatchEmailState({type: 'INPUT_BLUR'})
  };

  const validatePasswordHandler = () => {
    dispatchPassworState({type: 'INPUT_BLUR'})
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if(formIsValid){
      ctx.onLogin(emailState.value, passwordState.value);
    } else if (!emailIsValide){
      emailInputRef.current.focus();
    }else {
      passwordlInputRef.current.focus();
    } 
  };

  useEffect(()=> {
    const timer = setTimeout(()=>{
      setFormIsValid(
        emailIsValide && passwordIsValide
      );
    }, 500)
    return ()=>{
      clearTimeout(timer)
    };
  },[emailIsValide, passwordIsValide])

  return (
    <Card className={styles.login}>
      <form onSubmit={submitHandler}>
        <InputField
        ref={emailInputRef}
        id = 'email'
        type='email'
        label='email'
        value= {emailState.value}
        isValid = {emailIsValide}
        onChange={emailChangeHandler}
        onBlur= {validateEmailHandler}
         />

         <InputField 
          ref={passwordlInputRef}
          id = 'password'
          type='Пароль'
          label='password'
          value= {passwordState.value}
          isValid = {passwordIsValide}
          onChange={passwordChangeHandler}
          onBlur= {validatePasswordHandler}/>
       
        <div className={styles.actions}>
          <Button type="submit" className={styles.btn}>
            Вход
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
