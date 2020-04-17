import React from "react";
import { Route, Switch } from "react-router-dom";
import Search from './Components/Search/Search'

const MainRouter = () => {
    return (
      <div>
        <Switch>
          <Route exact path="/search" component={Search} />
        </Switch>
      </div>
    );
  };
  
  export default MainRouter;