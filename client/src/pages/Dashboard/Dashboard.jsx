
import CourseCard from "../../components/courseCard/CourseCard";
import { useCourseContext } from "../../context/CourseContext";
import "./dashboard.css";


const Dashboard = () => {
  const {subscribedCourses} = useCourseContext();
  return (
    <div className="student-dashboard">
      <h2>All Enrolled Courses</h2>
      <div className="dashboard-content">
        {subscribedCourses && subscribedCourses.length > 0 ? (
            subscribedCourses.map((c) => <CourseCard key={c._id} course={c} />)
        ) : (
          <p>No course Enrolled Yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
