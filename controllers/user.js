import response from '../helpers/response';
import { User } from '../models/index';
import jwt from 'jsonwebtoken';
import Validator from '../helpers/validator';

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
    const { name, email, password } = req.body;

    new Validator({
      name, email, password
    }).run({
      name: {
        required: 'Name is required',
      },
      email: {
        required: 'Email is required',
        validEmail: 'Please provide a valid email',
      },
      password: {
        required: 'Password is required',
      }
    }).then(() => {
      const username = this.generateUsername(name);

      return User.create({
        name,
        username,
        email: email.toLowerCase(),
        password: req.body.password,
      });
    }).then((user) => {
      response(res).success({
        user,
        token: jwt.sign({
          userId: user.id,
        }, process.env.JWT_SECRET_KEY),
      });
    }).catch((errors) => {
      res.status(400).json(errors);
    });
  }

  generateUsername(name) {
    return name.toLowerCase().replace(/ /g, '-');
  }
  
  userData(req, res) {
    const where = req.params.username ? (
      {
        username: req.params.username.toLowerCase(),
      }
    ) : (
      {
        id: req.user.id, // Get from jwt
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
