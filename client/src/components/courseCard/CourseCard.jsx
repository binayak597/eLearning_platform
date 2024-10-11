
import { useAuthContext } from "../../context/UserContext";
import "./courseCard.css";
import { server } from "../../main";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {

  const {isAuth, user} = useAuthContext();
  const navigate = useNavigate();
  return (
    <div className="course-card">
      <img src={`${server}/${course.image}`} alt="" className="course-image" />
      <h3>{course.title}</h3>
      <p>Instructor- {course.createdBy}</p>
      <p>Duration- {course.duration} weeks</p>
      <p>Price- ₹{course.price}</p>
      {isAuth ? (
        <>
          {user && user.role === "user" ? (
            <>
              {user.subscription.includes(course._id) ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="btn"
                >
                  Start 
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="btn"
                >
                  Get Started
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate(`/course/study/${course._id}`)}
              className="btn"
            >
              Study
            </button>
          )}
        </>
      ) : (
        <button onClick={() => navigate("/login")} className="btn">
          Get Started
        </button>
      )}
    </div>
  );
};

export default CourseCard;
