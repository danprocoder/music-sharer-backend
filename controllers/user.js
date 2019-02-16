import response from '../helpers/response';
import { User } from '../models/index';

export default class {
  constructor() {
    
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

// response(res).success({});
