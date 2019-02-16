import response from '../helpers/response';
import jwt from 'jsonwebtoken';
import { User } from '../models/index';

require('dotenv').config();

export default (req, res, next) => {
  if (!req.headers['authorization-token']) {
    response(res).forbidden();
  } else {
    try {
      const jwtPayload = jwt.verify(req.headers['authorization-token'], process.env.JWT_SECRET_KEY);
      User.findById(jwtPayload.userId)
        .then((data) => {
          if (data) {
            req.user = data;
            next();
          } else {
            response(res).forbidden();
          }
        });
    } catch(err) {
			response(res).forbidden();
    }
  }
};
