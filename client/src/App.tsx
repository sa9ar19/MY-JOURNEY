import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import GalleryDetail from "./pages/GalleryDetail";
import Blog from "./pages/Blog";
import ViewBlog from "./pages/ViewBlog";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Destinations from "./pages/Destinations";
import EditDestination from "./pages/EditDestination";
import DestinationDetail from "./pages/DestinationDetail";
import ViewDestination from "./pages/ViewDestination";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/gallery/:id"} component={GalleryDetail} />
      <Route path={"/blogs"} component={Blog} />
      <Route path={"/blogs/:id"} component={ViewBlog} />
      <Route path={"/about"} component={About} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/404"} component={NotFound} />
      <Route path="/login" component={Login} />
      <Route path="/destinations" component={Destinations} />
      {/* <Route path="/destinations/:slug" component={EditDestination} /> */}
      <Route path="/destinations/:id" component={ViewDestination} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="bottom-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
