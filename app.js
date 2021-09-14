const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
var helmet = require('helmet');
app.use(helmet());


const sequelize = new Sequelize('log', 'root', 'dnjsWLS123!', {
	host: '127.0.0.1',
	dialect: 'mysql',
	logging: false,
	define: {
		charset: 'utf8',
		collate: 'utf8_general_ci',
	},
	pool: {
		max: 5, 	//db 접속자 최대 숫자
		min: 0,
		acquire: 30000,
		idle: 5000,
	},
}); //sequelize 정의

// UserLogin Table 생성 함수 정의
const UserLoginTable = (sequelize, DataTypes) => {
	return sequelize.define('user', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			comment: 'proper id',
		},
		name: {
			type: DataTypes.STRING(40),
			allowNull: false,
			comment: 'name',
		},
		email: {
			type: DataTypes.STRING(40),
			allowNull: false,
			comment: 'user email',
		},
		password: {
			type: DataTypes.STRING(40),
			allowNull: false,
			comment: 'password',
		},
	
	},
	//sequelize table 설정 및 등등
	{
		classMethods: {},
		tablesName: "user",
		freezeTableName: true,
		underscored: true,
		timesettamps: false,
	});
};

// UserLogin Table 생성 함수 정의

const User = UserLoginTable(sequelize, Sequelize.DataTypes);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


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
app.post('/users', async (req, res) => {
	const { email, password, name } = req.body;
	const user = await User.create({
		email, password, name,
	});
	if (user) {
		// 유저 생성이 완료된 경우
		console.log('유저가 생성되었습니다.');
		res.status(201).json(user);
	} else {
		// 유저 생성이 실패한 경우
		console.log('유저 생성에 실패하였습니다.');
		res.status(400).send('유저 생성에 실패하였습니다.');
	}
});

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
sequelize
	.sync({ force: true })
	.then(() => {
		console.log(' DB running ');
	})
	.catch((err) => {
		console.log('fail');
		console.log(err);
	});

app.post('/api/verify/login', (req, res) => {
	// 로그인 되었다고 사용자에게 알려줌
	var reqemail = req.body.email;
	var reqpassword = req.body.password;

	User.findOne({
		where : {
			email : reqemail,
			password : reqpassword
		
		}
	}).then(function(data)
	{
		if( data == null || data == undefined ) {
			console.log("로그인 이메일이 없습니다. email : "+ reqemail );
			res.status(412) ;
			var data = { success: false, msg: '로그인 정보가 정확하지 않습니다.'};

			res.json(data);
			
		}
		if(data.password != reqpassword ) {
			console.log("로그인 암호가 틀립니다. email: " + reqemail );
			res.status(412);
			var data = {success:false, msg: '로그인 정보가 정확하지 않습니다.'};

			res.json(data);

			}else{
				console.log("로그인 성공 email: " + reqemail);
				res.status(200).json(data);

				var data = {success:true, msg: ' 로그인 되었습니다. '};
			}
	})
		
		
});

app.post('/api/delete/user/:email', (req, res) => {
	//email 과 일치하는 row를 삭제 할것
	var reqemail = req.body.email;

	User.findOne({
		where : {
			email : reqemail,
		}

	}).then(function(data)
	{
		if( data == null || data == undefined ) {
			console.log("이메일이 존재하지 않습니다. email : "+ reqemail );
			res.status(412) ;
			var data = { success: false, msg: '이메일이 존재 하지 않습니다.'};

			res.json(data);
			
		}else{
				console.log("유저 삭제 완료 email: " + reqemail);
				res.status(200);

				User.destroy({where : {email : reqemail }})
				.then(result => {
					res.json({});
				 }).catch(err => {
					console.error(err);
				 });

				
			}
	})
});

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