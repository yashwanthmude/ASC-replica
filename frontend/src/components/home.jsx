import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./home.css";
import "./nav.css";
import Navbar from "./nav.jsx";



export default function Home() {
  const [user_info, setUser_info] = useState([]);
  const [current, setCurrent] = useState([]);
  const [prev, setPrev] = useState([]);
  

  //handle submit for drop button
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/home/drop", {
        course_id: event.target.value,
        year: current[0].year,
        semester: current[0].semester, 

      }, { withCredentials: true });
      if (response.status === 200) {
        // refresh the page

        window.location.href = "/home";
      }
    } catch (e) {
      if(e.response.status===401){
        window.location.href = "/login";
      }
    }
  };





  useEffect(() => {
    axios.get("http://localhost:5000/home", { withCredentials: true })
      .then((res) => {
        setUser_info(res.data.user_info);
        setCurrent(res.data.current);
        setPrev(res.data.prev);

      });
  }
    , []);

  return (
    <Fragment>
      <Navbar />

      <div className="home">
        <h1>Home</h1>
        <div className="user-info">
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th> Name</th>
                <th>Department</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {user_info.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.dept_name}</td>
                  <td>{user.tot_cred}</td>
                </tr>
              ))}
            </tbody>


          </table>

        </div>
        <div className="current-courses">
          <h2>Current Courses</h2>
          <table>
            <thead>
              <tr>
                <th>Course ID</th>
                <th>title</th>
                <th>year</th>
                <th>semester</th>
                <th>Drop</th>
              </tr>
            </thead>
            <tbody>
              {current.map((course) => (
                <tr key={course.course_id}>
                  <td>
                    <a href={`/course/${course.course_id}`}>
                      {course.course_id}
                    </a>

                  </td>
                  <td>{course.title}</td>
                  <td>{course.year}</td>
                  <td>{course.semester}</td>

                  <td>
                      <button type="submit" value={course.course_id} onClick={handleSubmit}>
                        Drop
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="previous-courses">
          <h2>Previous Courses</h2>


          <table>
            <thead>
              <tr>
                <th>Course ID</th>
                <th>title</th>
                <th>Grade</th>
                <th>year</th>
                <th>semester</th>
              </tr>
            </thead>
            <tbody>
              {prev.map((course) => (
                <tr key={course.course_id}>
                  <td>
                    <a href={`/course/${course.course_id}`}>
                      {course.course_id}
                    </a>
                  </td>
                  <td>{course.title}</td>
                  <td>{course.grade}</td>
                  <td>{course.year}</td>
                  <td>{course.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>


        </div>
      </div>
    </Fragment>
  );
}











