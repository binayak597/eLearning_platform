import { useEffect } from "react";
import "./coursestudy.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { server } from "../../main";
import { useCourseContext } from "../../context/CourseContext";

const CourseStudy = ({ user }) => {

  const params = useParams();

  const { fetchCourse, course } = useCourseContext();
  const navigate = useNavigate();

  if (user && user.role !== "admin" && !user.subscription.includes(params.id))
    return navigate("/");

  useEffect(() => {
    fetchCourse(params.courseId);
  }, []);
  return (
    <>
      {course && (
        <div className="course-study-page">
          <img src={`${server}/${course.image}`} alt="" width={350} />
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <p>By - {course.createdBy}</p>
          <p>Duration - {course.duration} weeks</p>
          <Link to={`/lectures/${course._id}`}>
            <h2 className="btn">Lectures</h2>
          </Link>
        </div>
      )}
    </>
  );
};

export default CourseStudy;
