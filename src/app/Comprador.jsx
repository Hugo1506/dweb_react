import React, { Component } from 'react';
import "./UI.css";
class Comprador extends Component {
    state = {
        userId: "",
        login: "",
        password: "",
        userExisteResponse: "",
        mostrarRegistar: false,
        userCriadoResponse: "",
        mostraMenu: false,
        mostraCriarProduto: false,
        criarProdutoResponse: "",
        mostraCriarAnuncio: false,
        produtos: [],
        criarAnuncioResponse: "",
        mostraVerAnuncios: false,
        anuncios: [],
        anuncioClicado: 0,
        saldo: 0.0,
        listaReviews: [],
        mostraVerReviews: false,
        mostraEscreverReview: false,
        mostraProdutosComprados: false,
        mostraVerMinhasReviews: false,
        minhasReviews: [],
        mostrarVerAnuncioClicado: false,
        nomeProduto: "",
        mostrarQeuemComprou: false,
        compradores: [],
        mostrarSobre: false,
        reviewClicada: 0,
        mostraEditarReview:false,
    }



    //envia o login e password para o servidor que vai fazer o login do user 
    handleLogin = async () => {
        let login_val = document.getElementById('loginInput').value;
        let password_val = document.getElementById('passwordInput').value;
        if (login_val == "") {
            document.getElementById('loginInput').placeholder = "login nao pode ser vazio";
        } else  if (password_val == "") {
            document.getElementById('passwordInput').placeholder = "password nao pode ser vazia";
        } else {
            this.setState({ login: login_val });
            this.setState({ password: password_val });
            try {
                let userExists = await this.handleUserExists(login_val, password_val);
                if (userExists) {
                    console.log(this.state.userExisteResponse);
                    

                } else {
                    console.log(this.state.userExisteResponse);

                }
            } catch (error) {
                console.error('Erro inesperado:', error);
            }
        }     

    }

    //enviado o login e password para o servidor confere se o user j� existe
    handleUserExists = (login_val, password_val) => {
        return fetch('https://localhost:7287/compradores/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login: login_val, password: password_val })
        })
            .then(response => {
                if (response.ok) {
                    return response.text().then(message => {
                        if (message != "O user existe" && message != "Password incorreta" && message != "formato errado") {
                            this.setState({ mostraMenu: true });
                            this.setState({ userId: message });
                            return true;
                        }
                        
                    });
                } else {
                    return response.text().then(message => {
                        this.setState({ userExisteResponse: message });
                        return false;
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    //mostra a p�gina de registo
    handleRegist = () => {
        this.setState({ mostrarRegistar:true})
         
    }

    //volta da p�gina de registo para o login
    handleVoltarRegist = () => {
        this.setState({ mostrarRegistar : false})
    }

    //mostra a p�gina para criar um produto
    handleMostraCriarProduto = () => {
        this.setState({ mostraMenu: false });
        this.setState({ mostraCriarProduto: true }) 
    }

    //envia o nome do produto e a sua descri��o para o servidor que cria um novo produto
    handleCriarProduto = () => {
        let nomeProduto = document.getElementById('nomeProdutoInput').value;
        let descricaoProduto = document.getElementById('descricaoProdutoInput').value;

        return fetch('https://localhost:7287/compradores/createProdutos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome: nomeProduto, descricao: descricaoProduto })
        })
            .then(response => {
                if (response.ok) {
                    return response.text().then(message => {
                        this.setState({ criarProdutoResponse: message });
                    });
                } else {
                    return response.text().then(message => {
                        this.setState({ criarProdutoResponse: message });

                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        

    }

    //mostra a p�gina de criar anuncios
    handleMostraCriarAnuncio = () => {
        this.setState({ mostraMenu: false });
        this.setState({ mostraCriarAnuncio: true });
        this.handleGetProdutos();
    }

    //volta da p�gina de criar anuncios para o menu
    handleVoltaCriarAnuncio = () => {
        this.setState({ mostraCriarAnuncio: false });
        this.setState({ mostraMenu: true });
    }

    //volta da p�gina de criar produtos para o menu
    handleVoltaCriarProduto = () => {
        this.setState({ mostraCriarProduto: false });
        this.setState({ mostraMenu: true });
    }

    //recebe os anuncios existentes na base de dados do servidor
    handleGetProdutos = () => {
        fetch("https://localhost:7287/compradores/getProdutos")
            .then(res => res.json())
            .then(result => {
        this.setState({ produtos: result })
            })
            .catch(error => console.log('error', error));
    }

    //mostra a p�gina dos anuncios 
    handleMostraVerAnuncios =async () => {
        this.setState({ mostraMenu: false });
        await this.handleGetProdutos();
        this.handleGetAnuncios();
        this.setState({ mostraVerAnuncios: true });
        this.handleVerSaldo();
    }

    //recebe do servidor todos os anuncios existentes
    handleGetAnuncios = () => {
        fetch("https://localhost:7287/compradores/getAnuncios")
            .then(res => res.json())
            .then(result => {
                this.setState({ anuncios: result })
            })
            .catch(error => console.log('error', error));
    }

    //volta da p�gina que mostra os anuncios para o menu
    handleVoltaVerAnuncios = () => {
        this.setState({ mostraVerAnuncios: false });
        this.setState({ mostraMenu: true });
        this.setState({ anuncios: [] });       
    }

 
    //envia os dados de pre�o,id do produto e o userId do user para o servidor que vai criar um novo anuncio
    handleCriarAnuncio = () => {
        let preco = document.getElementById('precoAnuncioInput').value;
        let produto_nome = document.getElementById('produtoAnuncioInput').value;
        let produto = this.state.produtos.find((produto) => produto.nome === produto_nome);

        let produto_id = produto.id.toString();
        const requestBody = JSON.stringify({ produto_id: produto_id, preco: preco, userId: this.state.userId })
        return fetch('https://localhost:7287/compradores/createAnuncio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        })
            .then(response => {
                if (response.ok) {
                    return response.text().then(message => {
                        this.setState({ criarAnuncioResponse: message });

                    });
                } else {
                    return response.text().then(message => {
                        this.setState({ criarAnuncioResponse: message });

                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    //envia os dados de email,password,confirma��o de password,login,nome,telefone e dinheiro se os dados forem corretos
    //um novo user � criado com sucesso caso contrario � recebida uma mensagem de erro do servidor 
    handleCreateUser = () => {
        let email_val = document.getElementById('emailInput').value;
        let password_val = document.getElementById('passwordInput').value;
        let password_conf_val = document.getElementById('passwordInputConf').value;
        let login_val = document.getElementById('loginInput').value;
        let nome_val = document.getElementById('nomeInput').value;
        let telefone_val = document.getElementById('telefoneInput').value;
        let dinheiro_val = document.getElementById('dinheiroInput').value;
        const requestBody = JSON.stringify({ email: email_val, password: password_val, password_conf: password_conf_val, login: login_val, nome: nome_val, telefone: telefone_val, dinheiro: dinheiro_val })
        if (email_val == "") {
            document.getElementById('emailInput').placeholder = "o email n\u00E3o pode ser vazio";
        }
        if (password_val == "") {
            document.getElementById('passwordInput').placeholder = "a password n\u00E3o pode ser vazia";
        }
        if (password_conf_val == "") {
            document.getElementById('passwordInputConf').placeholder = "a confirma\u00E7\u00E3o de password n\u00E3o pode ser vazia";
        }
        if (login_val == "") {
            document.getElementById('loginInput').placeholder = "o login n\u00E3o pode ser vazio";
        }
        if (nome_val == "") {
            document.getElementById('nomeInput').placeholder = "o nome n\u00E3o pode ser vazio";
        }
        if (telefone_val == "") {
            document.getElementById('telefoneInput').placeholder = "o telefone n\u00E3o pode ser vazio";
        }
         if (dinheiro_val == "") {
             document.getElementById('dinheiroInput').placeholder = "o dinheiro n\u00E3o pode ser vazio";
        }
        if (email_val == "" || password_val == "" || password_conf_val== "" || login_val == "" || nome_val == "" || telefone_val == "" || dinheiro_val == "") {

        }else {
            return fetch('https://localhost:7287/compradores/createComprador', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: requestBody
            })
                .then(response => {
                    if (response.ok) {
                        return response.text().then(message => {
                            this.setState({ userCriadoResponse: message });

                        });
                    } else {
                        return response.text().then(message => {
                            this.setState({ userCriadoResponse: message });

                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
            
        
       
    }

    //sabendo o id de um produto retorna o seu nome 
    handleNomeProduto(produtoFK) {
        this.handleGetProdutos();
        let listaProdutos = this.state.produtos;
        let produtoEncontrado = listaProdutos.find(produto => produto.id == produtoFK)
        let produtoNome = produtoEncontrado.nome;
        return produtoNome;
    }


    //envia o id do anuncio que vai ser comprado e o userId do user para o servidor que vai efetuar a opera��o de compra e devolver o saldo restante do user
    handleComprar = (id) => {
        let user_val = this.state.userId;
        let anuncio_val = id.toString();
        const requestBody = JSON.stringify({ anuncio: anuncio_val , user: user_val })

        this.handleVerSaldo();
        return fetch('https://localhost:7287/compradores/postComprar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        })
            .then(response => {
                if (response.ok) {
                    return response.text().then(message => {
                        this.setState({ saldo: message });

                    });
                } else {
                    return response.text().then(message => {

                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    //enviando o userId do user recebe o seu saldo do servidor
    handleVerSaldo = () => {
        const userId = this.state.userId;
        fetch('https://localhost:7287/compradores/getSaldo?userId=' + userId)
            .then(res => res.json())
            .then(result => {
                this.setState({ saldo: result })
            })
            .catch(error => console.log('error', error));
    }

    //enviando o id de um anuncio recebe uma lista de reviews do servidor
    handleGetReviews = (id) => {
        fetch('https://localhost:7287/compradores/getReviews?anunc=' + id)
            .then(res => res.json())
            .then(result => {
                this.setState({ listaReviews: result })
            })
            .catch(error => console.log('error', error));
    }

    //sai da p�gina do anuncio e sabendo o id do anuncio clicado mostra as suas reviews
    handleVerReviews = (id) => {
        this.handleGetReviews(id);
        this.setState({ mostraVerAnuncios: false });
        this.setState({ mostraVerReviews: true });
        this.setState({ anuncioClicado: id });
    }

    //sai da p�gina que mostra as reviews de um anuncio e volta para a p�gina que mostra os anuncios
    handleVoltaVerReviews = () => {
        this.setState({ listaReviews: [] });
        this.setState({ anuncios: [] });
        this.setState({ mostraVerAnuncios: true });
        this.setState({ mostraVerReviews: false });
        this.handleGetAnuncios();
    }

    //sai da p�gina de ver as reviews feitas e abre a p�gina para fazer uma nova review
    handleMostraEscreverReview = () => {
            this.setState({ mostraVerReviews: false });
            this.setState({mostraEscreverReview : true})
            
    }

    //volta da p�gina de escrever reviews para a p�gina que mostra as reviews feitas 
    handleVoltaEscreverReview = () => {
        this.handleGetReviews();
        this.setState({ mostraEscreverReview: false });
        this.setState({ mostraVerReviews: true });
    }


    //envia o conteudo, o userId do user e o id do anuncio para o servidor que por sua vez cria a review
    handleCriarReview = () => {
        let conteudo_val = document.getElementById("conteudoInput").value;
        let user_val = this.state.userId;
        let anuncio_val = this.state.anuncioClicado;
        if (conteudo_val == "") {
            document.getElementById("conteudoInput").placeholder = "O conteudo da review n\u00E3o pode ser vazio";
        } else {
            const requestBody = JSON.stringify({ conteudo: conteudo_val, user: user_val, anuncio: anuncio_val.toString() })
            return fetch('https://localhost:7287/compradores/createReview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: requestBody
            })
                .then(response => {
                    if (response.ok) {
                        return response.text().then(message => {

                        });
                    } 
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }

    //enviando o login do vendedor recebe todos os anuncios feitos por esse vendedor do servidor
    handleVerAnunciosClick = (vendedor) => {
        fetch('https://localhost:7287/compradores/getAnunciosVendedor?vend=' + vendedor)
            .then(res => res.json())
            .then(result => {
                this.setState({ anuncios: result });
            })
            .catch(error => console.log('error', error));
    }

    //mostra a p�gina que mostra os produtos comprados pelo user
    handleMostraProdutosComprados = () => {
        this.setState({ mostraMenu: false });
        this.setState({ mostraProdutosComprados: true });
        this.handleGetProdutosComprados();
    }


    //enviando o userId de um user recebe os produtos comprados por ele do servidor
    handleGetProdutosComprados = () => {
        let user = this.state.userId;
        fetch('https://localhost:7287/compradores/getProdutosComprados?user=' + user)
            .then(res => res.json())
            .then(result => {
                this.setState({ produtos: result });
            })
            .catch(error => console.log('error', error));
    }

    //volta da p�gina de produtos comprados para o menu
    handleVoltarProdutosComprados = () => {
        this.setState({ mostraMenu: true });
        this.setState({ mostraProdutosComprados: false });
    }


    //enviando o userId do user recebe as reviews correspondentes a esse user no servidor
    handleGetMinhasReviews = () => {
        let user = this.state.userId;
        fetch('https://localhost:7287/compradores/getMeusReviews?user=' + user)
            .then(res => res.json())        
            .then(result => {
                this.setState({ minhasReviews: result });
            })
            .catch(error => console.log('error', error));
    }

    //mostra uma p�gina com todas as reviews do user autenticado
    handleVerMinhasReviews = () => {
        this.handleGetMinhasReviews();
        this.setState({ mostraVerMinhasReviews: true });
        this.setState({ mostraMenu: false });
    }

    //volta da p�gina minhas Reviews para o menu
    handleVoltarMinhasReviews = () => {
        this.setState({ mostraVerMinhasReviews: false });
        this.setState({ mostraMenu: true });
    }

    //muda para a p�gina do anuncio clicado sabendo que anuncio foi clicado pelo seu id
    handleMostarAnuncioClicado = (id) => {
        this.setState({ mostraVerMinhasReviews: false });
        this.handleGetAnuncioById(id);
        this.setState({ mostrarVerAnuncioClicado:true })
    }

    //enviando o id de um anuncio recebe o anuncio do servidor
    handleGetAnuncioById = (id) => {
        fetch('https://localhost:7287/compradores/getAnuncioById?anunc=' + id)
            .then(res => res.json())
            .then(result => {
                this.setState({ anuncios: result });
            })
            .catch(error => console.log('error', error));
    }

    //volta da p�gina do anuncio clicado para a p�gina minhas reviews
    handleVoltarAnuncioClicado = () => {
        this.handleGetProdutos();
        this.handleGetAnuncios();
        this.setState({ mostrarVerAnuncioClicado: false });
        this.setState({ mostraVerMinhasReviews: true });
    }

    //enviando o id do produto para o servidor recebe o seu nome
    handleNomeProdutoById = (id) => {
        fetch('https://localhost:7287/compradores/getProdutoNomeById?id=' + id)
            .then(res => res.json())
            .then(result => {
                this.setState({ nomeProduto: result });
            })
            .catch(error => console.log('error', error));
    }

    //enviando o id do produto para o servidor recebe quem tamb�m comprou o produto
    handleQuemComprou = (id) => {
        fetch('https://localhost:7287/compradores/getQuemComprou?id=' + id)
            .then(res => res.json())
            .then(result => {
                this.setState({ compradores: result });
            })
            .catch(error => console.log('error', error));
    }

    //mostra a p�gina que mostra quem comprou tal produto
    handleMostraQuemComprou = (id) => {
        this.handleQuemComprou(id);
        this.setState({ mostraProdutosComprados: false });
        this.setState({ mostrarQeuemComprou: true });
    }

    //volta da p�gina de quem tamb�m comprou tal produto
    handleVoltarQuemComprou = (id) => {
        this.setState({ mostraProdutosComprados: true });
        this.setState({ mostrarQeuemComprou: false });
    } 

    //mostra a p�gina do sobre
    handleVerSobre = () => {
        this.setState({ mostrarSobre: true });
        this.setState({ mostraMenu: false });
    }

    //volta da pagina do sobre
    handleVoltarSobre = () => {
        this.setState({ mostrarSobre: false });
        this.setState({ mostraMenu: true });
    }

    //mostra a p�gina de editar a review
    handleMostraEditarReview = (id) => {
        this.setState({ reviewClicada: id });
        this.setState({ mostraVerMinhasReviews: false });
        this.setState({ mostraEditarReview: true });

    }

    //envia o id e o novo conteudo para o servidor que ir� atualizar a review
    handleEditarReview = () => {
        let id_val = this.state.reviewClicada.toString();
        let conteudo_val = document.getElementById("conteudoEditInput").value;
        const requestBody = JSON.stringify({ conteudo: conteudo_val,id : id_val })
        return fetch('https://localhost:7287/compradores/editarReview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        })
            .then(response => {
                if (response.ok) {
                    return response.text().then(message => {
                        if (message == "review criada com sucesso") {
                            this.handleGetMinhasReviews();
                            this.handleVoltarEditarReview();
                        }

                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    //volta da pagina de editar Review
    handleVoltarEditarReview = () => {
        this.setState({ mostraEditarReview: false });
        this.setState({ mostraVerMinhasReviews: true });
    }

    //apaga a review sabendo o seu id
    handleApagarReview = async (id) => {
        await fetch('https://localhost:7287/compradores/apagarReview?id=' + id)
            .then(res => res.json())
            .catch(error => console.log('error', error));
        this.handleGetMinhasReviews();
    }
    

    render() {
        let loginErro = "";
        loginErro = this.state.userExisteResponse;
        let registErro = this.state.userCriadoResponse;
        let criarProdutoMessage = this.state.criarProdutoResponse;
        let criarAnuncioMessage = this.state.criarAnuncioResponse;
        let listaAnuncios = [];
        let listaProdutos = [];
        let listaMinhasReviews = [];
        let ListaCompradores = [];


        //p�gina de registo
        if (this.state.mostrarRegistar) {
            return (
                <div className="row" style={{ width: "1000px" }}>
                    <h4>Bem-vindo &agrave; loja Online</h4>
                    <span>Registar</span>
                    <p>{registErro} </p>
                    <div className="col-lg-6">  
                        
                        <form id="screen">
                            <div className="mb-4">
                                <label htmlFor="emailInput" className="form-label">Email</label>
                                <input type="text" className="form-control" id="emailInput" placeholder="Escreva o seu email" />

                                <label htmlFor="passwordInput" className="form-label">Password</label>
                                <input type="password" className="form-control" id="passwordInput" placeholder="Escreva a sua password" />

                                <label htmlFor="passwordInputConf" className="form-label">Confirme a password</label>
                                <input type="password" className="form-control" id="passwordInputConf" placeholder="Confirme a sua password" />

                                <label htmlFor="loginInput" className="form-label">Login</label>
                                <input type="text" className="form-control" id="loginInput" placeholder="Escreva o seu login" />

                            </div>
                        </form>
                    </div>
                    <div className="col-lg-6">
                        <form id="screen">
                            <div className="mb-4">
                                
                                <label htmlFor="nomeInput" className="form-label">Nome</label>
                                <input type="text" className="form-control" id="nomeInput" placeholder="Escreva o seu nome" />

                                <label htmlFor="telefoneInput" className="form-label">Telefone</label>
                                <input type="text" className="form-control" id="telefoneInput" placeholder="Escreva o seu telefone" />

                                <label htmlFor="dinheiroInput" className="form-label">Dinheiro</label>
                                <input type="text" className="form-control" id="dinheiroInput" placeholder="Escreva o seu dinheiro" />
                                <br/>
                                <button className="btn btn-primary btn-lg mt-3" onClick={this.handleCreateUser} type="button">Registar</button>
                                <button className="btn btn-primary btn-lg mt-3" onClick={this.handleVoltarRegist} type="button">Voltar</button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        }

        //Menu da aplica��o 
        if (this.state.mostraMenu) {
            this.handleVerSaldo();
            return (
                <div className="row" style={{ width: "500px" }}>
                    <div className="col-12">
                        <div className="fixed-bar">
                            <span style={{ marginRight: '10px' }}>Saldo: {this.state.saldo} &euro;</span>
                       </div>
                        <h4>Bem vindo &agrave; loja Online</h4>
                        <button className="btn btn-primary btn-lg mt-3" onClick={this.handleMostraCriarProduto} type="button">Criar um produto</button><br />
                        <button className="btn btn-primary btn-lg mt-3" onClick={this.handleMostraCriarAnuncio} type="button">Criar um anuncio</button><br />
                        <button className="btn btn-primary btn-lg mt-3" onClick={this.handleMostraVerAnuncios} type="button">Ver anuncios</button><br />
                        <button className="btn btn-primary btn-lg mt-3" onClick={this.handleMostraProdutosComprados} type="button">Ver os produtos que comprei</button><br />
                        <button className="btn btn-primary btn-lg mt-3" onClick={this.handleVerMinhasReviews} type="button">Ver as minhas reviews</button><br />
                        <button className="btn btn-primary btn-lg mt-3" onClick={this.handleVerSobre} type="button">Sobre</button><br />
                    </div>
                </div>
                )
        }

        //p�gina para criar um novo produto
        if (this.state.mostraCriarProduto) {
            return (
                <div className="row" style={{ width: "500px" }}>
                    <div className="col-12">
                        <h4>Criar um produto</h4>
                        <p>{criarProdutoMessage}</p>
                        <label htmlFor="nomeProdutoInput" className="form-label">Nome</label>
                        <input type="text" className="form-control" id="nomeProdutoInput" placeholder="Escreva o nome do produto" />

                        <label htmlFor="descricaoProdutoInput" className="form-label">descri&ccedil;&atilde;o</label>
                        <input type="text" className="form-control" id="descricaoProdutoInput" placeholder="Escreva a descri&ccedil;&atilde;o do produto" />

                        <button className="btn btn-primary btn-lg mt-3 " onClick={this.handleCriarProduto} type="button">Criar</button>
                        <button className="btn btn-primary btn-lg mt-3 " onClick={this.handleVoltaCriarProduto} type="button">Voltar</button>

                    </div>
                </div>
            )
            
        }

        //p�gina para criar um nov anuncio
        if (this.state.mostraCriarAnuncio) {
            
            const options = this.state.produtos.map((produto) => (
                <option key={produto.id} value={produto.nome}>{produto.nome}</option>
            ));
            return (
                <div className="row" style={{ width: "500px" }}>
                    <div className="col-12">
                        <h4>Criar um anuncio</h4>
                        <p>{criarAnuncioMessage}</p>
                        <label htmlFor="precoAnuncioInput" className="form-label">pre&ccedil;o</label>
                        <input type="text" className="form-control" id="precoAnuncioInput" placeholder="Escreva o pre&ccedil;o do anuncio" />

                        <label htmlFor="produtoAnuncioInput" className="form-label">produto</label>
                        <select className="form-select mt-3" id="produtoAnuncioInput">
                            {options}
                        </select>

                        <button className="btn btn-primary btn-lg mt-3 " onClick={this.handleCriarAnuncio} type="button">Criar</button>
                        <button className="btn btn-primary btn-lg mt-3 " onClick={this.handleVoltaCriarAnuncio} type="button">Voltar</button>

                    </div>
                </div>
            )
        }

        //p�gina para ver os anuncios existentes
        if (this.state.mostraVerAnuncios) {
            this.state.anuncios.forEach(element => {
                listaAnuncios.push(<li
                    className="list-group-item"
                    style={{
                        margin: '15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderRight: '4px solid #585c64',
                        borderBottom: '4px solid #585c64'
                    }}
                    key={element.id}
                    >
                    <p style={{ display: 'inline-block', textAlign: 'left' }}        
                    >
                        Nome do produto: {this.handleNomeProduto(element.produtoFK)}<br />
                        pre&ccedil;o: {element.preco} &euro;<br />
                        nome do vendedor: <a onClick={() => this.handleVerAnunciosClick(element.vendedorFK)}
                            style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                        >{element.vendedorFK}</a>
                    </p>
                    <button  className="btn btn-secondary btn-lg mt-3" style={{ fontSize: 'inherit' }} onClick={() => this.handleComprar(element.id)} type="button" >
                        Comprar
                    </button >
                    <button className="btn btn-secondary btn-lg mt-3" style={{ fontSize: 'inherit' }} onClick={() => this.handleVerReviews(element.id)} type="button" >
                        Ver Reviews
                    </button >
                </li>
                )
            });
            return (
                <div className="row" style={{ width: "700px", paddingTop: "50px" }}>
                    <div className="col-12">
                        <div className="fixed-bar">
                            <span style={{ marginRight: '10px' }}>Saldo: {this.state.saldo} &euro;</span>
                            <button className="btn btn-primary btn-lg mt-3"  onClick={this.handleVoltaVerAnuncios} type="button">Voltar</button>          
                            <button className="btn btn-primary btn-lg mt-3" onClick={this.handleMostraVerAnuncios} type="button">&#x27f3;</button>          
                        </div>
                        <ul className="list-group" style={{ marginTop:"15px"}}>
                            {listaAnuncios}
                        </ul>
                    </div>
                </div>
            )
        }

        //p�gina para ver as reviews existentes de um anuncio
        if (this.state.mostraVerReviews) {
            const reviews = this.state.listaReviews.map(element => {

                return (
                    <li
                        className="list-group-item"
                        style={{
                            margin: '15px',
                            display: 'flex',
                            backgroundColor: '#ffffff',
                            color: '#000000',
                            justifyContent: 'space-between',
                            borderRight: '4px solid #585c64',
                            borderBottom: '4px solid #585c64'
                        }}
                        key={element.id} 
                    >
                        <p style={{ display: 'inline-block', textAlign: 'left', margin: '5px' }}>
                            {element.compradorFK} < br /> <br />
                            {element.conteudo}
                        </p>
                    </li>
                );
            });
            return (
                <div className="row" style={{ width: "500px" }}>
                    <div className="col-12">
                        
                        <ul className="list-group" style={{ marginTop: "55px" }}>
                            {reviews}
                        </ul>
                        <div className="fixed-bar">
                            <button className="btn btn-primary btn-lg mt-3" onClick={this.handleMostraEscreverReview} type="button">escrever uma review</button>          

                            <button className="btn btn-primary btn-lg mt-3" onClick={this.handleVoltaVerReviews} type="button">Voltar</button>          
                        </div>

                    </div>
                </div>
                 
            )
        }

        //p�gina para escrever uma review de um anuncio
        if (this.state.mostraEscreverReview) {
            return (
                <div className="row" style={{ width: "500px" }}>
                    <div className="col-12">
                        <h4>Escreva uma review</h4>
                        <label htmlFor="conteudoInput" className="form-label">conteudo</label>
                        <textarea style={{ height:"100px" }} type="textArea" className="form-control" id="conteudoInput" placeholder="Escreva a sua review aqui" />

                        <button className="btn btn-primary btn-lg mt-3 " onClick={this.handleCriarReview} type="button">Criar</button>
                        <button className="btn btn-primary btn-lg mt-3 " onClick={this.handleVoltaEscreverReview} type="button">Voltar</button>

                    </div>
                </div>
            )
        }

        //p�gina que mostra os produtos comprados pelo user
        if (this.state.mostraProdutosComprados) {
            this.state.produtos.forEach((element,index) => {
                listaProdutos.push(<li
                    key={index }
                    className="list-group-item"
                    style={{
                        margin: '15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderRight: '4px solid #585c64',
                        borderBottom: '4px solid #585c64'
                    }}
                >
                    <p style={{ display: 'inline-block', textAlign: 'left' }}
                    >
                        Nome do produto: {element.nome}<br/>
                        Descri&ccedil;&atilde;o: {element.descricao}
                    </p>
                    <button className="btn btn-secondary btn-lg mt-3" style={{ fontSize: 'inherit' }} onClick={() => this.handleMostraQuemComprou(element.id)} type="button" >
                        Quem tamb&eacute;m comprou
                    </button >
                </li>
                )
            });

            return (
                <div className="row" style={{ width: "700px", paddingTop: "50px" }}>
                    <div className="col-12">
                        <div className="fixed-bar">
                            <button className="btn btn-primary btn-lg mt-3 " onClick={this.handleVoltarProdutosComprados} type="button">Voltar</button>
                        </div>
                        <ul className="list-group" style={{ marginTop: "15px" }}>
                            {listaProdutos}
                        </ul>
                    </div>
                </div>
         
                )
        }

        //p�gina que mostra as reviews feitas pelo user
        if (this.state.mostraVerMinhasReviews) {
            this.state.minhasReviews.forEach((element, index) => {
                listaMinhasReviews.push(<li
                    key={index}
                    className="list-group-item"
                    style={{
                        margin: '15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderRight: '4px solid #585c64',
                        borderBottom: '4px solid #585c64'
                    }}
                >
                    <p style={{ display: 'inline-block', textAlign: 'left' }}
                    >
                        <a onClick={() => this.handleMostarAnuncioClicado(element.anuncioFK)}
                        style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                            Anuncio
                        </a><br/>
                        review: {element.conteudo}
                    </p>
                    <button className="btn btn-secondary btn-lg mt-3" style={{ fontSize: 'inherit' }} onClick={() => this.handleMostraEditarReview(element.id)} type="button" >
                        Editar
                    </button >
                    <button className="btn btn-secondary btn-lg mt-3" style={{ fontSize: 'inherit' }} onClick={() => this.handleApagarReview(element.id)} type="button" >
                        Apagar
                    </button >
                </li>
                )
            });


            return (
                <div className="row" style={{ width: "700px", paddingTop: "50px" }}>
                    <div className="col-12">
                        <div className="fixed-bar">
                            <button className="btn btn-primary btn-lg mt-3 " onClick={this.handleVoltarMinhasReviews} type="button">Voltar</button>
                        </div>
                        <ul className="list-group" style={{ marginTop: "15px" }}>
                            {listaMinhasReviews}
                        </ul>
                    </div>
                </div>
                )
        }

        //p�gina que mostra o anuncio clicado na p�gina de reviews do user
        if (this.state.mostrarVerAnuncioClicado) {
            let anuncio = this.state.anuncios;
            this.handleNomeProdutoById(anuncio.produtoFK); 
            return (
                <div className="row" style={{ width: "700px", paddingTop: "50px" }}>
                    <div className="col-12">
                        <div className="fixed-bar">
                            <button className="btn btn-primary btn-lg mt-3 " onClick={this.handleVoltarAnuncioClicado} type="button">Voltar</button>
                        </div>
                        <ul className="list-group" style={{ marginTop: "15px" }}
                            style={{
                                margin: '15px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderRight: '4px solid #585c64',
                                borderBottom: '4px solid #585c64',
                                backgroundColor: "#ffffff",
                                color: "#000000",
                                textAlign: 'left',
                                paddingLeft: '10px',
                            }}
                        >
                            Nome do produto: {this.state.nomeProduto} <br />
                            pre&ccedil;o:    {anuncio.preco} &euro;<br />
                            vendedor:        {anuncio.vendedorFK}

                        </ul>
                    </div>
                </div>
            )
        }

        //p�gina que mostra quem tamb�m comprou o produto comprado pelo user
        if (this.state.mostrarQeuemComprou) {
            this.state.compradores.forEach((element, index) => {
                ListaCompradores.push(<li
                    key={index}
                    className="list-group-item"
                    style={{
                        margin: '15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderRight: '4px solid #585c64',
                        borderBottom: '4px solid #585c64'
                    }}
                >
                    <p style={{ display: 'inline-block', textAlign: 'left' }}
                    >
                        username: {element.login}<br/>
                        nome:     {element.nome}
                    </p>
                </li>
                )
            });


            return (
                <div className="row" style={{ width: "700px", paddingTop: "50px" }}>
                    <div className="col-12">
                        <div className="fixed-bar">
                            <button className="btn btn-primary btn-lg mt-3 " onClick={this.handleVoltarQuemComprou} type="button">Voltar</button>
                        </div>
                        <ul className="list-group" style={{ marginTop: "15px" }}>
                            {ListaCompradores}
                        </ul>
                    </div>
                </div>
            )
        }

        //p�gina que mostra o curso a cadeira o nome e n� do autor e as frameworks usadas
        if (this.state.mostrarSobre) {
            return (
                <div className="row" style={{ width: "700px", paddingTop: "50px" }}>
                    <div className="col-12">
                        <div className="fixed-bar">
                            <button className="btn btn-primary btn-lg mt-3 " onClick={this.handleVoltarSobre} type="button">Voltar</button>
                        </div>
                        <p
                            style={{
                                margin: '15px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderRight: '4px solid #585c64',
                                borderBottom: '4px solid #585c64',
                                backgroundColor: '#ffffff',
                                color: '#000000',
                                textAlign: 'left',

                            }}
                        >

                            Engenharia Inform&aacute;tica, Desenvolvimento web 2022/2023<br />
                            Aluno: Hugo Marques n&deg; 24171<br />
                            Frameworks usadas front end: React, bootstrap<br />
                                              Back end : ASP.NET, ASP.NET Core MVC e EntityFramework
     
                        </p>
                    </div>
                </div>
            )
        }

        //p�gina de Editar um review
        if (this.state.mostraEditarReview) {
            return (
                <div className="row" style={{ width: "500px" }}>
                    <div className="col-12">
                        <h4>Edite a review</h4>
                        <label htmlFor="conteudoEditInput" className="form-label">conteudo</label>
                        <textarea style={{ height: "100px" }} type="textArea" className="form-control" id="conteudoEditInput" placeholder="Escreva a sua review aqui" />

                        <button className="btn btn-primary btn-lg mt-3 " onClick={this.handleEditarReview} type="button">Editar</button>
                        <button className="btn btn-primary btn-lg mt-3 " onClick={this.handleVoltarEditarReview} type="button">Voltar</button>

                    </div>
                </div>
            )
        }

        //p�gina de login (p�gina inicial)
        return (
            <div className="row" style={{ width: "500px" }}>        
                <div className="col-12">
                    <h4>Bem vindo &agrave; loja Online</h4>
                    <form id= "screen">
                        <div className="mb-4">
                            <p>{loginErro}</p>
                            <label htmlFor="loginInput" className="form-label">Login</label>
                            <input type="text" className="form-control" id="loginInput" placeholder="Escreva a seu login" />
                            <label htmlFor="PasswordInput" className="form-label">Password</label>
                            <input type="password" className="form-control" id="passwordInput" placeholder="Escreva a sua password" />

                            <button className="btn btn-primary btn-lg mt-3 " onClick={this.handleLogin} type="button">Login</button>
                            <button className="btn btn-primary btn-lg mt-3 " onClick={this.handleRegist} type="button">Registar</button>
                        </div>
                    </form>
                </div>

                <div className="col-12">
                </div>
            </div>
        );
        
    }
}

export default Comprador;