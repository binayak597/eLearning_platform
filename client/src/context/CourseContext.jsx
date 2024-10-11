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
      if(data.error) throw new Error(data.error);
      setCourses(data.courses);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function fetchCourse(id) {
    try {
      const { data } = await axios.get(`/api/course/${id}`);
      if(data.error) throw new Error(data.error);
      setCourse(data.course);
    } catch (error) {
      console.log(error.message);
    }
  }
  
  async function fetchSubscribedCourses() {
    try {
      const { data } = await axios.get("/api/course/mycourse", {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if(data.error) throw new Error(data.error);
      setSubscribedCourses(data.courses);
    } catch (error) {
      console.log(error.message);
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
