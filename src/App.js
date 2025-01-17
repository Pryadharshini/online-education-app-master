import "./App.css";
import Header from "./components/common/header/Header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import About from "./components/about/About";
import Pricing from "./components/pricing/Pricing";
import Blog from "./components/QuizGest/Gquiz";
import Contact from "./components/contact/Contact";
import Footer from "./components/common/footer/Footer";
import Home from "./components/home/Home";
import CourseHome from "./components/allcourse/CourseHome";
import Team from "./components/team/Team";
import Quiz from "./components/Quiz/Quiz";  // Import the Quiz component

function App() {
  return (
    <>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/courses" component={CourseHome} />
          <Route exact path="/team" component={Team} />
          <Route exact path="/pricing" component={Pricing} />
          <Route exact path="/journal" component={Blog} />
          <Route exact path="/quiz" component={Quiz} /> {/* Add route for quiz */}
          <Route exact path="/contact" component={Contact} />
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
