import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import 'C:/Users/elang/facturacion3/src/App.css';
//import '/Volumes/Joel\'s External Drive/projects@/ApiFacturacionFront/src/App.css';
class TabNav extends React.Component {
  render() {
    return (
        <div style={{ width: '100%' }}>
        <ul className="nav nav-tabs">
        {
  this.props.tabs.map(tab => {
              const active = (tab === this.props.selected ? 'active ' : '' );
    return (
      <li className="nav-item" key={ tab }>
        <a className={"pointer nav-link " + active } onClick={ () => this.props.setSelected(tab) }>
          { tab }
        </a>
      </li>
    );
  })
}  
        </ul>
        { this.props.children }
      </div>
    );
  }
}
export default TabNav;