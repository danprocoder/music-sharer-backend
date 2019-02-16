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
    User.create({
      email: req.body.email,
      password: req.body.password,
    }).then((user) => {
      response(res).success(user);
    });
  }
}
