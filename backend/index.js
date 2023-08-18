const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const session = require("express-session");
const bcrypt = require('bcrypt');

app.use(cors(
  {
    origin: "http://localhost:3000",
    credentials: true
  }

));
app.use(express.json());


app.use(session({
  secret: "abcd",
  resave: true,
  saveUninitialized: true,

}));
const checkLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};


app.post("/login", async (req, res) => {
  // Replace this with your actual authentication logic
  const { username, password } = req.body;
  console.log(username, password);
  const result = await pool.query(
    'select hashed_password from user_password where id = $1', [username]
  );
  console.log(username, password)
  if (await bcrypt.compare(password, result.rows[0].hashed_password)) {
    req.session.user = username;
    console.log("username ", req.session.user)
    res.status(200).send({ username });
  } else {
    res.status(401).send("Unauthorized");
  }
});


// app.post('/login', async (req, res) => {
//   const id = req.body.id;
//   const password = req.body.password;
//   console.log(`user ${id} is trying to login with password ${password}`)
//   // ignoring password for now and will add the feature of checking correct password later
//   const result = await client.query(
//     'select * from student where id = $1', [id]
//   );
//   if (result.rows.length === 0) {
//     res.json({'status':'fail','message':'user does not exist'});
//   }
//   else {
//     //check the credientials from the user_password table and bcrypt library
//     const result2 = await client.query(
//       'select * from user_password where id = $1', [id]
//     );
//     const hash = result2.rows[0].hashed_password;
//     // console.log(hash);
//     bcrypt
//       .compare(password, hash)
//       .then(result => {
//         if (result) {
//           req.session.user = id;
//           // req.session.role = 'student';
//           checkInstructor(id).then(result => {
//             if (result) {
//               req.session.role = 'instructor';
//             }
//             else {
//               req.session.role = 'student';
//             }
//           });
//           res.json({'status':'ok','message':'Logging in'});
//         }
//         else {
//           // res.status(401).json({ error: 'Unauthorized' });
//           res.json({'status':'fail','message':'password does not match'});
//         }
//       }
//       )
//       .catch(err => console.error(err.message));
//   }
// });



//get a todo
app.get('/course/:course_id', checkLoggedIn, async (req, res) => {
  try {
    const { course_id } = req.params;
    if (course_id != 'running') {

      const course_info = await pool.query('SELECT * FROM course WHERE course_id = $1', [course_id]);
      const course_prereq = await pool.query('SELECT prereq_id FROM prereq WHERE course_id = $1', [course_id]);
      const course_instructor = await pool.query('with new as (select year, semester from reg_dates where start_time<NOW() order by year desc,semester desc limit 1   )     SELECT instructor.id,name,teaches.year,teaches.semester FROM (teaches NATURAL JOIN instructor),new  WHERE course_id = $1 and teaches.year<=new.year order by teaches.year desc ,teaches.semester desc  ', [course_id]);
      //send all the info to the front end
      res.json({ 'course_info': course_info.rows, 'course_prereq': course_prereq.rows, 'course_instructor': course_instructor.rows });
    }
    else {
      const course_info = await pool.query('with new as (select year, semester from reg_dates where start_time<NOW() order by year desc, semester desc limit 1   )SELECT distinct dept_name FROM (course NATURAL JOIN teaches),new where  teaches.year=new.year and teaches.semester=new.semester ');
      res.json(course_info.rows);
    }
  }

  catch (err) {
    console.error(err.message);
  }
});

app.get('/course/running/:dept_name', checkLoggedIn, async (req, res) => {
  try {
    const { dept_name } = req.params;
    const course_info = await pool.query('with new as (select year, semester from reg_dates where start_time<NOW() order by year desc, semester desc limit 1   )SELECT teaches.course_id,title FROM (course NATURAL JOIN teaches),new where  dept_name= $1 and teaches.year=new.year and teaches.semester=new.semester ', [dept_name]);
    res.json(course_info.rows);
  }
  catch (err) {
    console.error(err.message);
  }
});

app.get('/home', checkLoggedIn, async (req, res) => {
  try {
    const user = req.session.user;
    const user_info = await pool.query('SELECT * FROM student WHERE id = $1', [user]);
    const current = await pool.query('with new as (select year, semester from reg_dates where start_time<NOW() order by year desc, semester desc limit 1   )SELECT takes.course_id,title,takes.grade,takes.year,takes.semester FROM (takes NATURAL JOIN course),new WHERE id = $1 and takes.year=new.year and takes.semester=new.semester ', [user]);
    //const prev = await pool.query('with new as (select year, semester from reg_dates where start_time<NOW() order by year desc, semester desc limit 1   )(select takes.course_id,title,takes.year,takes.semester from (takes NATURAL JOIN course),new where takes.year<=new.year and id=$1 except SELECT takes.course_id,title,takes.year,takes.semester from (takes NATURAL JOIN course),new WHERE id = $1 and takes.year=new.year and takes.semester=new.semester) order by year desc ,semester desc  ', [user]);
    //const prev = await pool.query('with new as (select year,semester from reg_dates where start_time<NOW() order by year desc ,semester desc limit 1)(select * from((select takes.course_id,title,takes.grade,takes.year,takes.semester from (takes NATURAL JOIN course),new where takes.year<=new.year and id=$1) except (SELECT takes.course_id,title,takes.grade,takes.year,takes.semester FROM (takes NATURAL JOIN course),new WHERE id = $1 and takes.year=new.year and takes.semester=new.semester) ) )order by takes.year desc , takes.semester desc  ', [user]);
    const prev = await pool.query('with new as (select year,semester from reg_dates where start_time<NOW() order by year desc ,semester desc limit 1)(select takes.course_id,title,takes.grade,takes.year,takes.semester from (takes NATURAL JOIN course),new where takes.year<=new.year and id=$1) except (SELECT takes.course_id,title,takes.grade,takes.year,takes.semester FROM (takes NATURAL JOIN course),new WHERE id = $1 and takes.year=new.year and takes.semester=new.semester) order by year desc ,semester desc', [user]);

    res.json({ 'user_info': user_info.rows, 'current': current.rows, 'prev': prev.rows });

  }
  catch (err) {
    console.error(err.message);
  }
});



app.get('/instructor/:instructor_id', checkLoggedIn, async (req, res) => {
  try {
    const { instructor_id } = req.params;
    console.log('shvfh', instructor_id);
    const instructor_info = await pool.query('SELECT name,dept_name FROM instructor WHERE id = $1', [instructor_id]);
    const instructor_course = await pool.query('with new as (select year, semester from reg_dates where start_time<NOW() order by year desc, semester desc limit 1   )SELECT course_id,title from (teaches NATURAL JOIN course),new WHERE id = $1 and teaches.year=new.year and teaches.semester=new.semester ', [instructor_id]);
    const course_prev = await pool.query('with new as (select year, semester from reg_dates where start_time<NOW() order by year desc, semester desc limit 1   )(select course_id,title, teaches.year,teaches.semester from (teaches NATURAL JOIN course),new where teaches.year<=new.year and id=$1 except SELECT course_id,title,teaches.year,teaches.semester from (teaches NATURAL JOIN course),new WHERE id = $1 and teaches.year=new.year and teaches.semester=new.semester) order by year desc ,semester desc  ', [instructor_id]);

    res.json({ 'instructor_info': instructor_info.rows, 'instructor_course': instructor_course.rows, 'course_prev': course_prev.rows });

  }
  catch (err) {
    console.error(err.message);
  }
});




app.post('/home/drop', checkLoggedIn, async (req, res) => {
  try {
    console.log(req.body);
    const course_id = req.body.course_id;
    const year = req.body.year;
    const semester = req.body.semester;
    const user = req.session.user;
    console.log(user, course_id, year, semester)
    const deleteTodo = await pool.query('DELETE FROM takes WHERE id = $1 AND course_id = $2 AND year = $3 AND semester = $4', [
      user, course_id, year, semester

    ]);
    res.status(200).json('Todo was deleted!');
    console.log("deleted");
  }
  catch (err) {
    console.error(err.message);
  }
});



app.post('/registration/add',checkLoggedIn, async (req, res) => {
  try {
    const user = req.session.user;
    const course_id = req.body.course_id;
    const sec_id = req.body.sec_id;
    const year = req.body.year;
    const semester = req.body.semester;
    const query = await pool.query(`with sem(year, semester) as (
      select year, semester
      from reg_dates
      where start_time < NOW()
      order by start_time desc
      limit 1
    ), prev_sem(year, semester) as (
      (
        select year, semester
        from reg_dates
        where start_time < NOW()
        order by start_time desc
      ) except (
        select year, semester
        from reg_dates
        where start_time < NOW()
        order by start_time desc
        limit 1
      )
    ), prev_courses(course_id) as (
      select distinct course_id
      from takes
      join prev_sem on takes.year=prev_sem.year
        and takes.semester=prev_sem.semester
        and id=($1)
    ), cur_courses(course_id) as (
      select distinct course_id
      from takes
      join sem on takes.year=sem.year
        and takes.semester=sem.semester
        and id=($1)
    ), cur_slots(time_slot_id) as (
      select distinct time_slot_id
      from section, cur_courses, sem
      where section.year=sem.year
        and section.semester=sem.semester
        and section.course_id=cur_courses.course_id
        and sec_id=($3)
    ), pre(id) as (
      select prereq_id
      from prereq
      where course_id=($2)
    ), check_slot(time_slot_id) as (
      select time_slot_id
      from section, sem
      where section.year=sem.year
        and section.semester=sem.semester
        and course_id=($2)
        and sec_id=($3)
    )
    insert into takes
    select $1, $2, $3, sem.semester, sem.year
    from sem
    where not exists (
      (select * from pre) except (select * from prev_courses)
    )
      and exists (
        (select * from check_slot) except (select * from cur_slots)
      )`,[user, course_id, sec_id]
    );
    res.status(200).json('Todo was added!');
    console.log("added");

  }


  catch (err) {
    console.error(err.message);
  }
});










app.get('/registration/all',checkLoggedIn, async (req, res) => {
  try {
    const all_courses = await pool.query('with new as (select year, semester from reg_dates where start_time<NOW() order by year desc, semester desc limit 1   )SELECT distinct course_id,title,section.year,section.semester,sec_id from (course NATURAL JOIN section),new where section.year=new.year and section.semester=new.semester');
    res.json(all_courses.rows);
  }
  catch (err) {
    console.error(err.message);
  }
});




app.get('/home/logout', async(req, res) => {
  req.session.destroy();
  res.status(200).json('Logged out');
});






app.listen(5000, () => {
  console.log('Server is running on port 5000');
});