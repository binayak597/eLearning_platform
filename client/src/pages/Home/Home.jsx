
import { useNavigate } from "react-router-dom";
import "./home.css";
import Testimonial from "../../components/testimonials/Testimonial";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="home">
        <div className="home-content">
          <h1>Welcome to our Learn Cort</h1>
          <p>Learn, Excel and Get Opportunities</p>
          <button onClick={() => navigate("/courses")} className="btn">
            Get Started
          </button>
        </div>
      </div>
      <Testimonial />
    </div>
  );
};

export default Home;
