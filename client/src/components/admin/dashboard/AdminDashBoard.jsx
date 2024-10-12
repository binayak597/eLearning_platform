import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../utils/Layout";
import axios from "axios";
import "./admindashboard.css"

const AdminDashbord = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.role !== "admin") return navigate("/");

  const [stats, setStats] = useState([]);

  async function fetchStats() {
    try {
      const { data } = await axios.get("/api/admin/stats", {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if(data.error) throw new Error(data.error);
      setStats(data.stats);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <Layout>
        <div className="main-content">
          <div className="box">
            <p>Total Courses</p>
            <p>{stats.totalCoures}</p>
          </div>
          <div className="box">
            <p>Total Lectures</p>
            <p>{stats.totalLectures}</p>
          </div>
          <div className="box">
            <p>Total Users</p>
            <p>{stats.totalUsers}</p>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default AdminDashbord;
