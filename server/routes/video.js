const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const { Subscriber } = require('../models/Subscriber');
//=================================
//             Video
//=================================
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")

router.post('/uploadfiles', (req, res) =>{
    // 비디오 서버에 저장
    upload(req, res, err => {
        if(err){
            return res.json({ success : false , err})
        }
        return res.json({ success : true, url: res.req.file.path, fileName: res.req.file.filename })
    })
})

router.post('/uploadVideo', (req, res) =>{
    // 비디오 정보들을 저장
    const video = new Video(req.body);
    video.save((err, doc)=> {
        if(err) return res.json({ success: false, err})
        res.status(200).json({success: true})
    })
})

router.post('/getSubscriptionVideos', (req, res) =>{
    // 구독 비디오
    // 자신의 아이디를 가지고 구독하는 사람을 찾기
    Subscriber.find({ userFrom : req.body.userFrom })
    .exec((err, subscribeInfo) => {
        if(err) return res.status(400).send(err);

        let subscribedUser = [];
        subscribeInfo.map((subscriber, i)=> {
            subscribedUser.push(subscriber.userTo);
        })
        // 찾은 사람들의 비디오를 가져오기
        Video.find({ writer : { $in : subscribedUser } })
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success : true, videos})
        })
    })
})



router.get('/getVideos', (req, res) =>{
    // 비디오를 DB에서 가져와 클라이언트로 전송
    Video.find()
        .populate('writer')
        .exec((err, videos)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({ success : true, videos})
        })
    
})

router.post('/getVideoDetail', (req, res) =>{
    
    Video.findOne({"_id": req.body.videoId})
    .populate('writer')
    .exec((err, videoDetail)=> {
        if(err) return res.status(400).send(err);
        return res.status(200).json({ success : true, videoDetail})
    })

})

router.post('/thumbnails', (req, res) =>{
    
    let filePath = ""
    let fileDuration = ""
    ffmpeg.setFfmpegPath("C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe");
    // 비디오 정보
    ffmpeg.ffprobe(req.body.url, function(err, metadata) {
        
        console.log(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    });

    // 썸네일 생성
    ffmpeg(req.body.url)
    .on('filenames', function(filenames){
        console.log('Will generate ' + filenames.join(', '))
        console.log(filenames)
        filePath = "uploads/thumbnails/" + filenames[0];
    })
    .on('end', function(){
        console.log('ScreensShots taken')
        return res.json({ success: true, url: filePath, fileDuration: fileDuration})
    })
    .on('error', function(err){
        console.log(err);
        return res.json({ success: false, err});
    })
    .screenshots({
        // Will take screens at 20%, 40%, 60% and 80% of the video
        count: 3,
        folder: 'uploads/thumbnails',
        size:'320x240',
        // %b input basename ( filename w/o extension )
        filename:'thumbnail-%b.png'
    }); 
});


module.exports = router;
