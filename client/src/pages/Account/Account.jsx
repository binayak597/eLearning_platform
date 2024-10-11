import { MdDashboard } from "react-icons/md";
import "./account.css";
import { IoMdLogOut } from "react-icons/io";
import { useAuthContext } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Account = ({ user }) => {
  const navigate = useNavigate();
  const {setUser, setIsAuth} = useAuthContext();
  const logoutHandler = () => {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);
    toast.success("Logout successfully");
    navigate("/login");
  };
  return (
    <div>
      <div className="profile">
        <h2>My Profile</h2>
        <div className="profile-info">
          <p>
            <strong>Name - {user.name}</strong>
          </p>

          <p>
            <strong>Email - {user.email}</strong>
          </p>

          <div className="action-btn">
            <button onClick={() => navigate(`/${user._id}/dashboard`)} className="btn flex">
              <MdDashboard />
              Dashboard
            </button>

            <button
              className="btn flex"
              style={{ background: "red" }}
              onClick={logoutHandler}
            >
              <IoMdLogOut />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
