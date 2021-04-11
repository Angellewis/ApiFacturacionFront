import React, { Component } from "react";
import 'C:/Users/elang/facturacion3/src/App.css';

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const BaseUrl = "https://localhost:44304/api/";
const articleStock = BaseUrl + "articulos/getArticuloStock";
const facturaTotal = BaseUrl + "facturas/getFacturaDates";

class App extends Component {
    state = {
      form: {
        id: "",
        Ingresos: "",
        Inventario: "",
      },
    };
  
    gerArticles = () => {
      axios
        .get(articleStock)
        .then((response) => {
          this.setState({form:{ ...this.state.form, Inventario: response.data}});
        })
        .catch((error) => {
          console.log(error.message);
        });
    };

    getFacturas = () => {
        axios
          .get(facturaTotal)
          .then((response) => {
            this.setState({form:{ ...this.state.form, Ingresos: response.data}});
          })
          .catch((error) => {
            console.log(error.message);
          });
      };
  /*
    peticionPost = async () => {
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
    }; */
  
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
      this.gerArticles();
      this.getFacturas();
    }
  
    render() {
      const { form } = this.state;
      return (
          <div className="container">
              <input value={this.state.form.Ingresos} disabled></input>
              <input value={this.state.form.Inventario} disabled></input>
          </div>
      );
    }
  }
  export default App;