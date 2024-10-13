import { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/UserContext";
import ReCAPTCHA from "react-google-recaptcha";

const Verify = () => {
  const { btnLoading, verifyOtp } = useAuthContext();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [show, setShow] = useState(false);

  const verifyOtpHandler = async (ev) => {
    ev.preventDefault();
    await verifyOtp(Number(otp), navigate);
  };

  function onChange(value) {
    console.log("Captcha value:", value);
    setShow(true);
  }


  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Verify Account</h2>
        <form onSubmit={verifyOtpHandler}>
          <label htmlFor="otp">Otp</label>
          <input
            type="text"
            value={otp}
            onChange={(ev) => setOtp(ev.target.value)}
            required
          />

          <ReCAPTCHA sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" onChange={onChange} />

          {show && <button disabled={btnLoading} type="submit" className="btn">
            {btnLoading ? "Loading" : "Verify"}
          </button>}

        </form>
        <p>
          Go to <Link to="/login">Login</Link> page
        </p>
      </div>
    </div>
  );
};

export default Verify;
