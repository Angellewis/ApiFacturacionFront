import React, { Component } from "react";
import 'C:/Users/elang/facturacion3/src/App.css';

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader, InputGroup, Input, InputGroupAddon, InputGroupText } from "reactstrap";
import Select from "react-select";

const BaseUrl = "https://localhost:44304/api/facturas/";
const AsientoUrl = BaseUrl + "getAsientos";
const EndpointContable = "https://eb6ec1171113.ngrok.io/api/accountingEntry/";
const Asientonotnull = "https://localhost:44304/api/Facturas/getAsientosnotnull";

class App extends Component {
  state = {
    data: [],
    asientos: [],
    form: {
      idAuxiliarSystem: 3,
      description: "Asiento de facturacion correspondiente al periodo 2021-04",
      account: "13",
      movementType: "DB",
      seatAmount: "",
      status: true,
    },
    formFactura: {
      id: "",
      fecha: "",
      comentario: "",
      vendedorid: "",
      clienteid: "",
      cant_Articulos: "",
      precio_Total: "",
      asiento: ""
    }
  };

  getAsientos = () => {
    axios
      .get(AsientoUrl)
      .then((response) => {
        let options = response.data.map((factura) => ({
          id: factura.id,
          fecha: factura.fecha,
          comentario: factura.comentario,
          vendedorid: factura.vendedorid,
          clienteid: factura.clienteid,
          cant_Articulos: factura.cant_Articulos,
          precio_Total: factura.precio_Total,
          asiento: factura.asiento
        }));
        this.setState({ data: options });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  getfacturas = () => {
    axios
      .get(Asientonotnull)
      .then((response) => {
        let options = response.data.map((asiento) => ({
          id: asiento.id,
          fecha: asiento.fecha,
          comentario: asiento.comentario,
          vendedorid: asiento.vendedorid,
          clienteid: asiento.clienteid,
          cant_Articulos: asiento.cant_Articulos,
          precio_Total: asiento.precio_Total,
          asiento: asiento.asiento
        }));
        this.setState({ asientos: options });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  gettotal = () => {
    var totalArray = [];
    for (let x of this.state.data) {
      var precios = x.precio_Total;
      totalArray.push(precios);
    }
    var total = totalArray.reduce((a, b) => a + b, 0);
    this.setState({ form: { ...this.state.form, seatAmount: total } });
    console.log(this.state.form);
  };

  postAsiento = async () => {
    await axios
      .post(EndpointContable, this.state.form)
      .then((response) => {
        this.putFacturas(response.data.id);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  putFacturas = async (acontable) => {
    for (let x in this.state.data) {
      var factura = this.state.data.find(fact => fact.asiento === null);
      factura.asiento = acontable;
      var ids = factura.id;
      //Put para cada factura ahora
      axios.put(BaseUrl + ids, factura).then((response) => {
        this.getAsientos();
        this.getfacturas();
      });
      console.log(ids);
      console.log(factura);
    }
  }

  componentDidMount() {
    this.getAsientos();
    this.getfacturas();
  }

  render() {
    const { form } = this.state;
    return (
      <div className="App">
        <h2 className="display-2 bold">Seccion de Asientos</h2>
        <hr></hr>
        <br />
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripcion</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((asiento) => {
              return (
                <tr key={asiento.id}>
                  <td>{asiento.id}</td>
                  <td>{asiento.comentario}</td>
                  <td>{asiento.fecha}</td>
                  <td>{asiento.precio_Total}</td>
                  <td>{asiento.asiento}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td></td>
              <td><button className="btn btn-warning" onClick={() => { this.gettotal(); }}>Obtener Total</button></td>
              <td>{this.state.form.seatAmount}</td>
              <td><button
                className="btn btn-success"
                onClick={() => {
                  this.postAsiento();
                }}
              >
                Contabilizar
          </button></td>
            </tr>
          </tfoot>
        </table>
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripcion</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Id.Asiento</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.asientos.map((asiento) => {
              return (
                <tr key={asiento.id}>
                  <td>{asiento.id}</td>
                  <td>{asiento.comentario}</td>
                  <td>{asiento.fecha}</td>
                  <td>{asiento.precio_Total}</td>
                  <td>{asiento.asiento}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
export default App;