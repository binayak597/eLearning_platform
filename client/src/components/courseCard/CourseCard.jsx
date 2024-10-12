
import { useAuthContext } from "../../context/UserContext";
import "./courseCard.css";
import { server } from "../../main";
import { useNavigate } from "react-router-dom";
import { useCourseContext } from "../../context/CourseContext";
import toast from "react-hot-toast";
import axios from "axios";

const CourseCard = ({ course }) => {

  const {isAuth, user} = useAuthContext();
  const {fetchCourses} = useCourseContext();
  const navigate = useNavigate();

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this course")) {
      try {
        const { data } = await axios.delete(`/api/admin/course/delete/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        if(data.error) throw new Error(data.error);
        toast.success(data.message);
        await fetchCourses();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

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

      {user && user.role === "admin" && (
        <button
          onClick={() => deleteHandler(course._id)}
          className="btn"
          style={{ background: "red" }}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default CourseCard;
