import Validator from '../helpers/validator';

const email = new Validator({
    email: 'daniel@gmail.com',
    password: 'my password',
}).run({
    email: {
        required: 'Please provide your email address',
        validEmail: 'email_not_valid',
    },
    password: {
        required: 'Password is required',
    }
}).then(() => {
    console.log.bind(console)('Ran with no problem');
}).catch(errors => {
    console.log.bind(console)(errors);
}).finally(() => {
    console.log.bind(console)('Finished');
});
