import React from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Libros = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    if (auth.currentUser) {
      console.log("Existe un usuario");
      setUser(auth.currentUser);
      console.log(user);
    } else {
      console.log("No existe un usuario");
      navigate("/login");
    }
  }, [navigate]);

  const [lista, setLista] = React.useState([]);

  React.useEffect(() => {
    const obtenerDatos = async () => {
      try {
        if (user && user.email) {
          const data = await db.collection(user.email).get();
          const arrayData = data.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLista(arrayData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    obtenerDatos();
  }, [user]);

  const DevolverLibro = async (elemento) => {
    try {
      const usuario = user.email;

      await Promise.all([
        db.collection("Libros").doc(elemento.idlibro).update({
          Disponibilidad: true,
        }),
        db.collection(usuario).doc(elemento.id).delete(),
      ]);

      const listaFiltrada = lista.filter(
        (nuevalista) => nuevalista.id !== elemento.id
      );
      setLista(listaFiltrada);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "El libro se ha devuelto",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
     <div className="row justify-content-center mt-5">
      <div className="col-md-9">
        <div className="card">
          <br></br>
       
          <div className="card-header bg- text-white text-center">

      <div className="contenedor-cards">
        <div className="card-grid">
          {lista.map((elemento) => (
            <div className="card" key={elemento.id}>
              <div className="card-body">
                <h5 className="card-title">Titulo: {elemento.Nombres}</h5>
                <p className="card-text">Autor: {elemento.Autor}</p>
                <p className="card-text">Descripción: {elemento.Descripcion}</p>
                <p className="card-text">Año: {elemento.año}</p>
              </div>
              <div className="card-footer">
                <button
                  onClick={() => DevolverLibro(elemento)}
                  className="btn btn-warning me-2"
                >
                  Devolver
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
    </div>
      </div>
    </div>
    
  );
};

export default Libros;
