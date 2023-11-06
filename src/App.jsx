
import './App.css';
import ImageContainer from './Components/ImageContainer';




function App() {
  
 
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className='text-center bg-slate-400 p-5 text-white text-2xl mb-5'>Responsive Image Gallery </h1>
      <hr className='mt-5' />
    <ImageContainer/>
  </div>
  )
}

export default App
