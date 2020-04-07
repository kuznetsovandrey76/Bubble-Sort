import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap/dist/js/bootstrap.js';
import '../css/style.scss'

import fork_me_img from '../img/forkme.svg';

const Render = require('./Render')
const Action = require('./Action')

const render = new Render();
render.init()
render.update(fork_me_img)

Action.create()