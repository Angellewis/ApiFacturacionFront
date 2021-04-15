import React, { Component } from "react";
import 'C:/Users/elang/facturacion3/src/App.css';
//import "/Volumes/Joel's External Drive/projects@/ApiFacturacionFront/src/App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const BaseUrl = "https://localhost:44304/api/";
const url = BaseUrl + "clientes/";

class App extends Component {
  state = {
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id: "",
      nombre: "",
      identificador: "",
      cuenta: "",
      estado: "",
      tipoModal: "",
    },
  };

  peticionGet = () => {
    axios
      .get(url)
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  valida_cedula = (ced) => {
    var c = ced.replace(/-/g, '');
    var cedula = c.substr(0, c.length - 1);
    var verificador = c.substr(c.length - 1, 1);
    var suma = 0;
    var cedulaValida;
    if (ced.length < 11) { return false; }
    for (let i = 0; i < cedula.length; i++) {
      let mod;
      if ((i % 2) == 0) { mod = 1 } else { mod = 2 }
      let res;
      res = cedula.substr(i, 1) * mod;
      if (res > 9) {
        res = res.toString();
        let uno = res.substr(0, 1);
        let dos = res.substr(1, 1);
        res = eval(uno) + eval(dos);
      }
      suma += eval(res);
    }
    let el_numero = (10 - (suma % 10)) % 10;
    if (el_numero == verificador && cedula.substr(0, 3) != "000") {
      cedulaValida = true;
    }
    else {
      cedulaValida = false;
    }
    return cedulaValida;
  };

  peticionPost = async () => {
    if (this.valida_cedula(this.state.form.identificador) == true) {
      delete this.state.form.id;
      await axios
        .post(url, this.state.form)
        .then((response) => {
          this.modalInsertar();
          this.peticionGet();
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      alert("Ingrese una cedula valida.")
    }
  };

  peticionPut = () => {
    axios.put(url + this.state.form.id, this.state.form).then((response) => {
      this.modalInsertar();
      this.peticionGet();
    });
  };

  peticionDelete = () => {
    axios.delete(url + this.state.form.id).then((response) => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    });
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarCliente = (cliente) => {
    this.setState({
      tipoModal: "actualizar",
      form: {
        id: cliente.id,
        nombre: cliente.nombre,
        identificador: cliente.identificador,
        cuenta: cliente.cuenta,
        estado: cliente.estado,
      },
    });
  };

  handleChange = async (e) => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
    console.log(this.state.form);
  };

  componentDidMount() {
    this.peticionGet();
  }

  render() {
    const { form } = this.state;
    return (
      <div className="App">
        <h2 className="display-2 bold">Seccion de clientes</h2>
        <hr></hr>
        <br />
        <button
          className="btn btn-success"
          onClick={() => {
            this.setState({ form: null, tipoModal: "insertar" });
            this.modalInsertar();
          }}
        >
          Agregar Cliente
        </button>
        <br />
        <br />
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Identificador</th>
              <th>N.Cuenta</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((cliente) => {
              return (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.identificador}</td>
                  <td>{cliente.cuenta}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        this.seleccionarCliente(cliente);
                        this.modalInsertar();
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    {"   "}
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        this.seleccionarCliente(cliente);
                        this.setState({ modalEliminar: true });
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: "block" }}>
            <span
              style={{ float: "right" }}
              onClick={() => this.modalInsertar()}
            >
              x
            </span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="id">ID</label>
              <input
                className="form-control"
                type="text"
                name="id"
                id="id"
                readOnly
                onChange={this.handleChange}
                value={form ? form.id : this.state.data.length + 1}
              />
              <br />
              <label htmlFor="nombre">Nombre</label>
              <input
                className="form-control"
                type="text"
                name="nombre"
                id="nombre"
                onChange={this.handleChange}
                value={form ? form.nombre : ""}
              />
              <br />
              <input type="radio" id="rnc" name="iden" value="rnc"></input>
              <label htmlFor="rnc">RNC</label>
              <br />
              <input
                type="radio"
                id="cedula"
                name="iden"
                value="cedula"
              ></input>
              <label htmlFor="cedula">CEDULA</label>
              <br />
              <input
                className="form-control"
                type="text"
                name="identificador"
                id="identificador"
                onChange={this.handleChange}
                value={form ? form.identificador : ""}
              />
              <br />
              <label htmlFor="cuenta">N.Cuenta</label>
              <input
                className="form-control"
                type="text"
                name="cuenta"
                id="cuenta"
                onChange={this.handleChange}
                value={form ? form.cuenta : ""}
              />
              <br />
              <label htmlFor="estado">Estado</label>
              <input
                className="form-control"
                type="text"
                name="estado"
                id="estado"
                onChange={this.handleChange}
                value={form ? form.estado : ""}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal == "insertar" ? (
              <button
                className="btn btn-success"
                onClick={() => this.peticionPost()}
              >
                Insertar
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => this.peticionPut()}
              >
                Actualizar
              </button>
            )}
            <button
              className="btn btn-danger"
              onClick={() => this.modalInsertar()}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            Estás seguro que deseas eliminar el cliente {form && form.nombre}?
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-danger"
              onClick={() => this.peticionDelete()}
            >
              Sí
            </button>
            <button
              className="btn btn-secundary"
              onClick={() => this.setState({ modalEliminar: false })}
            >
              No
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default App;
