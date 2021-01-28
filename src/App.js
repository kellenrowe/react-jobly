import './App.css';
import "bootstrap/dist/css/bootstrap.css";

import JoblyApi from "./api";

import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import NavBar from "./NavBar";
import Routes from "./Routes";

/** Renders Jobly App
 * 
 *  state:
 *  - user: object like -
 *      { username, 
 *        firstName, 
 *        lastName, 
 *        isAdmin, 
 *        applications
 *      } 
 *    where applications is array of job ids like:
 *      [ id, etc. ]
 *  - userInputs: object like 
 *      if signing up, { username, password, firstName, lastName, email}
 *      if logging in, { username, password }
 *      if updating user, { firstName, lastName, email, password } 
 *  - token: string of JWT token for user
 *  - error: array of error messages
 *  - isSigningUp: Boolean, true if user is signing up
 *  - isLoggingIn: Boolean, true if user is logging in
 *  - isUpdating: Boolean, true if user is updating
 * 
 *  App -> { NavBar, Routes }
 */
function App() {
  // NOTE: Question about number of states?
  const [user, setUser] = useState({});
  const [userInputs, setUserInputs] = useState({});
  // const [appliedJob, setAppliedJob] = useState({});
  const [token, setToken] = useState("");
  const [error, setError] = useState([]);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  // const [isApplying, setIsApplying] = useState(false);
  // const [isSuccess, setIsSuccess] = useState(false);
  JoblyApi.token = token;

  /** Sign up user by using provided userData like
   *  { username, password, firstName, lastName, email } 
   *  */
  function signupUser(userInputs) {
    setUserInputs(userInputs);
    setIsSigningUp(true);
  }

  /** Login user by using provided userData like 
   *  { username, password }
   * */
  function loginUser(userInputs) {
    setUserInputs(userInputs);
    setIsLoggingIn(true);
  }

  /** TODO: Update user by using provided userData like
   *  { firstName, lastName, password, email }
   *  */
  function updateUser(userInputs) {
    // setUserInputs(userInputs);
    // setIsUpdating(true);
  }

  /** Logout user by returning user to initialState */
  function logoutUser() {
    setUser({});
    setUserInputs({});
    setToken("")
    // setIsSuccess(false);
  }

  /** TODO: Adds job applied to user */
  function applyToJob(jobId) {
    console.log("applied to ", jobId);
    // setAppliedJob(jobId);
    // setIsApplying(true);
  }

  /** Get a token for login, register, or updated profile of user with userinnputs */
  useEffect(function fetchTokenOnRender() {
    async function fetchToken() {
      try {
        if (isSigningUp === true) {
          let resp = await JoblyApi.signupUser(userInputs);
          resp = resp.token;
          setToken(resp);
          // setIsSuccess(true);
        }
        if (isLoggingIn === true) {
          let resp = await JoblyApi.loginUser(userInputs);
          resp = resp.token;
          setToken(resp);
          // setIsSuccess(true);
        }
      } catch (err) {
        setError(err);
      }
      setIsSigningUp(false);
      setIsLoggingIn(false);
    }
    fetchToken();
  }, [userInputs]);

  /** get user information for current username */
  useEffect(function fetchUserOnRender() {
    async function fetchUser() {
      try {
        if ((isUpdating === false) && (token.length !== 0)) {
          const newUser = await JoblyApi.getUser(userInputs.username);
          setUser(newUser.user);
        }
      } catch (err) {
        setError(err);
      }
    }
    fetchUser();
  }, [token, isUpdating]);

  /** update user when profile form is submitted  */
  // useEffect(function fetchUserOnProfileUpdate() {
  //   async function fetchUserProfileUpdate() {
  //     try {
  //       await JoblyApi.updateUser(userInputs);
  //     } catch (err){
  //       setError(err);
  //     }
  //     setIsUpdating(false);
  //   }
  //   fetchUserProfileUpdate();
  // }, [userInputs]);

  /** apply to job if user clicks on "apply" button */
  // useEffect(function applyToJobOnClick() {
  //   async function applyToJob() {
  //     let resp;
  //     try {
  //       resp = await JoblyApi.applyToJob(user.username, appliedJob);
  //     } catch (err) {
  //       setError(err);
  //     }
  //   }
  //   fetchUpdatedUser();
  // }, [isApplying]);


  // TODO: Show error messages to user
  if (error) console.log(error);

  // TODO: Incorporate a message for successful login or register of user
  // if (isSuccess)

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar user={user}
          logoutUser={logoutUser}
        />
        <Routes
          user={user}
          signupUser={signupUser}
          loginUser={loginUser}
          updateUser={updateUser}
          applyToJob={applyToJob}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
