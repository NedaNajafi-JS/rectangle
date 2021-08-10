
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
var moment = require('moment-jalaali');
moment.loadPersian();

const Data = require('./models/Data')


const app = express()
const port = 5004;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


mongoose
  .connect("mongodb://localhost:27017/rectangle", { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify:false})
  .then(() => {

    console.log('MongoDB Connected');
  })
  .catch(err => console.log(err));


// Record data
app.post('/rec/data', async(req, res) => {

    let rec1= {
        minX: Math.min(req.body.main.x, req.body.main.x + req.body.main.width),
        maxX: Math.max(req.body.main.x, req.body.main.x + req.body.main.width),
        minY: Math.min(req.body.main.y, req.body.main.y + req.body.main.height),
        maxY: Math.max(req.body.main.y, req.body.main.y + req.body.main.height)
    }
    
    await Promise.all(req.body.input.map(async (input) =>{
        let rec2= {
            minX: Math.min(input.x, input.x + input.width),
            maxX: Math.max(input.x, input.x + input.width),
            minY: Math.min(input.y, input.y + input.height),
            maxY: Math.max(input.y, input.y + input.height)
        }

        if(rec2.minX <= rec1.maxX && rec2.minY <= rec1.maxY
            && rec2.maxX >= rec1.minX && rec2.maxY >= rec1.minY){
                
                //in
                const newData = new Data({
                    x: input.x,
                    y: input.y,
                    width: input.width,
                    height: input.height,
                    time: Date.now()
                });
            
                newData
                .save()
                .then()
                .catch(err => {
                    console.log(err);
                    
                });

            }
    }));

    return res.status(200).json('Success');

    
});

// return all valid rectangles
app.get('/rec/getdata', async(req, res) => {

    let data = await Data.find()
    .lean()
    .exec()
    
    if(data){   

        await Promise.all(data.map(dt => {
                
            dt.time = moment(dt.time).format('jYYYY-jM-jD HH:mm');
        }));
        res.status(200).json(data);

    }else{
        res.status(200).json([]);
    }
})


app.listen(port, () => console.log(`Server Running on port ${port}`))