var express = require('express');
var router = express.Router();
var multer = require('multer')
var connection = require('../database/db')



var storage = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            cb(null, './public/images')
        },
        filename: (req, file, cb) => {
            cb(null,Date.now() +  file.originalname.replace(/\s+/g, '_'))
        }
    }
)

var upload = multer({storage})

/* GET home page. */
router.post('/new',upload.single('coverImage'), (req,res) => {
    const data =  req.body
    const file = req.file.filename
    const blog = {
        id:parseInt(data.id),
        title: data.title,
        content: data.content,
        published_at:data.published_at,
        coverImage: file
    }
    connection.query(
        'INSERT INTO Blog SET ?',
        blog,
         (err,result)=>{
            if(err){
                console.log(err)
                return res.status(500).json({message:"Internal Server Error"});
            }else{
              
              
                console.log('Data Inserted')
                return res.status(200).json({message:"Data Inserted Successfully"});
                
            }
        }
    )

});


router.get('/all', (req,res)=>{

    connection.query(
        'SELECT * FROM Blog',
        (err,result)=>{
            if(err){
                console.log(err)
                return res.status(500).json({message:"Internal Server Error"});
            }else{
                console.log('Data fetched')
                return res.status(200).json({message:"Data Fetch Successfully",data:result});
            }
        }
    )
});

router.get('/:id', (req,res)=>{
    const id = req.params.id
    connection.query(
        'SELECT * FROM Blog WHERE id = ?',
        id,
        (err,result)=>{
            if(err){
                console.log(err)
                return res.status(500).json({message:"Internal Server Error"});
            }else{
                console.log('Data fetched')
                return res.status(200).json({message:"Data Fetch Successfully",data:result[0]});
            }
        }
    )
}
);

module.exports = router;
