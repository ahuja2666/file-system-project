import "./login.css"
import { useEffect } from "react";
const Login = () => {

  const handelCallBack = (response) => {
    localStorage.setItem("token", response.credential);
    localStorage.setItem("loggedin", "true");
    window.location = "/";
  }

  useEffect(() => {

    window.google.accounts.id.initialize({
      client_id: "365697724372-iosgnj9lvabjoo2a56fim73bnu5t7odh.apps.googleusercontent.com",
      callback: handelCallBack
    });

    window.google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    );

    window.google.accounts.id.prompt();
  }, []);

  return (
    <div className="login-conatiner">
      <div className="sb-container">
        <div className="wlcom-ctn">
          <h1 className="heading">Welcome to File System</h1>
          <p className="para">Enjoy Free Unlimited Cloud Storage</p>
          <p className="para">Upload Any file or download files uploaded by the community</p>

        </div>
        <div className="login-ctn">
          <h2>Sign in with Google to Enjoy our services </h2>
          <div id="signInDiv"></div>
        </div>
      </div>
    </div>
  )
}

export default Login;