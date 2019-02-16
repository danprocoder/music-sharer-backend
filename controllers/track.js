import { Tracks, User } from '../models/index';
import response from '../helpers/response';
import { IncomingForm } from 'formidable';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

require('dotenv').config();

export default class {
  getTracks(req, res) {
    const where = req.params.username ? ({
      '$User.username$': req.params.username,
    }) : (null);

    User.hasMany(Tracks, {foreignKey: 'id'});
    Tracks.belongsTo(User, {foreignKey: 'authorId'});

    Tracks.findAll({
      where,
      include: [User],
      attributes: ['id', 'title', 'key', 'url', 'createdAt'],
    })
      .then((data) => {
        response(res).success(data);
      });
  }

  upload(req, res) {
    const controller = this;

    new Promise((resolve, reject) => {
      const form = new IncomingForm();
      form.parse(req, (err, field, file) => {
        file = file.track;

        // Connect to sonic API to analyse the track and get the key of the song.
        // 'https://api.sonicAPI.com/analyze/key'
        fetch(`http://${process.env.BASE_URL}/get/key`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_id: 'dd15e27f-0e67-404a-bcb9-eba312450ec8',
            format: 'json',
            input_file: `${process.env.BASE_URL}/api/track/tmp/${encodeURIComponent(file.path)}`,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            resolve({
              title: field.title,
              key: data.tonart_result.key.replace(':', ''),
              file
            });
          })
          .catch(err => {
            resolve(null);
          });
      });
    }).then((data) => {
      // Save the uploaded file
      return new Promise((resolve, reject) => {
        const uploadPath = path.join(__dirname, '..', 'uploads'),
              filename = controller.generateFilename(req.user, data);

        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath);
        }
        
        fs.rename(data.file.path, path.join(uploadPath, filename), (err) => {
          if (err) {
            reject(err);
          }

          data.url = filename;
          delete data.file;
          
          resolve(data);
        });
      });
    }).then((data) => {
      // Save to database.
      return Tracks.create({
        title: data.title,
        authorId: req.user.id,
        key: data.key,
        url: data.url,
      }).then((track) => {
        return {
          id: track.id,
          title: track.title,
          key: track.key,
          url: track.url,
        };
      });
    }).then((track) => {
      response(res).success(track);
    }).catch((err) => {
      response(res).internalServerError(err);
    });
  }

  generateFilename(user, data) {
    let filename = `${user.username}-`.concat(data.title.toLowerCase().replace(/ /g, '-'));
    return filename;
  }

  sendFileToSonicAPI(req, res) {
    res.sendFile(req.params.filename);
  }
}
