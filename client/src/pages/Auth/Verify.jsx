import { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/UserContext";

const Verify = () => {
  const { btnLoading, verifyOtp } = useAuthContext();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const verifyOtpHandler = async (ev) => {
    ev.preventDefault();
    await verifyOtp(Number(otp), navigate);
  };
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

          <button disabled={btnLoading} type="submit" className="btn">
            {btnLoading ? "Loading" : "Verify"}
          </button>
        </form>
        <p>
          Go to <Link to="/login">Login</Link> page
        </p>
      </div>
    </div>
  );
};

export default Verify;
