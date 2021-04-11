import React from 'react';
import './App.css';
import TabNav from './Components/TabNav';
import Tab from './Components/Tab';
import "bootstrap/dist/css/bootstrap.min.css";
import Clientes from './Components/clientes';
import Articulos from './Components/articulos';
import Vendedores from './Components/vendedores';
import Facturas from './Components/facturas';
import Asientos from './Components/AsientoContable';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'Home'
    }
  }
  setSelected = (tab) => {
    this.setState({ selected: tab });
  }
  render() {
    return (
      <div className="App mt-4">
        <TabNav tabs={['Articulos', 'Clientes', 'Vendedores', 'Facturas', 'Asientos']} selected={ this.state.selected } setSelected={ this.setSelected }>
          <Tab isSelected={ this.state.selected === 'Articulos' }>
            <Articulos />
          </Tab>
          <Tab isSelected={ this.state.selected === 'Clientes' }>
            <Clientes />
          </Tab>
          <Tab isSelected={ this.state.selected === 'Vendedores' }>
            <Vendedores />
          </Tab>
          <Tab isSelected={this.state.selected === 'Facturas'}>
            <Facturas />
          </Tab>
          <Tab isSelected={this.state.selected === 'Asientos'}>
            <Asientos />
          </Tab>
        </TabNav>
      </div>
    );
  }
}
export default App;