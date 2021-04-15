import React, { Component } from "react";
import 'C:/Users/elang/facturacion3/src/App.css';
//import "/Volumes/Joel's External Drive/projects@/ApiFacturacionFront/src/App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faPlus,
  faSmileBeam,
  faTrashAlt,
  faInfoCircle,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader, InputGroup, Input, InputGroupAddon, InputGroupText } from "reactstrap";
import Select from "react-select";

const BaseUrl = "https://localhost:44304/api/";
const clientsEndPoint = BaseUrl + "clientes/";
const sellersEndPoint = BaseUrl + "vendedores/";
const articlesEndPoint = BaseUrl + "articulos/";
const facturasEndPoint = BaseUrl + "facturas/";
const detallesEndPoint = BaseUrl + "detalles/";


class App extends Component {
  state = {
    data: [],
    clientList: [],
    sellerList: [],
    facturasList: [],
    facturaunit: [],
    detallesunit: [],
    newArticles: [],
    articlesListOptions: [],
    modalInsertar: false,
    modalEliminar: false,
    modalDetalles: false,
    form: {
      id: "",
      clienteid: [],
      vendedorid: [],
      tipoModal: "",
      fecha: "",
      comentario: "",
      precio_Total: "",
      cant_Articulos: ""
    },
    formDetalle: {
      id: "",
      facturaid: "",
      articuloid: [],
      cant_articulo: ""
    },
    formArticulo: {
      id: "",
      descripcion: "",
      precio: "",
      stock: "",
      estado: "",
    }
  };

  render() {
    const { form, formDetalle, formArticulo } = this.state;
    return (
      <div className="App container">
        <h2 className="display-2 bold">Seccion de facturación</h2>
        <hr></hr>
        <br />
        <div className="row">
          <div className="offset-md-8 col-md-2">
            <button
              className="btn btn-success center"
              onClick={() => {
                this.setState({ form: { tipoModal: "insertar" } });
                this.getCurrentDate('/');
                this.modalInsertar();
              }}
            >
              Agregar factura
              <span>
                <FontAwesomeIcon icon={faPlus} className="ml-1" />
              </span>
            </button>
          </div>
        </div>

        {/* Facturas List */}
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Comentario</th>
              <th>Vendedor</th>
              <th>Cliente</th>
              <th>Cant. Articulos</th>
              <th>Total Facturado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.facturasList.map((factura) => {
              return (
                <tr key={factura.id}>
                  <td>{factura.id}</td>
                  <td>{factura.fecha}</td>
                  <td>{factura.comentario}</td>
                  <td>{factura.vendedor}</td>
                  <td>{factura.cliente}</td>
                  <td>{factura.cant_Articulos}</td>
                  <td>{factura.precio_Total}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        this.seleccionarfactura(factura);
                        this.setState({ modalDetalles: true });
                      }}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        this.seleccionarfactura(factura);
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
        {/* Add Modal */}
        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader className="container-fluid" style={{ display: "block" }}>
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-6">
                  <h2 className="display-3 display-5">Nueva Factura </h2>
                </div>
                <button
                  className="offset-md-3 col-md-2 btn btn-danger"
                  style={{ float: "right" }}
                  onClick={() => this.modalInsertar()}
                >
                  <span>
                    <FontAwesomeIcon icon={faWindowClose} />
                  </span>
                </button>
              </div>
            </div>
          </ModalHeader>
          <ModalBody style={{ display: "block" }}>
            <form>
              <div className="contianer row form-group">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Fecha</InputGroupText>
                  </InputGroupAddon>
                  <Input value={this.state.form.fecha} className="form-control" disabled />
                </InputGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Comentario</InputGroupText>
                  </InputGroupAddon>
                  <Input className="form-control" value={this.state.form.comentario} onChange={this.onChangeGeneral} />
                </InputGroup>
              </div>
              <div className="contianer row form-group">
                <div className="offset-md-1 col-md-2">
                  <label className="label-control" label-for="clientId">
                    Cliente
                  </label>
                </div>
                <div className="offset-md-1 col-md-7">
                  <Select
                    name="clientId"
                    id="clientId"
                    placeholder="Cliente"
                    getOptionLabel={this.getOptionLabel}
                    options={this.state.clientList}
                    onChange={this.handleClientSelection}
                  />
                </div>
              </div>
              <div className="contianer row form-group">
                <div className="offset-md-1 col-md-2">
                  <label className="label-control" label-for="vendedorId">
                    Vendedor
                  </label>
                </div>
                <div className="offset-md-1 col-md-7">
                  <Select
                    name="vendedorId"
                    id="vendedorId"
                    placeholder="Vendedor"
                    options={this.state.sellerList}
                    getOptionLabel={this.getOptionLabel}
                    onChange={this.handleSellerSelection}
                  />
                </div>
              </div>
              <div className="contianer row form-group">
                <div className="offset-md-1 col-md-2">
                  <label className="label-control" label-for="articleId">
                    articulos
                  </label>
                </div>
                <div className="offset-md-1 col-md-7">
                  <Select
                    isMulti
                    name="articleId"
                    id="articleId"
                    placeholder="Articulos"
                    onChange={this.handleArticleSelection}
                    options={this.state.articlesListOptions}
                  />
                </div>
              </div>
              <hr></hr>
              <h3 className="display-5"> articulos</h3>
              <hr></hr>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Cantidad de articulos</InputGroupText>
                </InputGroupAddon>
                <Input className="form-control" value={this.state.form.cant_Articulos} disabled />
              </InputGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Total</InputGroupText>
                </InputGroupAddon>
                <Input className="form-control" value={this.state.form.precio_Total} disabled />
              </InputGroup>
            </form>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-success"
              onClick={this.postFactura}
            >
              Facturar
            </button>
          </ModalFooter>
        </Modal>
        {/* Details Modal */}
        <Modal className="modal-lg" isOpen={this.state.modalDetalles}>
          <ModalHeader style={{ display: "block" }}>
            <div className="row">
              <p className="col-sm-11">Detalle de la factura</p>
              <button
                className="btn btn-sm btn-danger col-sm-1"
                style={{ float: "right" }}
                onClick={() => this.setState({ modalDetalles: false })}>
                <span>
                  <FontAwesomeIcon icon={faWindowClose} />
                </span>
              </button>
            </div>
          </ModalHeader>
          <ModalBody>
            <div>
              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>ID</InputGroupText>
                </InputGroupAddon>
                <Input value={form ? form.id : ""} disabled />
              </InputGroup>
              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Fecha</InputGroupText>
                </InputGroupAddon>
                <Input value={form ? form.fecha : ""} disabled />
              </InputGroup>
              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Comentario</InputGroupText>
                </InputGroupAddon>
                <Input value={form ? form.comentario : ""} disabled />
              </InputGroup>
              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Vendedor</InputGroupText>
                </InputGroupAddon>
                <Input value={form ? form.vendedor : ""} disabled />
              </InputGroup>
              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Cliente</InputGroupText>
                </InputGroupAddon>
                <Input value={form ? form.cliente : ""} disabled />
              </InputGroup>
              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText color="Secondary">Total Facturado</InputGroupText>
                </InputGroupAddon>
                <Input value={form ? form.precio_Total : ""} disabled />
              </InputGroup>
            </div>
          </ModalBody>
          <ModalFooter>
            {/*Articles by factura*/}
            <table className="table ">
              <thead>
                <tr>
                  <th>Articulo</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {this.state.detallesunit.map((detalle) => {
                  return (
                    <tr key={detalle.id}>
                      <td>{detalle.articulo}</td>
                      <td>{detalle.precio}</td>
                      <td>{detalle.cantidad}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ModalFooter>
        </Modal>
        {/*Los usuarios no podran editar las facturas, solo eliminarlas y crearlas nuevamente para llevar un mejor control. */}
        {/* Delete Modal */}
        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            Estás seguro que deseas eliminar la factura{" "}
            {form && form.id}?
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

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  modalDetalles = () => {
    this.setState({ modalDetalles: !this.state.modalDetalles });
  };

  handleArticleSelection = (value) => {
    var cantidad = value.map((value) => value.precio).reduce((a, b) => a + b, 0);
    var article = value.map((article) => article.value);
    var article2 = value.map((article) => ({
      id: article.value,
      descripcion: article.descripcion,
      precio: article.precio,
      stock: article.stock - 1,
      estado: article.estado
    }));
    //this.setState({article : article, article.cantidad: value.length, total: cantidad});
    this.setState({ form: { ...this.state.form, cant_Articulos: value.length, precio_Total: cantidad, fecha: this.state.form.fecha } });
    this.setState({ formDetalle: { articuloid: article } });
    this.setState({ formArticulo: article2 });
  }

  getOptionLabel = (option) => option.nombre;

  handleClientSelection = (value) => {
    var client = this.state.form;
    var modifiedValue = value.id;
    client.clienteid = modifiedValue;
    this.setState({ client: client });
  }

  handleSellerSelection = (value) => {
    var seller = this.state.form;
    var modifiedValue = value.id;
    seller.vendedorid = modifiedValue;
    this.setState({ seller: seller });
  }

  onChangeGeneral = (value) => {
    var comment = this.state.form;
    var modifiedValue = value.target.value;
    comment.comentario = modifiedValue;
    this.setState({ comment: comment });
  }

  postFactura = async () => {
    await axios
      .post(facturasEndPoint, this.state.form)
      .then((response) => {
        this.setState({ formDetalle: { ...this.state.formDetalle, facturaid: response.data.id, cant_articulo: 1 } });
        this.postDetalle();
        this.getFacturas();
        this.modalInsertar();
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  postDetalle = async () => {
    for (let x of this.state.formDetalle.articuloid) {
      this.setState({ formDetalle: { ...this.state.formDetalle, articuloid: x } }, this.detailPost);
    }
    this.articleidPut();
  }

  detailPost = async () => {
    await axios
      .post(detallesEndPoint, this.state.formDetalle)
      .then((response) => {
        this.getFacturas();
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  articleidPut = () => {
    for (let x of this.state.formArticulo) {
      var ids = x.id;
      var article = this.state.formArticulo.find(art => art.id === ids);
      //this.setState({ formArticulo: { ...this.state.formArticulo} }, this.articlesPut);
      axios.put(articlesEndPoint + ids, article).then((response) => {
        this.getFacturas();
      });
    }
  };
  /*
   articlesPut = () => {
    Object.entries(this.state.formArticulo).map(item => {
      console.log(item)
    })
    axios.put(articlesEndPoint + id, objeto).then((response) => {
      this.getFacturas();
    }); 
  } */


  getClients = () => {
    axios
      .get(clientsEndPoint)
      .then((response) => {
        let options = response.data.map((client) => ({
          id: client.id,
          nombre: client.nombre,
          identificador: client.identificador,
          cuenta: client.cuenta,
          estado: client.estado,
        }));
        this.setState({ clientList: options });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  getSellers = () => {
    axios
      .get(sellersEndPoint)
      .then((response) => {
        let options = response.data.map((seller) => ({
          id: seller.id,
          nombre: seller.nombre,
          cedula: seller.cedula,
          comision: seller.comision,
          estado: seller.estado,
        }));
        this.setState({ sellerList: options });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  getFacturas = () => {
    axios
      .get(facturasEndPoint)
      .then((response) => {
        let options = response.data.map((factura) => ({
          id: factura.id,
          fecha: factura.fecha,
          comentario: factura.comentario,
          vendedor: factura.vendedores.nombre,
          cliente: factura.clientes.nombre,
          cant_Articulos: factura.cant_Articulos,
          precio_Total: factura.precio_Total
        }));
        this.setState({ facturasList: options });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  getDetalles = () => {
    axios
      .get(detallesEndPoint + this.state.form.id)
      .then((response) => {
        let options = response.data.map((detalles) => ({
          id: detalles.id,
          articulo: detalles.articulos.descripcion,
          precio: detalles.articulos.precio,
          cantidad: detalles.cant_articulo,
        }));
        this.setState({ detallesunit: options });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  getArticles = () => {
    axios
      .get(articlesEndPoint)
      .then((response) => {
        let options = response.data.map((article) => ({
          value: article.id,
          descripcion: article.descripcion,
          precio: article.precio,
          stock: article.stock,
          estado: article.estado,
          label: article.descripcion,
        }));
        this.setState({ articlesListOptions: options });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  peticionDelete = () => {
    axios.delete(facturasEndPoint + this.state.form.id).then((response) => {
      this.setState({ modalEliminar: false });
      this.getFacturas();
    });
  };

  seleccionarfactura = (factura) => {
    this.setState({
      form: {
        id: factura.id,
        fecha: factura.fecha,
        comentario: factura.comentario,
        vendedor: factura.vendedor,
        cliente: factura.cliente,
        precio_Total: factura.precio_Total
      },
      formDetalle: {
        id: factura.id
      },
    }, this.getDetalles);
  };

  loadArticleList = () => {
    if (!this.state.form.articlesList) {
      this.state.newArticles = Object.values(
        this.state.form.articlesList.reduce((acc, o) =>
          (acc[o.id] = { ...o, qty: (acc[o.id] ? acc[o.id].qty : 0) + 1 }, acc), {}
        ))
    }
  };

  getCurrentDate = (separator = '') => {

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    let fecha = `${month < 10 ? `0${month}` : `${month}`}${separator}${date}${separator}${year}`;
    this.setState({ form: { fecha: fecha } });
  }

  componentDidMount() {
    this.getClients();
    this.getSellers();
    this.getArticles();
    this.getFacturas();
  }
}

export default App;
