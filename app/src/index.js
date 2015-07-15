requirejs.config({
  "paths": {
    "react-router": "//cdnjs.cloudflare.com/ajax/libs/react-router/0.13.3/ReactRouter",
    "react": "lib/react.min",
    "jquery": "lib/jquery-1.11.1.min"
  },
  shim: {
    "react-router": {
      deps: ['react']
    }
  }
});

require(['react', 'react-router', 'jquery'], function (React, ReactRouter, $) {
  var Router = ReactRouter;
  var Route = ReactRouter.Route;
  var Link = ReactRouter.Link;




var PhoneRow = React.createClass({
  render: function() {
    return (
          <li className="thumbnail phone-listing">
            <a href={"#/phones/"+this.props.phone.id} className="thumb">
              <img src={this.props.phone.imageUrl}/>
            </a>
            <a href={"#/phones/"+this.props.phone.id}>{this.props.phone.name}</a>
            <p>{this.props.phone.snippet}</p>
            </li>
    );
  }
});

var PhoneList = React.createClass({
  render: function() {
    var rows = [];
    if(this.props.phones){
      this.props.phones.forEach(function(phone) {
        if (phone.name.toLowerCase().
                indexOf(this.props.filterText.toLowerCase()) === -1) {
          return;
        }
        rows.push(<PhoneRow phone={phone} key={phone.name} />);
      }.bind(this));
    }
    if(this.props.sortBy === 'alphabetically'){
      rows.sort(function(fobj, sobj){
        if(fobj.props.phone.name.toLowerCase() < sobj.props.phone.name.toLowerCase()) return -1;
        if(fobj.props.phone.name.toLowerCase() > sobj.props.phone.name.toLowerCase()) return 1;
        return 0;
      });
    }
    if(this.props.sortBy === 'newest'){
      rows.sort(function(fobj, sobj){
        return fobj.props.phone.age - sobj.props.phone.age;
      });
    }

    return (
        <ul className="phones">
          {rows}
        </ul>
    );
  }
});


var SearchBar = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
        this.refs.filterTextInput.getDOMNode().value
    );
  },
  handleSortChange: function(){
    this.props.onSortChange(
        this.refs.sortInput.getDOMNode().value
    );
  },
  render: function() {
    return (
        <form>
          <div>Search: &nbsp;
          <input
            type="text"
            style={{width:105}}
            placeholder="Search"
            value={this.props.filterText}
            ref="filterTextInput"
            onChange={this.handleChange}
            />
            </div>
          <div>
            Sort By: &nbsp;
            <select
                value={this.props.sortBy}
                ref="sortInput"
                onChange={this.handleSortChange}
                >
              <option value='alphabetically'>Alphabetically</option>
              <option value='newest'>Newest</option>
            </select>
            </div>
        </form>
    );
  }
});

var PhoneDetail = React.createClass({
  render: function() {
    var phoneId = this.props.params.phoneId;
    return (<div>{phoneId}</div>);
  }
});

var Phonecat = React.createClass({
      getInitialState: function() {
        return {
          filterText: '',
          sortBy: 'alphabetically'
        };
      },
      componentWillMount: function() {
        $.ajax({
          url: 'phones/phones.json',
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({phones: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error('Phones Loading Failed', status, err.toString());
          }.bind(this)
        });
      },
      handleTextInput: function(filterText) {
        this.setState({
          filterText: filterText,
          sortBy: 'alphabetically'
        });
      },
      handleSortChange: function(sortBy) {
        this.setState({
          filterText: '',
          sortBy: sortBy
        });
      },
      render: function() {
        return (
            <div className="row containerRow">
              <div className="col-md-2">
                <SearchBar
                    filterText={this.state.filterText}
                    sortBy={this.state.sortBy}
                    onUserInput={this.handleTextInput}
                    onSortChange={this.handleSortChange}
                    />
              </div>
              <div className="col-md-10">
                <PhoneList
                    phones={this.state.phones}
                    filterText={this.state.filterText}
                    sortBy={this.state.sortBy}
                    />
              </div>
            </div>
);
}
});
  var RouteHandler = Router.RouteHandler;
  var App = React.createClass({
    render () {
      return (
            <RouteHandler/>
      )
    }
  });

  var routes = (
      <Route handler={App}>
        <Route path="" handler={Phonecat}/>
        <Route path="phones/:phoneId" handler={PhoneDetail}/>
      </Route>
  );

  Router.run(routes, Router.HashLocation, function(Root){
    React.render(<Root/>, document.body);
  });

});