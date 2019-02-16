import { Tracks, Users } from '../models/index';
import response from '../helpers/response';

export default class {
  getTracks(req, res) {
    const where = req.params.username ? ({
      username,
    }) : (null);

    Users.hasMany(Tracks, {foreignKey: 'id'});
    Tracks.belongsTo(Users, {foreignKey: 'authorId'});

    Tracks.find({
      where,
      include: [Users],
      attributes: ['id', 'title', 'key', 'username']
    })
      .then((data) => {
        response(res).success(data);
      });
  }
}
