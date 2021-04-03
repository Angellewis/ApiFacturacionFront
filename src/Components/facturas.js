import React, { Component } from "react";
// import 'C:/Users/elang/facturacion3/src/App.css';
import "/Volumes/Joel's External Drive/projects@/ApiFacturacionFront/src/App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faPlus,
  faSmileBeam,
  faTrashAlt,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Select from "react-select";

const clientsEndPoint = "https://6f7c497b28aa.ngrok.io/api/clientes";
const sellersEndPoint = "https://6f7c497b28aa.ngrok.io/api/vendedores";
const articlesEndPoint = "https://6f7c497b28aa.ngrok.io/api/articulos";


class App extends Component {
  state = {
    data: [],
    clientList: [],
    sellerList: [],
    articlesListOptions: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id: "",
      clientID: "",
      sellerID: "",
      articlesList:[],
      tipoModal: "",
    },
  };

  render() {
    return (
      <div className="App container">
        <h2 className="display-2 bold">Seccion de facturación</h2>
        <hr></hr>
        <div className="row">
          <div className="offset-md-8 col-md-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                this.setState({ form: null, tipoModal: "insertar" });
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
                <div className="offset-md-1 col-md-2">
                  <label className="label-control" label-for="clientId">
                    Cliente
                  </label>
                </div>
                <div className="offset-md-1 col-md-7">
                  <Select
                    name="clientId"
                    id="clientId"
                    options={this.state.clientList}
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
                    options={this.state.sellerList}
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
                    options={this.state.sellerList}
                  />
                </div>
              </div>
              <hr></hr>
              <h3 className="display-5"> articulos</h3>
              {
                    this.this.state.form.articlesList.reduce( (acc, item) => 
                    (acc[item.id] = (acc[item.id] || 0) + 1, acc), {})
                    render() {
                        return (<p></p>)
                    }
              }
              <hr></hr>
            </form>
          </ModalBody>
        </Modal>
        {/* Edit Modal */}

        {/* Delete Modal */}
      </div>
    );
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

    handleArticleSelection = (article) => {
        let newArray = this.form.articlesList
        newArray.push(article)
        this.setState({ articlesList: newArray})
    }

    getClients = () => {
        axios
        .get(clientsEndPoint)
        .then((response) => {
            let options = response.data.map((client) => ({
            value: client.id,
            label: client.nombre,
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
            value: seller.id,
            label: seller.nombre,
            }));
            this.setState({ sellerList: options });
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
            value: article,
            label: article.nombre,
            }));
            this.setState({ articlesListOptions: options });
        })
        .catch((error) => {
            console.log(error.message);
        });
    }

    componentDidMount() {
        this.getClients();
        this.getSellers();
        this.getArticles();
    }
}

export default App;
