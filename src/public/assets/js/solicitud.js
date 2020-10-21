
const solicitud = document.querySelector("#solicitudTurno");
// const user_id = document.querySelector("#userId").value;
const botonSubmit = document.querySelector("#submit");

const enviarImagen = async () => {

    // const img = document.querySelector("#imagen");
    // const email = document.querySelector("#from_email").value;
    const file = document.querySelector("#imagen").files[0];

    if (!file) {
        
        swal({
            title: "No selecciono una imagen",
            text: "Debe seleccionar una imagen representativa para solicitar un turno",
            icon: "error",
            button: {
                text: "Entendido",
                value: true,
                visible: true,
                className: "btn btn-primary btn-xl js-scroll-trigger",
                closeModal: true,
            },
        })
    }

    getSignedRequest(file);


    // const formData = new FormData();
    // // formData.append('imagen', img.files[0]);
    // // formData.append('email', email);
    // try {
    //     // const result = await fetch('/upload-img', {

    //     //     method: 'post',
    //     //     body: formData
    
    //     // });

    //     // const data = await result.json();

    //     // // console.log(data);
        
    //     // return data;

    // } catch (error) {

    //     // console.log(error)
    // }
    
    

}

function getSignedRequest(file){

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`, true);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          const response = JSON.parse(xhr.responseText);
          uploadFile(file, response.signedRequest, response.url);
        }
        else{
          alert('Could not get signed URL.');
        }
      }
    };
    xhr.send();
}

function uploadFile(file, signedRequest, url){
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest, true);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
            console.log(url);
        }
        else{
          alert('Could not upload file.');
        }
      }
    };
    xhr.send(file);

}
  
  


solicitud.addEventListener("submit", async (e) => {
    e.preventDefault();

    desactivarBotones([botonSubmit]);
    agregarSpinner(botonSubmit);

    await enviarImagen();
    return;

    if (!imgSubida) {
        swal({
            title: "Operacion Invalida",
            text: msgError,
            icon: "error",
            button: {
                text: "Entendido",
                value: true,
                visible: true,
                className: "btn btn-primary btn-xl js-scroll-trigger",
                closeModal: true,
            },
        })
        activarBotones([botonSubmit]);
        quitarSpinner(botonSubmit, "Solicitar Turno");
        return;
    }


    const dia_id = document.querySelector("#dia").value;
    const horario_id = document.querySelector("#horario").value;
    const msg = document.querySelector("#msg").value;


    const data = {
        dia_id,
        horario_id,
        msg,
        imgPath
    }

    //console.log(user_id, horario_id, dia_id)

    const result = await fetch("/pedirTurno", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(data)
    });

    const resultJson = await result.json();

    const { success, redirectAdress, msg: messageError } = resultJson;

    if (success) {
        await swal({
            title: "Envio exitoso!",
            text:
                "Tu solicitud se envio correctamente. Nos comunicaremos con usted a la brevedad.",
            icon: "success",
            button: {
                text: "Entendido",
                value: true,
                visible: true,
                className: "btn btn-primary btn-xl js-scroll-trigger",
                closeModal: true,
            },
        });
        document.location.href = `${redirectAdress}`

    } else {
        swal({
            title: "No Disponible",
            text:
                `${messageError ? messageError : "Lo sentimos, ocurrio un error y tu solicitud no se envio correctamente"}`,
            icon: "error",
            button: {
                text: "Entendido",
                value: true,
                visible: true,
                className: "btn btn-primary btn-xl js-scroll-trigger",
                closeModal: true,
            },
        });
        activarBotones([botonSubmit]);
        quitarSpinner(botonSubmit, "Solicitar Turno");
    }
    

})
