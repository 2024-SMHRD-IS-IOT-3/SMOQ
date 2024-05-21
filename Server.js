const express = require('express'); 
const app = express(); 
const router = require('./routes/router');
const path = require('path');
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
require('dotenv').config()


  

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true, // 쿠키 허용
} ))

app.use(express.urlencoded({extended : true}))
app.use(express.json())

app.use(express.static(path.join(__dirname, "react-project", "build")));
app.set('port', process.env.PORT || 3000);


app.use(cookieParser())
app.use(session({
    secret: 'aiemf!%^@#$', 
    resave: false, 
    saveUninitialized: true, 
    cookie: { secure: false,
              httpOnly:true,
              maxAge: 1000 * 60 * 60,
     } 
}));


app.use(router)

app.listen(app.get('port'), () => {
    console.log(app.get('port'), 'waiting...')
}); 