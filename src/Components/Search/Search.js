import React, {Component} from "react";
import Autosuggest from 'react-autosuggest';
import '../../CSS/style.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
const request = require("request");

var languages = []
  
  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
   
    return inputLength < 3 ? [] : languages.filter(lang =>
      lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  const renderSuggestion = suggestion => (
    <div>
  {suggestion.name}
    </div>
  );

  const getSuggestionValue = suggestion => suggestion.name;
   
class Search extends Component{
    
    constructor(props) {
        super(props);
        this.state = {
            language: '',
            stars:'>1',
            order:'asc',
            value: '',
            suggestions: [],
            items: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleStarChange = this.handleStarChange.bind(this);
      }
      onChange = (event, { newValue }) => {
        this.setState({
          value: newValue
        });
      };
      handleChange(event) {
        this.setState({
            order: event.target.value
        });
      }
      handleStarChange(event) {
        this.setState({
            stars: event.target.value
        });
      }
      onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
          suggestions: getSuggestions(value)
        });
      };
      onSuggestionsClearRequested = () => {
        this.setState({
          suggestions: []
        });
      };
      componentDidMount() {
        try {
          request(
            {
              url: "https://api.github.com/search/repositories?q=stars:"+this.state.stars+"+language:"+this.state.value+"&sort="+this.state.stars+"&order="+this.state.order+"&type=Repositories",
              json: true
            },
            (error, response, body) => {
                console.log(body);
                this.setState({
                  items:body.items
              });
              for(var i=0;i<body.items.length;i++){
                  if(body.items[i].language != null && languages.some(el => el.name === body.items[i].language ) == 0){
                    languages.push({
                    name: body.items[i].language
                })
                  }
              }
              console.log(languages);
            }
          );
        } catch (err) {
          console.log(err);
        }
      }
        makeApiCall(){
            request(
                {
                  url: "https://api.github.com/search/repositories?q=stars:"+this.state.stars+"+language:"+this.state.value+"&sort=stars&order="+this.state.order+"&type=Repositories",
                  json: true
                },
                (error, response, body) => {
                    console.log(body);
                    this.setState({
                      items: body.items
                  });
                  
            }
            
            )}
            
      handleSubmit = () => {
        this.makeApiCall(this.state.order);
      }
    render(){
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: 'Type a programming language',
            value,
            onChange: this.onChange
          };
        return (
            <div className="search-filter">
              <div className="search-form">
        <label>Enter language you want to search:</label>
        <div className="form-element">
                    <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      /></div>
      
        <label>
        <div className="form-element">
          Order by:
          </div>
          <div className="form-element">
          <select value={this.state.order} onChange={this.handleChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          </div>
        </label>
        <label>
        <div className="form-element">
          Stars:
          </div>
          <div className="form-element">
          <select value={this.state.stars} onChange={this.handleStarChange}>
            <option value="<100">less than 100</option>
            <option value="<1000">less than 1000</option>
            <option value="<10000">less than 10000</option>
            <option value=">1">greater than 1</option>
            <option value=">100">greater than 100</option>
            <option value=">1000">greater than 1000</option>
            <option value=">10000">greater than 10000</option>
          </select>
          </div>
        </label>
        
        <div className="form-element">
        <button type="submit" value="Submit" onClick={this.handleSubmit}>Submit</button>
        </div>
        </div>
<br/>
          <div className="repolist">
            {this.state.items.map((repo,index) => {
              return(
                <div className="repoelement" key={index}>
                  <a href={repo.clone_url} target="_blank">
                {repo.full_name}</a>
                </div>
              )
            }
            )}
          </div>
          </div>
          );
    }
}

export default Search;