import { doLogin } from "./Web3Service";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [message, setMessage] = useState("");
  const [msgColor, setMsgColor] = useState("");
  const messageStyle = { color: msgColor };
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("account") !== null)
        redirectAfterLogin(localStorage.getItem("isAdmin") === "true");
  });

  function redirectAfterLogin(isAdmin: boolean) {
    if (isAdmin)
      navigate("/admin");
    else
      navigate("/app");
  }

  function onBtnClicked() {
    setMessage("Logging in...");
    doLogin()
        .then(result => redirectAfterLogin(result.isAdmin))
        .catch(err => { setMsgColor("red"); setMessage(err); });
  }

  return (
    <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
      <header className="mb-auto">
        <div>
          <h3 className="float-md-start mb-0">Dapp JoKenPo</h3>
          <nav className="nav nav-masthead justify-content-center float-md-end">
            <a className="nav-link fw-bold py-1 px-0 active" aria-current="page" href="#">Home</a>
            <a className="nav-link fw-bold py-1 px-0" href="#">About</a>
          </nav>
        </div>
      </header>

      <main className="px-3">
        <h1>Login and play with us</h1>
        <p className="lead">Play Rock-Paper-Scissors and earn prizes.</p>
        <p className="lead">
          <a href="#" onClick={onBtnClicked} className="btn btn-lg btn-light fw-bold border-white bg-white">
            <img src="/assets/metamask.svg" alt="Metamask Logo" width={48}/>
            Login with MetaMask
          </a>
        </p>
        <div style={{ display: "inline-flex" }}>
        </div>
        <p className="lead" style={messageStyle}>
          {message}
        </p>
      </main>

      <footer className="mt-auto text-white-50">
        <p>Build by <a href="https://www.linkedin.com/in/joaovic/" className="text-white">joaovic</a>.</p>
      </footer>
    </div>
  );
}

export default Login;