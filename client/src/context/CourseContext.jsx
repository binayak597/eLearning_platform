import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [subscribedCourses, setSubscribedCourses] = useState([]);

  async function fetchCourses() {
    try {
      const { data } = await axios.get("/api/course/all");
      setCourses(data.courses);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  async function fetchCourse(id) {
    try {
      const { data } = await axios.get(`/api/course/${id}`);
      setCourse(data.course);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
  
  async function fetchSubscribedCourses() {
    try {
      const { data } = await axios.get("/api/course/mycourse", {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setSubscribedCourses(data.courses);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  useEffect(() => {
    fetchCourses();
    fetchSubscribedCourses();
  }, []);

  return (
    <CourseContext.Provider
      value={{
        courses,
        fetchCourses,
        fetchCourse,
        course,
        setCourse,
        subscribedCourses,
        fetchSubscribedCourses
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourseContext = () => useContext(CourseContext);
