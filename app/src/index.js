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
var PhoneSpec = React.createClass({
  render: function(){
    var phoneDetail = this.props.phoneDetail,
        dim = [];
    for (var i=0; i < phoneDetail.sizeAndWeight.dimensions.length; i++) {
      dim.push(<dd>{phoneDetail.sizeAndWeight.dimensions[i]}</dd>);
    }
    return (
        <ul className="specs">
          <li>
            <span>Availability and Networks</span>
            <dl>
              <dt>Availability</dt>
              <dd>{phoneDetail.availability}</dd>
            </dl>
          </li>
          <li>
            <span>Battery</span>
            <dl>
              <dt>Type</dt>
              <dd>{phoneDetail.battery.type}</dd>
              <dt>Talk Time</dt>
              <dd>{phoneDetail.battery.talkTime}</dd>
              <dt>Standby time (max)</dt>
              <dd>{phoneDetail.battery.standbyTime}</dd>
            </dl>
          </li>
          <li>
            <span>Storage and Memory</span>
            <dl>
              <dt>RAM</dt>
              <dd>{phoneDetail.storage.ram}</dd>
              <dt>Internal Storage</dt>
              <dd>{phoneDetail.storage.flash}</dd>
            </dl>
          </li>
          <li>
            <span>Connectivity</span>
            <dl>
              <dt>Network Support</dt>
              <dd>{phoneDetail.connectivity.cell}</dd>
              <dt>WiFi</dt>
              <dd>{phoneDetail.connectivity.wifi}</dd>
              <dt>Bluetooth</dt>
              <dd>{phoneDetail.connectivity.bluetooth ? '\u2713' : '\u2718'}</dd>
              <dt>Infrared</dt>
              <dd>{phoneDetail.connectivity.infrared ? '\u2713' : '\u2718' }</dd>
              <dt>GPS</dt>
              <dd>{phoneDetail.connectivity.gps ? '\u2713' : '\u2718'}</dd>
            </dl>
          </li>
          <li>
            <span>Android</span>
            <dl>
              <dt>OS Version</dt>
              <dd>{phoneDetail.android.os}</dd>
              <dt>UI</dt>
              <dd>{phoneDetail.android.ui}</dd>
            </dl>
          </li>
          <li>
            <span>Size and Weight</span>
            <dl>
              <dt>Dimensions</dt>
              <dd>{dim}</dd>
              <dt>Weight</dt>
              <dd>{phoneDetail.sizeAndWeight.weight}</dd>
            </dl>
          </li>
          <li>
            <span>Display</span>
            <dl>
              <dt>Screen size</dt>
              <dd>{phoneDetail.display.screenSize}</dd>
              <dt>Screen resolution</dt>
              <dd>{phoneDetail.display.screenResolution}</dd>
              <dt>Touch screen</dt>
              <dd>{phoneDetail.display.touchScreen ? '\u2713' : '\u2718'}</dd>
            </dl>
          </li>
          <li>
            <span>Hardware</span>
            <dl>
              <dt>CPU</dt>
              <dd>{phoneDetail.hardware.cpu}</dd>
              <dt>USB</dt>
              <dd>{phoneDetail.hardware.usb}</dd>
              <dt>Audio / headphone jack</dt>
              <dd>{phoneDetail.hardware.audioJack}</dd>
              <dt>FM Radio</dt>
              <dd>{phoneDetail.hardware.fmRadio ? '\u2713' : '\u2718'}</dd>
              <dt>Accelerometer</dt>
              <dd>{phoneDetail.hardware.accelerometer ? '\u2713' : '\u2718'}</dd>
            </dl>
          </li>
          <li>
            <span>Camera</span>
            <dl>
              <dt>Primary</dt>
              <dd>{phoneDetail.camera.primary}</dd>
              <dt>Features</dt>
              <dd>{phoneDetail.camera.features.join(', ')}</dd>
            </dl>
          </li>
          <li>
            <span>Additional Features</span>
            <dd>{phoneDetail.additionalFeatures}</dd>
          </li>
        </ul>
    );
  }
});


var PhoneDetail = React.createClass({
  getInitialState: function() {
    return {
      phoneDetail: {
        images: [],
        battery: {},
        storage: {},
        connectivity: {},
        android:{},
        sizeAndWeight: {
          dimensions: []
        },
        display: {},
        hardware: {},
        camera: {
          features: []
        }
      }
    };
  },
  componentWillMount: function() {
    $.ajax({
      url: 'phones/'+this.props.params.phoneId+'.json',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({phoneDetail: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('Phone Detail Loading Failed', status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    var phoneDetail = this.state.phoneDetail,
        phoneImageList = [];
    for (var i=0; i < phoneDetail.images.length; i++) {
      phoneImageList.push(<li><img src={phoneDetail.images[i]}/></li>);
    }
    return (
        <div>
          <div className='phone-images'>
            <img className="phone" src={phoneDetail.images[0]}/>
          </div>
          <h1 class="ng-binding ng-scope">{phoneDetail.name}</h1>
          <p>{phoneDetail.description}</p>
          <ul className="phone-thumbs">
            {phoneImageList}
          </ul>
          <PhoneSpec phoneDetail={phoneDetail}></PhoneSpec>
        </div>
    );
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