import response from '../helpers/response';
import { User } from '../models/index';

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
      if (user) {
        response(res).success(user);
      } else {
        response(res).notFound('Email/password is incorrect');
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
