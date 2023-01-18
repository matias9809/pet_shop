const { createApp } = Vue
createApp( {
    data(){
        return {
            disponibles:[],
            tarjetas : [],
            categorias : [],
            valorDeBusqueda: "",
            chequeados: "",
            tarjetasFiltradas : [],
            carrito:[],
            aux:[],
            informacionDeTarjeta: "",
            categoriasFiltradas: [],
            categoriasOrdenadasMenorAMayor: [],
            estaCargando: true,
            todosLosProductos: [],
            compras: [],
            productos:[],
            informacionDeTarjeta:{},
            valorDeBusqueda:"",
            todos:[],
        }
    },
    created(){
        fetch(`https://mindhub-xj03.onrender.com/api/petshop`)
            .then( respuesta => respuesta.json() )
            .then( datos => {
                switch(document.title.split("|")[1].trim()){
                    case "Jugueteria":{
                        this.disponibles =[...new Set( datos.map(e=>{
                            if(e.categoria=="jugueteria"){
                                return{
                                    _id:e._id,
                                    disponibles:e.disponibles
        
                                }
                            }
                        }))]
                        this.disponibles.shift()
                        this.tarjetas= datos.filter(e=>e.categoria=="jugueteria")
                        this.categorias=datos.filter(e=>e.categoria=="jugueteria")
                        this.tarjetasFiltradas = datos.filter(e=>e.categoria=="jugueteria")
                        this.categoriasFiltradas = [ ...new Set( this.categorias.map( tar => tar.precio ) ) ]
                        this.categoriasOrdenadasMenorAMayor = this.categoriasFiltradas.sort((a, b) => a -b)
                        break
                    }
                    case "Farmacia":{
                        this.disponibles =[...new Set( datos.map(e=>{
                            if(e.categoria=="farmacia"){
                        return{
                            _id:e._id,
                            disponibles:e.disponibles
                                }
                            }
                        }))]
                        this.tarjetas= datos.filter(e=>e.categoria=="farmacia")
                        this.categorias=datos.filter(e=>e.categoria=="farmacia")
                        this.tarjetasFiltradas = datos.filter(e=>e.categoria=="farmacia")
                        this.categoriasFiltradas = [ ...new Set( this.categorias.map( tar => tar.precio ) ) ]
                        this.categoriasOrdenadasMenorAMayor = this.categoriasFiltradas.sort((a, b) => a -b)
                        break
                    }
                }

                this.todosLosProductos=[...datos];
                
                this.todosLosProductos.forEach(producto=>producto.ventas=0);

                if(localStorage.getItem("nuestrosProductos"))
                this.todosLosProductos = JSON.parse(localStorage.getItem("nuestrosProductos"));
                let nombrePagina=location.pathname;//ve pagina nombre
                if (nombrePagina.includes("farmacia"))
                this.productos=this.todosLosProductos.filter(producto=>producto.categoria==="farmacia");
                else
                this.productos=this.todosLosProductos.filter(producto=>producto.categoria==="jugueteria");

                this.compras=this.todosLosProductos.filter(e=>e.ventas>0);
            } )
            .catch()
    },
    methods: {
        filtroCruzado: function(){
            let filtradoPorBusqueda = this.tarjetas.filter( eventos => eventos.producto.toLowerCase().includes( this.valorDeBusqueda.toLowerCase()))
            if( !this.chequeados.length ){
 
                this.tarjetasFiltradas = filtradoPorBusqueda;
            }else{
                let filtradosPorCheck
                if(this.chequeados<=1500){
                    filtradosPorCheck = filtradoPorBusqueda.filter( eventos =>this.chequeados>=eventos.precio)
                }else if(this.chequeados==1501){
                    filtradosPorCheck = filtradoPorBusqueda.filter( eventos => (this.chequeados<eventos.precio&&eventos.precio<=2000))
                }
                else if(this.chequeados==2001){
                    filtradosPorCheck = filtradoPorBusqueda.filter( eventos => this.chequeados<=eventos.precio)
                    
                }
                this.tarjetasFiltradas = filtradosPorCheck 
            }
        },
        agregar: function(objeto){//crear v-if en disponibles y boton agregar colocar mensaje no hay displonibles
            this.todosLosProductos.find(producto=>{
                if(producto._id==objeto._id){
                producto.disponibles--;
                producto.ventas++;}
            });
            this.compras=this.todosLosProductos.filter(e=>e.ventas>0);
            console.log(this.compras)
            localStorage.setItem("nuestrosProductos",JSON.stringify(this.todosLosProductos));
        },
        eliminar: function(objeto){
            this.todosLosProductos.find(producto=>{
                if(producto._id==objeto._id){
                producto.disponibles++;
                producto.ventas--;}
            });
            this.compras=this.todosLosProductos.filter(e=>e.ventas>0);
            localStorage.setItem("nuestrosProductos",JSON.stringify(this.todosLosProductos));
        },
        verMas: function(id){
            this.todosLosProductos.forEach(tarjeta => tarjeta._id === id ? this.informacionDeTarjeta = tarjeta : `No hay informacion acerca del producto` );
        },
        removerCarrito:function(){
        localStorage.removeItem("nuestrosProductos");
        this.productos=this.todos;
        this.compras=[];
        console.log(this.productos)
        },
    },
    computed: {

        cargando(){

            if(!this.tarjetas.length) setTimeout(() => this.estaCargando = false, 2000)
        
        }

    }
    }).mount("#app")

