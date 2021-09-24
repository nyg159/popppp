var express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
var helmet = require('helmet');
const jwt = require('jsonwebtoken');
var secretObj = require("./jwt");
var userlogin = require("./users/login");

const app = express();


// UserLogin Table 생성 함수 정의



app.use(helmet()); //보안
app.use(bodyParser.urlencoded({ extended: true })); //바디파서 미들웨어 
app.use(bodyParser.json());

app.use('/login', userlogin);


app.get('/', (req, res) => {
	res.send('home');
});

app.get('/get', function (req, res) {
	res.send('get');
	console.log('get run');
});

app.post('/post', (req, res) => {
	res.send('post ok');
	console.log('post run');
});

// db에 사용자 데이터를 넣는다 (회원가입)


app.put('/put', function (req, res) {
	res.send('put ok');
	console.log('put run');
});

app.delete('/delete', (req, res) => {
	res.send('delete ok');
	console.log('delete run');
});

app.get('/get/params/:name', function (req, res) {
	res.send(req.params.name);
	console.log(req.params.name);
});

app.get('/get/query', (req, res) => {
	var topics = ['query number 0', 'query number 1', 'query number 2'];
	res.send(topics[req.query.id]);
	console.log(req.query.id);
});

app.post('/post/body', (req, res) => {
	var title = req.body.title;
	res.send(title);
	console.log(req.body);   
	console.log(title);
});
// sequelize sync() :  Sequelize가 초기화 될 때 DB에 필요한 테이블을 생성하는 함수입니다. 이걸 먼저 정의 해야 DB에 있는데이터 조작, 데이터 정의도 가능함



// 찾을 수 없는 홈페이지에 접속 했을 때 호출 되는 404 미들웨어
app.use(function(req, res, next) {
	res.status(404).send('can not found 404');
});

// 에러가 나면 호출되는 에러 미들웨어
app.use(function(err, req, res, next) {
	console.error(err.stack)
	res.status(500).send('Something broken');
});

app.listen(3000, function () {
	console.log('server running');
});