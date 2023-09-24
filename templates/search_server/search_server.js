let serversList;
document.addEventListener('DOMContentLoaded', function () {
    getServers();
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('keyup', function (){
        const text = searchBar.value.toLowerCase();
        if(text != ""){
            let serversListFiltered = filterServersByName(serversList,text);
            if(serversListFiltered.length > 0){
                renderServerList(serversListFiltered);
            }
            else{
                renderServerNotFound(text);
            }
        }
        else{
            getServers();
        }
    })
  });




function getServers(){
    let url = apiHost + '/api/all_servers';
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('La solicitud no fue exitosa');
        }
        return response.json();
      })
      .then(data => {
        renderServerList(data.Servers);
        serversList = data.Servers;
      })
      .catch(error => {
        console.error('Error:', error);
        return showModalError(error);
      });
}


function renderServerList(servers){
    const serversContainer = document.getElementById('servers');
    emptyingElement(serversContainer);
    const fragTemp = document.createDocumentFragment();
    servers.forEach(server => {
        console.log('nombre del sv: ',server.server_name);
        const aElement = document.createElement('a');
        aElement.innerHTML = `
                <a href="#" class="server" id="${server.server_name}">
                    <div>
                        <span class="material-symbols-outlined" title="${server.description}">
                            crowdsource
                        </span>
                    </div>
                    <h3>${server.server_name}</h3>
                </a>`;
        fragTemp.appendChild(aElement);
    });
    serversContainer.prepend(fragTemp);
}



function filterServersByName(servers, name) {
    let listData = [];
    for (let i=0; i<servers.length; i++) {
        console.log(servers[i]);
        if (servers[i].server_name.toLowerCase().includes(name)) {
            listData.push(servers[i]);
        }
    }
    return listData;
}

function renderServerNotFound(name){
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



function emptyingElement(element){
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}