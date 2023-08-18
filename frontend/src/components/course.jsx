import React, { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from './nav';
export default function Course() {
    const [course_info, setCourse_info] = useState([]);
    const [course_prereq, setCourse_prereq] = useState([]);
    const [course_instructor, setCourse_instructor] = useState([]);
    const { course_id } = useParams()
    

    useEffect(() => {
        axios.get('http://localhost:5000/course/' + course_id, {withCredentials: true})
            .then(res => {
                console.log(res.data)
                setCourse_info(res.data.course_info)
                setCourse_prereq(res.data.course_prereq)
                setCourse_instructor(res.data.course_instructor)
                if(res.status === 401){
                    window.location.href = "/login";
                }
                console.log(res.status);
            })
            .catch(err => {
                console.log(err.response.status);
            })
    }, [])

    return (
        <div className="course">
            <Navbar/>
            <h1>Course</h1>

            {course_info.map((item, index) => (
                <>
                    <p>Name: {item.title}{'('}{item.course_id}{')'}</p>
                    <p>Department: {item.dept_name}</p>
                </>
            ))}

            
            PRE-REQUISITES
            <>
                {course_prereq.map((item, index) => {
                    return <a href={"/course/" + item.prereq_id}>
                        {item.prereq_id}
                    </a>
                })}
            </>

            INSTRUCTOR
            <>
                <table>
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>year</th>
                            <th>semester</th>
                        </tr>
                    </thead>
                    <tbody>
                        {course_instructor.map((item, index) => {
                            return <tr>
                                <td><a href={"/instructor/" + item.id}>
                                    {item.name}
                                </a></td>
                                <td>{item.year}</td>
                                <td>{item.semester}</td>
                            </tr>
                        })}
                    </tbody>

                </table>

            </>
        </div>

    )



}