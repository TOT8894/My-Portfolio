import './App.css'
import './components/navigationBar.css'
import { NavigationBar } from './components/navigationBar'
import { Footer } from './components/footer'
import { About } from './pages/about'
import { Contact } from './pages/contact'
import { Home } from './pages/home'
import { Skill } from './pages/skill'
import { Projects } from './pages/projects'

function App() {
      return(
        <>
        <NavigationBar/>
        <Home/>
        <About/>
        <Skill/>
        <Projects/>
        <Contact/>
        <Footer/>
        </>
      )
}

export default App
