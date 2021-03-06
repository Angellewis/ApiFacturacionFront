import React, { Component } from 'react';
//import '/Volumes/Joel\'s External Drive/projects@/ApiFacturacionFront/src/App.css';
import 'C:/Users/elang/facturacion3/src/App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

const BaseUrl = "https://localhost:44304/api/";
const url = BaseUrl + "vendedores/";

class App extends Component {
  state = {
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id: '',
      nombre: '',
      cedula: '',
      comision: '',
      estado: '',
      tipoModal: '',
    }
  }


  peticionGet = () => {
    axios.get(url).then(response => {
      this.setState({ data: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }
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
  }

  peticionPost = async () => {
    if (this.valida_cedula(this.state.form.cedula) == true) {
      delete this.state.form.id;
      await axios.post(url, this.state.form).then(response => {
        this.modalInsertar();
        this.peticionGet();
      }).catch(error => {
        console.log(error.message);
      })
    } else {
      alert("Por favor introduzca una cedula valida.")
    }
  }

  peticionPut = () => {
    axios.put(url + this.state.form.id, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    })
  }

  peticionDelete = () => {
    axios.delete(url + this.state.form.id).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    })
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  seleccionarvendedor = (vendedor) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: vendedor.id,
        nombre: vendedor.nombre,
        cedula: vendedor.cedula,
        comision: vendedor.comision,
        estado: vendedor.estado
      }
    })
  }

  handleChange = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  componentDidMount() {
    this.peticionGet();
  }


  render() {
    const { form } = this.state;
    return (
      <div className="App">
        <h2 className="display-2 bold">Seccion de vendedores</h2>
        <hr></hr>
        <br />
        <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>
          Agregar Vendedor
    </button>
        <br /><br />
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cedula</th>
              <th>Comision</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(vendedor => {
              return (
                <tr key={vendedor.id}>
                  <td>{vendedor.id}</td>
                  <td>{vendedor.nombre}</td>
                  <td>{vendedor.cedula}</td>
                  <td>{vendedor.comision}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => { this.seleccionarvendedor(vendedor); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                    {"   "}
                    <button className="btn btn-danger" onClick={() => { this.seleccionarvendedor(vendedor); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>



        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="id">ID</label>
              <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : this.state.data.length + 1} />
              <br />
              <label htmlFor="nombre">Nombre</label>
              <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form ? form.nombre : ''} />
              <br />
              <label htmlFor="cedula">Cedula</label><br />
              <input className="form-control" type="text" name="cedula" id="cedula" onChange={this.handleChange} value={form ? form.cedula : ''} />
              <br />
              <label htmlFor="comision">Comision</label>
              <input className="form-control" type="text" name="comision" id="comision" onChange={this.handleChange} value={form ? form.comision : ''} />
              <br />
              <label htmlFor="estado">Estado</label>
              <input className="form-control" type="text" name="estado" id="estado" onChange={this.handleChange} value={form ? form.estado : ''} />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal == 'insertar' ?
              <button className="btn btn-success" onClick={() => this.peticionPost()}>
                Insertar
                  </button> : <button className="btn btn-primary" onClick={() => this.peticionPut()}>
                Actualizar
                  </button>
            }
            <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            Est??s seguro que deseas eliminar el vendedor {form && form.nombre}?
            </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.peticionDelete()}>S??</button>
            <button className="btn btn-secundary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
          </ModalFooter>
        </Modal>
      </div>



    );
  }
}
export default App;