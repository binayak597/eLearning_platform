
import { useEffect } from "react";
import { useCourseContext } from "../../context/CourseContext";
import "./coursedesc.css";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../../main";

const CourseDescription = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();


  const { fetchCourse, course } = useCourseContext();

  useEffect(() => {
    fetchCourse(params.courseId);
  }, []);


  return (
    <>
          {course && (
            <div className="course-description">
              <div className="course-header">
                <img
                  src={`${server}/${course.image}`}
                  alt=""
                  className="course-image"
                />
                <div className="course-info">
                  <h2>{course.title}</h2>
                  <p>Instructor: {course.createdBy}</p>
                  <p>Duration: {course.duration} weeks</p>
                </div>
              </div>

              <p>{course.description}</p>

              <p>Let's get started with course At ₹{course.price}</p>

              {user && user.subscription.includes(course._id) ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="btn"
                >
                  Start
                </button>
              ) : (
                <button className="btn">
                  Buy Now
                </button>
              )}
            </div>
          )}
        </>
  );
};

export default CourseDescription;
