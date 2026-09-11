import O_MenuBar from './components/O_MenuBar/O_MenuBar.jsx'
import { ready, renderInto } from './lib/dom.js'

ready(() => renderInto('.W_Menu', <O_MenuBar />))
