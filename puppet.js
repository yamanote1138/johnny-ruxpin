const {Board, Motor} = require('johnny-five');
const Raspi = require('raspi-io').RaspiIO;
const temporal = require('temporal');

// pin configuration
const PWMA = 'GPIO18'; //12 - motor A speed
const AIN1 = 'GPIO24'; //18 - motor A dir
const AIN2 = 'GPIO23'; //16 - motor A cdir
const PWMB = 'GPIO17'; //11 - motor B speed
const BIN1 = 'GPIO22'; //15 - motor B dir
const BIN2 = 'GPIO27'; //13 - motor B cdir

const MOTOR_DURATION = 500;
const BLINK_DELAY = MOTOR_DURATION + 100;

var board = new Board({
  io: new Raspi()
});

board.on('ready', () => {

  const eyes = new Motor({
    pins: {
      pwm: PWMA,
      dir: AIN1,
      cdir: AIN2
    }
  });

  const mouth = new Motor({
    pins: {
      pwm: PWMB,
      dir: BIN1,
      cdir: BIN2
    }
  });

  let bear = {
    eyes:{
      open: function(){
        eyes.fwd(255);
        temporal.delay(MOTOR_DURATION, () => {
          eyes.stop();
        });
      },
      close: function(){
        eyes.rev(255);
        temporal.delay(MOTOR_DURATION, () => {
          eyes.stop();
        });
      },
      blink: function(){
        this.open();
        board.wait(BLINK_DELAY, () => {
          this.close();
        });
      }
    },
    mouth:{
      open: function(){
        mouth.fwd(255);
        temporal.delay(MOTOR_DURATION, () => {
          mouth.stop();
        });
      },
      close: function(){
        mouth.rev(255);
        temporal.delay(MOTOR_DURATION, () => {
          mouth.stop();
        });
      },
      flap: function(){
        this.open();
        board.wait(BLINK_DELAY, () => {
          this.close();
        });
      }
    },
    all:{
      open: function(){
        bear.eyes.open();
        bear.mouth.open();
      },
      close:function(){
        bear.eyes.close();
        bear.mouth.close();
      },
      blink:function(){
        this.open();
        board.wait(BLINK_DELAY, () => {
          this.close();
        });
      }
    }
  };

  board.repl.inject(bear);

  board.on('exit', () => {
    eyes.stop();
    mouth.stop();
  });

});