let serversList;
let serverClickedData;
document.addEventListener('DOMContentLoaded', function () {
    
    getServers();
    addListenerToJoinModal();
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('keyup', function () {
        const text = searchBar.value.toLowerCase();
        if (text != "") {
            let serversListFiltered = filterServersByName(serversList, text);
            if (serversListFiltered.length > 0) {
                renderServerList(serversListFiltered);
                addListenerToSevers();
            }
            else {
                renderServerNotFound(text);
            }
        }
        else {
            getServers();
        }
    })
});




function getServers() {
    let url = apiHost + '/api/all_servers';
    fetch(url)
        .then(res=>res.ok?res.json():Promise.reject(res))
        
        // .then(response => {
        //     if (!response.ok) {
        //         throw new Error('La solicitud no fue exitosa');
        //     }
        //     return response.json();
        // })
        .then(data => {
            console.log('se ejecuta getServers');
            renderServerList(data.Servers);
            addListenerToSevers();
            serversList = data.Servers;
        })
        .catch(error => {
            console.error('Error:', error);
            return showModalError(error);
        });
}


function renderServerList(servers) {
    const serversContainer = document.getElementById('servers');
    emptyingElement(serversContainer);
    const fragTemp = document.createDocumentFragment();
    servers.forEach(server => {
        console.log('nombre del sv: ', server.server_name);
        const aElement = document.createElement('a');
        aElement.innerHTML = `
                <a href="#" class="server" id="${server.server_name}">
                    <div>
                        <span class="material-symbols-outlined" title="${server.description}">
                            crowdsource
                        </span>
                    </div>
                    <h3 id="${server.server_id}">${server.server_name}</h3>
                    <h3 ${server.total_users}</h3>
                </a>`;
        fragTemp.appendChild(aElement);
    });
    serversContainer.prepend(fragTemp);
}

//          MODAL JOIN SERVER

function addListenerToSevers() {
    const modalJoinServer = document.getElementById('modalJoinServer');
    const modalText = document.getElementById('modalText');
    const serversListElement = document.querySelectorAll('.server');
    serversListElement.forEach(function (server) {
        server.addEventListener("click", function () {
            if (server) {
                let h3Element = server.querySelector('h3');
                var texto = h3Element.textContent;
                modalText.textContent = `¿Quieres unirte a ${texto}?`
                serverClickedData = [parseInt(h3Element.id), `${texto}`];
                console.log('dataSave: ', serverClickedData);
                modalJoinServer.showModal();
            };
        });
    });
};


function registerInServer() {
    let url = apiHost + '/api/join_server';
    console.log(url);

    const data = {
        'user_id': userId,
        'server_id': serverClickedData[0]
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    };

    fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud no fue exitosa');
            }
            return response.json();
        })
        .then(response => {
            if (response.error) {
                // Maneja el error de la API
                console.error('Error de la API:', response.error.description);
                return showModalError(response.error.description);
            } else {
                // Procede con la lógica de la aplicación si la respuesta es exitosa
                console.log('Respuesta de la API:', response);
            }
            window.location.href = host + '/templates/search_server/search_server.html'
        })
        .catch(error => {
            console.error('Error:', error);
            return showModalError(error);
        });

};

function addListenerToJoinModal() {
    const btnJoinServer = document.getElementById('btn-join-server');
    btnJoinServer.addEventListener('click', function (event) {
        event.preventDefault();
        registerInServer()
    });
}


function filterServersByName(servers, name) {
    let listData = [];
    for (let i = 0; i < servers.length; i++) {
        console.log(servers[i]);
        if (servers[i].server_name.toLowerCase().includes(name)) {
            listData.push(servers[i]);
        }
    }
    return listData;
}

function renderServerNotFound(name) {
    const serversContainer = document.getElementById('servers');
    emptyingElement(serversContainer);
    const divElement = document.createElement('div');
    divElement.classList.add('message')
    divElement.innerHTML = `
            <h2>No se ha encontrado el servidor con el nombre: "${name}"</h2>
            <h2>Prueba con otro nombre</h2>
            `;
    serversContainer.appendChild(divElement);
}



// function emptyingElement(element) {
//     while (element.firstChild) {
//         element.removeChild(element.firstChild);
//     }
// }