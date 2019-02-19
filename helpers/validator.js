import user from "../controllers/user";

/**
 * Asynchronous validator
 * 
 * @author Daniel Austin
 * @date Sun, Feb 17, 2019 9:56pm
 * @version 1.0
 */ 
class Validator {
  ruleFunctions = {
      required(val, callback) {
        if (typeof val === 'string') {
          val = val.trim();
        }

        callback(val != '' && val != null);
      },

      validEmail(val, callback) {
        callback(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val));
      },

      regex(pattern, val, callback) {
        callback(pattern.test(val));
      }
  };

  constructor(input) {
    this.input = input;

    this.nameKeys = [];
    this.ruleKeys = [];
    this.rules = {};

    this.nameIndex = -1;
    this.ruleIndex = 0;

    this.errors = {};
  }

  nextInput() {
    this.nameIndex++;
    this.ruleIndex = 0;

    if (this.nameIndex >= this.nameKeys.length) {
      this.onFinish();
    } else {
      const currentName = this.nameKeys[this.nameIndex];
      const currentRules = this.rules[currentName];
      this.ruleKeys = Object.keys(currentRules);

      this.validate();
    }
  }

  nextRule() {
    this.ruleIndex++;
    if (this.ruleIndex >= this.ruleKeys.length) {
      this.nextInput();
    } else {
      this.validate();
    }
  }

  validate() {
    const name = this.nameKeys[this.nameIndex];
    const rule = this.ruleKeys[this.ruleIndex];
    const value = this.input[name];

    console.log(`${name}: ${rule}`);

    this.ruleFunctions[rule](value, (pass, err) => {
      if (!pass) {
        this.errors[name] = this.rules[name][rule];

        this.nextInput();
      } else {
        this.nextRule();
      }
    });
  }

  run(rules) {
    this.rules = rules;
    this.nameKeys = Object.keys(rules);

    return new Promise((resolve, reject) => {
      this.onFinish = (() => {

        if (Object.keys(this.errors).length > 0) {
          reject(this.errors);
        } else {
          resolve();
        }
      }).bind(this);

      this.nextInput();
    });
  }

  defineRule(name, func) {
    this.ruleFunctions[name] = func;
  }
}

export default Validator;
