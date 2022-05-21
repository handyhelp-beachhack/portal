var pwd = document.getElementById('pwd');

function togglePass() {

  eye.classList.toggle('active');

  (pwd.type == 'password') ? pwd.type = 'text' : pwd.type = 'password';
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function timer(remaining) {
  document.getElementById('timer-tag').classList.remove('hidden')
  var m = Math.floor(remaining / 60);
  var s = remaining % 60;
  
  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;
  document.getElementById('timer').innerHTML = m + ':' + s;
  remaining -= 1;
  
  if(remaining >= 0) {
    setTimeout(function() {
        timer(remaining);
    }, 1000);
    return;
  }else{
    document.getElementById('timer-tag').classList.add('hidden')
  }

}

if(getCookie('access-token')){
  window.location.href = "/dashboard";
}

// Form Validation

$("#form").submit(async function (event) {
  event.preventDefault()

  var phone = document.form1.phone;
  var otp = document.form1.otp;
  var resend = document.getElementById('resend');
  var btn = document.form1.btn;
  var msg = document.getElementById('msg');

  btn.disabled = true;

  if (phone.value == "") {
    msg.style.display = 'block';
    msg.style.background = '#ff3333'
    msg.innerHTML = "Please enter your phone number";
    btn.disabled = false;
    phone.focus();
    return false;
  } else {
    if (phone.value.length != 10) {
      msg.style.display = 'block';
      msg.style.background = '#ff3333'
      msg.innerHTML = "Please enter a valid 10 digit phone number";
      btn.disabled = false;
      phone.focus();
      return false;
    } else {

      if (otp.disabled) {

        let _data = {
          phone: phone.value,
          account_type: "company"
        }

        await fetch('https://app.geekstudios.tech/auth/v1/login', {
          method: "POST",
          body: JSON.stringify(_data),
          headers: { "Content-type": "application/json; charset=UTF-8" },
          mode: 'cors'
        })
          .then(response => {
            var data = response.json()
            return data
          }
          )
          .then(data => {
            console.log(data.response_code)
            if (data.response_code == 200) {
              msg.style.display = 'block';
              msg.style.background = '#019e56'
              msg.innerHTML = 'OTP sent successfuly.'
              otp.classList.remove('hidden')
              setTimeout( () => {
                resend.classList.remove('hidden')
                resend.style.pointerEvents = 'all'
                resend.style.cursor = 'pointer'
              }, 10000)
              timer(10);
              otp.disabled = false
              btn.disabled = false;
              otp.focus()
              btn.value = 'Log In'
            } else {
              msg.style.display = 'block';
              msg.style.background = '#ff3333'
              msg.innerHTML = 'Error in sending the OTP, cross check your phone number.'
              btn.disabled = false;
              phone.focus();
            }
          })
          .catch(err => { console.log(err); });
      }else{
        msg.innerHTML = ""
      }
    }
  }

  if (otp.value == "") {
    msg.style.display = 'block';
    msg.style.background = '#ff3333'
    msg.innerHTML = "Please enter your otp";
    otp.focus();
    return false;
  } else {
    if (phone.value.length != 10) {
      msg.style.display = 'block';
      msg.style.background = '#ff3333'
      msg.innerHTML = "Please enter a valid 10 digit phone number";
      btn.disabled = false;
      phone.focus();
      return false;
    }else if (otp.value.length != 6) {
      msg.style.display = 'block';
      msg.style.background = '#ff3333'
      msg.innerHTML = "Please enter a valid 6 digit otp";
      btn.disabled = false;
      otp.focus();
      return false;
    } else {

      if (!otp.disabled) {

        let _data = {
          phone: phone.value,
          otp: otp.value,
          device: {
            fcm : "from_website_test"
          }
        }

        await fetch('https://app.geekstudios.tech/auth/v1/validate/otp', {
          method: "POST",
          body: JSON.stringify(_data),
          headers: { "Content-type": "application/json; charset=UTF-8" },
          mode: 'cors'
        })
          .then(response => {
            var data = response.json()
            return data
          }
          )
          .then(data => {
            console.log(data.response_code)
            if (data.response_code == 200) {
              msg.style.display = 'block';
              msg.style.background = '#019e56'
              msg.innerHTML = data.message
              setCookie('access-token', data.response.accessToken, 1)
              window.location.href = "";
            } else {
              msg.style.display = 'block';
              msg.style.background = '#ff3333'
              msg.innerHTML = data.message
              btn.disabled = false;
              otp.focus();
            }
          })
          .catch(err => { console.log(err); });
      }else{
        msg.innerHTML = ""
      }
    }
  }
})

$("#resend").click(async function(){
  var phone = document.form1.phone;
  var resend = document.getElementById('resend');
  var btn = document.form1.btn;
  var msg = document.getElementById('msg');

  btn.disabled = true;

  if (phone.value == "") {
    msg.style.display = 'block';
    msg.style.background = '#ff3333'
    msg.innerHTML = "Please enter your phone number";
    btn.disabled = false;
    phone.focus();
    return false;
  } else {
    if (phone.value.length != 10) {
      msg.style.display = 'block';
      msg.style.background = '#ff3333'
      msg.innerHTML = "Please enter a valid 10 digit phone number";
      btn.disabled = false;
      phone.focus();
      return false;
    } else {


        let _data = {
          phone: phone.value,
          account_type: "company"
        }

        await fetch('https://app.geekstudios.tech/auth/v1/login', {
          method: "POST",
          body: JSON.stringify(_data),
          headers: { "Content-type": "application/json; charset=UTF-8" },
          mode: 'cors'
        })
          .then(response => {
            var data = response.json()
            return data
          }
          )
          .then(data => {
            console.log(data.response_code)
            if (data.response_code == 200) {
              msg.style.display = 'block';
              msg.style.background = '#019e56'
              msg.innerHTML = 'OTP sent successfuly.'
              otp.classList.remove('hidden')
              resend.classList.add('hidden')
              resend.style.pointerEvents = 'none'
              resend.style.cursor = 'none'
              setTimeout( () => {
                resend.classList.remove('hidden')
                resend.style.pointerEvents = 'all'
                resend.style.cursor = 'pointer'
              }, 60000)
              timer(60);
              otp.disabled = false
              btn.disabled = false;
              otp.focus()
              btn.value = 'Log In'
            } else {
              msg.style.display = 'block';
              msg.style.background = '#ff3333'
              msg.innerHTML = 'Error in sending the OTP, cross check your phone number.'
              btn.disabled = false;
              phone.focus();
            }
          })
          .catch(err => { console.log(err); });
    }
  }
});

// ParticlesJS Config.
particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 60,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.1,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 6,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.1,
      "width": 2
    },
    "move": {
      "enable": true,
      "speed": 1.5,
      "direction": "top",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": false,
        "mode": "repulse"
      },
      "onclick": {
        "enable": false,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});