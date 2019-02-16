import response from '../helpers/response';
import { User } from '../models/index';
import jwt from 'jsonwebtoken';

require('dotenv').config();

export default class {
  constructor() {
    
  }

  auth(req, res) {
    User.findOne({
      where: {
        email: req.body.email.toLowerCase(),
        password: req.body.password,
      },
      attributes: ['id'],
    }).then((user) => {
      if (!user) {
        response(res).notFound('Email/password is incorrect');
      } else {
        response(res).success({
          user,
          token: jwt.sign({
            userId: user.id,
          }, process.env.JWT_SECRET_KEY),
        });
      }
    });
  }

  addNewUser(req, res) {
    const username = this.generateUsername(req.body.name);

    User.create({
      name: req.body.name,
      username,
      email: req.body.email,
      password: req.body.password,
    }).then((user) => {
      response(res).success(user);
    });
  }

  generateUsername(name) {
    return name.toLowerCase().replace(/ /g, '-');
  }
  
  userData(req, res) {
    const where = req.params.username ? (
      {
        username: req.params.username.toLowerCase()
      }
    ) : (
      {
        id: 4, // Get from jwt
      }
    );

    User.findOne({
      where
    }).then(data => {
      if (data) {
        response(res).success(data);
      } else {
        response(res).notFound('User not found');
      }
    });
  }
}
