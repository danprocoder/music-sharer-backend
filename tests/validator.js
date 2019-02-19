import Validator from '../helpers/validator.js';
import { AssertionError } from 'assert';

describe('Testing the validator class', () => {
  describe('Testing the email and rule.', () => {
    const emailValidator = new Validator({
      'email': 'danielaustin718gmail.com',
    });

    it('should be a valid email', (done) => {
      emailValidator.run({
        email: {
          validEmail: 'email_not_valid',
        }
      }).then(() => {
        done();
      }).catch((errors) => {
        console.log(errors);
        assert.equal(errors.email, 'email_not_valid');

        done();
      }).finally(done);
    });
  });

});

/*
new Validator({

    }).run({

    }).then(() => {

    }).catch((errors) => {

    });
*/
