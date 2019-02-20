import { Tracks, User } from '../models/index';
import response from '../helpers/response';
import { IncomingForm } from 'formidable';
import mp3Duration from 'mp3-duration';
import time from '../helpers/time';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import Validator from '../helpers/validator';

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
      attributes: ['id', 'title', 'key', 'url', 'views', 'likes', 'length', 'lengthStr', 'createdAt'],
    })
      .then((data) => {
        response(res).success(data);
      });
  }

  /**
   * Connect to Sonic API to analyse the track.
   * https://api.sonicAPI.com/analyze/key
   * 
   * @param {object} data
   */
  getTrackKey(data) {
    return fetch(`http://${process.env.BASE_URL}/get/key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_id: 'dd15e27f-0e67-404a-bcb9-eba312450ec8',
        format: 'json',
        input_file: `${process.env.BASE_URL}/api/track/tmp/${encodeURIComponent(data.file.path)}`,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        data.key = result.tonart_result.key.replace(':', '');
        return data;
      });
  }

  upload(req, res) {
    const controller = this;

    new Promise((resolve, reject) => {
      const form = new IncomingForm();
      form.parse(req, (err, field, file) => {
        if (err) {
          reject();
        } else {
          resolve({
            file: file.track || null,
            title: field.title ? field.title.trim() : null,
          });
        }
      });
    })
      .then((data) => {
        // Validate the input.

        return new Validator(data)
          .run({
            title: {
              required: 'Track name is required',
            },
            file: {
              required: 'Please upload a track file',
            },
          })
          .then(() => {
            return data;
          });
      })
      .then((data) => {
        // Analyse the track online to get the key.
        return this.getTrackKey(data);
      })
      .then((data) => {
        // Get the duration of the mp3 file.

        return new Promise((resolve, reject) => {
          mp3Duration(data.file.path, (err, duration) => {
            if (err) {
              duration = 0;
            }

            data.length = duration;
            data.lengthStr = time.formatTime(duration);

            resolve(data);
          });
        });
      })
      .then((data) => {
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
          length: data.length,
          lengthStr: data.lengthStr,
        });
      }).then((track) => {
        response(res).success({
          id: track.id,
          title: track.title,
          key: track.key,
          url: track.url,
        });
      }).catch((err) => {
        response(res).badRequest(err);
      });
  }

  generateFilename(user, data) {
    let filename = `${user.username}-`.concat(data.title.toLowerCase().replace(/ /g, '-'));
    return filename;
  }

  sendFileToSonicAPI(req, res) {
    res.sendFile(req.params.filename);
  }

  sendStream(req, res) {
    res.sendFile(path.join(__dirname, '..', 'uploads', decodeURIComponent(req.params.filename)));
  }
}
