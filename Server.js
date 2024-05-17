const express = require('express'); 
const app = express(); 
const router = require('./routes/router');
const path = require('path');
const cors = require('cors')

app.use(cors())

app.use(express.urlencoded({extended : true}))
app.use(express.json())

app.use(express.static(path.join(__dirname, "react-project", "build")));
app.set('port', process.env.PORT || 3000);

    
app.use(router)
app.listen(app.get('port'), () => {
    console.log(app.get('port'), 'waiting...')
}); 