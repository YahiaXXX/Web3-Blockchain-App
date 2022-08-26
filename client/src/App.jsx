import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"
import Services from "./components/Services.jsx"
import Transactions from "./components/Transactions.jsx"
import Welcome from "./components/Welcome.jsx"

function App() {
  return (
    <div className="min-h-screen">
      <div className=" gradient-bg-welcome" >
        <Navbar/>
        <Welcome/>
      </div>
      <Services/>
      <Transactions/>
      <Footer/>

      
       
    </div>
  );
}

export default App;
