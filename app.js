const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const Op = require('sequelize');

var db_config = require('./db_config.json');


const sequelize = new Sequelize('log', 'root', db_config.password, {
	host: '127.0.0.1',
	dialect: 'mysql',
	logging: false,
	define: {
		charset: 'utf8',
		collate: 'utf8_general_ci',
	},
	pool: {
		max: 500,
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
	});
};

// UserLogin Table 생성 함수 정의
const PostLoginTable = (sequelize, DataTypes) => {
	return sequelize.define('post', {
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
			type: DataTypes.STRING(20),
			allowNull: false,
			comment: 'password',
		},
	});
};

const User = UserLoginTable(sequelize, Sequelize.DataTypes);
const Post = PostLoginTable(sequelize, Sequelize.DataTypes);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(3000, function () {
	console.log('server running');
});

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

app.post('/users', async (req, res) => {
	const { email, password, name } = req.body;
	const user = await User.create({
		email, password, name,
	});
	if (user) {
		// 유저 생성이 완료된 경우
		res.status(201).json(user);
	} else {
		// 유저 생성이 실패한 경우
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

	users.findOne({
		where : {
			email : reqemail,
			password : reqpassword
		
		}
	}).then(function(data)
	{
		if( data == null || data == undefined ) {
			console.log("로그인 이메일이 없습니다. email : "+ reqemail );
			req.status(412);
			var data = { success: false, msg: '로그인 정보가 정확하지 않습니다.'};

			res.json(data);
			
		}
		if(data.password != reqpassword ) {
			console.log("로그인 암호가 틀립니다. email: " + reqemail );
			req.status(412);
			var data = {success:false, msg: '로그인 정보가 정확하지 않습니다.'};

			res.json(data);

			}else{
				console.log("로그인 성공 email: " +reqemail);

				var data = {success:true, msg: ' '};
			}
	})
		
		
});

app.post('/api/create/user', (req, res) => {
	// name, email, password 를 body에 넣어서 실제 디비에 값을 넣을 것

});

app.get('/api/get/user', (req, res) => {
	//리스트 전체 전송할 것

});

app.get('/api/get/user/:id', (req, res) => {
	// id와 일치하는 row의 name 값을 전송할 것

});

app.delete('/api/delete/user/:id', (req, res) => {
	//id 와 일치하는 row를 삭제 할것

});
