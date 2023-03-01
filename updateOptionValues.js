const axios = require('axios');

const headers = {
    'X-Auth-Client': 'Access client',
    'X-Auth-Token': 'Access token'
}
var totalPages;

function getTotalPages() {
    axios.get("https://api.bigcommerce.com/stores/ox876tdj0k/v3/catalog/products?include=options",
        {
            headers: {
                'X-Auth-Client': 'sdbwrx6pdt82o8vkrjxkrj7f4hwaypb',
                'X-Auth-Token': 'cz4v22udt7qqztwo4mxxucs9z2zdejm'
            }
        })
        .then(response => {
            console.log("Total de productos= " + response.data.meta.pagination.total);       
            console.log("Total de paginas= " + response.data.meta.pagination.total_pages);
            console.log("Productos por pagina= " + response.data.meta.pagination.per_page);
            //totalPages necesario para la iterarion en update()
            totalPages = response.data.meta.pagination.total_pages;
            return totalPages;
        }
        )
        .catch(error => {
            console.log(error);
        });
}

function update(current_page) {
    //iterar por cada pagina de la meta data, en este caso son 138+1, porque la paginacion empieza en 1.
    if (current_page < totalPages+1) {
        setTimeout(() => {
            console.log("pagina actual= " + current_page);
            //Obtener productos con especificaciones para la pagina actual
            axios.get(`https://api.bigcommerce.com/stores/ox876tdj0k/v3/catalog/products?include=options&page=${current_page}`,
                {
                    headers: headers
                })
                .then(response => {
                    //iterar por la totalidad de productos, que con el include_fields, es igual a 10 por pagina
                    for (let product = 1; product <= response.data.meta.pagination.per_page; product++){
                        //itero por la totalidad de la opcions, que pueden ser 1, 2 o 3
                        let x = product - 1
                        for (let option = 1; option <= response.data.data[x].options.length; option++){
                            let y = option -1
                            //console.log("Lista de productos a actualizar:")
                            //console.log("productid "+ response.data.data[x].id + ", optionid "+ response.data.data[x].options[y].id + ", valueid "+ response.data.data[x].options[y].option_values[0].id)
                            axios.put(`https://api.bigcommerce.com/stores/ox876tdj0k/v3/catalog/products/${response.data.data[x].id}/options/${response.data.data[x].options[y].id}/values/${response.data.data[x].options[y].option_values[0].id}`,
                            {
                                 "is_default": true
                            },
                            {
                                headers: headers
                            })
                            .then(response => {
                                console.log(response.data.data);
                                console.log("Correcto");
                            })
                            .catch(error => {
                                console.log(error);
                            });
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            //iteracion recursiva
            current_page++;
            update(current_page);
        }, 5000);
    } else {
        console.log("Fin de recorrido")
    }
}

getTotalPages();
setTimeout(function () {
    console.log("Inicializando...")
    update(1)
}, 1500);