import { Tracks } from '../models/index';
import response from '../helpers/response';
import { IncomingForm } from 'formidable';
import fetch from 'node-fetch';
import fs from 'fs';

require('dotenv').config();

export default class {
  upload(req, res) {
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
              key: data.tonart_result.key.replace(':', '')
            });
          })
          .catch(err => {
            resolve(null);
          });
      });
    }).then((data) => {
      return Tracks.create({
        title: data.title,
        authorId: 1,
        key: data.key,
      }).then((track) => {
        return {
          id: track.id,
          title: track.title,
          key: track.key,
        };
      });
    }).then((track) => {
      response(res).success(track);
    }).catch((err) => {
      response(res).internalServerError(err);
    });
  }

  sendFileToSonicAPI(req, res) {
    res.sendFile(req.params.filename);
  }
}
