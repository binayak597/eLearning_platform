import { useState } from "react";
import "./auth.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/forgot", { email });
    
      if(data.error) throw new Error(data.error);
      toast.success(data.message);
      navigate("/login");
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.message);
      setBtnLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="text">Enter Email</label>
          <input
            type="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            required
          />
          <button disabled={btnLoading} className="btn">
            {btnLoading ? "Loading" : "Forgot Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
