import jwt from 'jsonwebtoken';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import response from '../helpers/response';
import { User } from '../models/index';
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

  /**
   * Controller called from PATCH /api/user/bio
   */
  updateUserBio(req, res) {
    const bio = req.body.bio;

    new Validator({
      bio,
    }).run({
      bio: {
        required: 'User bio is required',
      },
    }).then(() => {
      return User.update({
        about: bio.trim(),
      }, {
        where: {
          id: req.user.id,
        },
      });
    }).then((user) => {
      response(res).success({
        bio: bio.trim(),
      });
    }).catch((error) => {
      response(res).badRequest(error);
      throw error;
    });
  }

  /**
   * Updates the user profile picture.
   * Called by PATCH /api/user/photo
   */
  updateUserPhoto(req, res) {
    new Promise((resolve, reject) => {
      // Parse the form
      const form = new IncomingForm();
      form.parse(req, (err, field, file) => {
        if (file.photo) {
          resolve(file.photo);
        } else {
          reject();
        }
      });
    }).then((file) => {
      // Save uploaded picture file to the server
      return this.saveUserPhoto(file, req);
    }).then((imgUrl) => {
      // Save img filename to database.
      return User.update({
        imgUrl,
      }, {
        where: {
          id: req.user.id,
        },
      }).then(() => imgUrl);
    }).then((imgUrl) => {
      // return imgUrl to client.
      response(res).success({
        imgUrl,
      });
    }).catch(() => {
      response(res).badRequest();
    });
  }

  saveUserPhoto(file, req) {
    // Save the file with a random name.

    const uploadPath = path.join(__dirname, '..', 'uploads', 'profile-pictures');
    fs.mkdirSync(uploadPath, { recursive: true });

    return new Promise((resolve, reject) => {
      const { username } = req.user;
      fs.rename(file.path, path.join(uploadPath, username), (err) => {
        if (!err) {
          resolve(username);
        } else {
          reject();
        }
      });
    });
  }

  sendUserPhoto(req, res) {
    res.sendFile(path.join(__dirname, '..', 'uploads', 'profile-pictures', req.params.filename));
  }
}
