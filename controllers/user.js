import response from '../helpers/response';
import { User } from '../models/index';
import jwt from 'jsonwebtoken';
import Validator from '../helpers/validator';

require('dotenv').config();

export default class {
  constructor() {
    
  }

  auth(req, res) {
    const { email, password } = req.body;

    new Validator({
      email, password,
    }).run({
      email: {
        required: 'Email is required',
      },
      password: {
        required: 'Password is required',
      },
    }).then(() => {
      return User.findOne({
        where: {
          email,
          password,
        },
        attributes: ['id', 'name', 'username'],
      });
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
    }).catch((error) => {
      response(res).badRequest(error);
    });
  }

  addNewUser(req, res) {
    const { name, email, password } = req.body;

    const validator = new Validator({
      name, email, password,
    });
    validator.defineRule('uniqueEmail', this.isEmailUnique);

    validator.run({
      name: {
        required: 'Name is required',
      },
      email: {
        required: 'Email is required',
        validEmail: 'Please provide a valid email',
        uniqueEmail: 'Email address already used. Choose another email',
      },
      password: {
        required: 'Password is required',
      }
    }).then(() => {
      const username = this.generateUsername(name);

      return User.create({
        name: name.trim(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
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

  isEmailUnique(email, callback) {
    User.findOne({
      where: {
        email,
      }
    }).then((user) => {
      callback(user == null);
    });
  }
}
