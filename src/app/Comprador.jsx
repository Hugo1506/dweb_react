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
        vendedorNome: "",
        saldo: 0.0,
        listaReviews: [],
        mostraVerReviews: false,
    }



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
                        console.log(message);
                        if (message != "O user existe" && message != "Password incorreta" && message != "formato errado") {
                            this.setState({ mostraMenu: true });
                            this.setState({ userId: message });
                            return true;
                        }
                        
                    });
                } else {
                    return response.text().then(message => {
                        console.log(message);
                        this.setState({ userExisteResponse: message });
                        return false;
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    handleRegist = () => {
        this.setState({ mostrarRegistar:true})
         
    }

    handleVoltarRegist = () => {
        this.setState({ mostrarRegistar : false})
    }

    handleMostraCriarProduto = () => {
        this.setState({ mostraMenu: false });
        this.setState({ mostraCriarProduto: true }) 
    }

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
                        console.log(message);
                        this.setState({ criarProdutoResponse: message });
                    });
                } else {
                    return response.text().then(message => {
                        console.log(message);
                        this.setState({ criarProdutoResponse: message });

                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        

    }

    handleMostraCriarAnuncio = () => {
        this.setState({ mostraMenu: false });
        this.setState({ mostraCriarAnuncio: true });
        this.handleGetProdutos();
    }

    handleVoltaCriarProduto = () => {
        this.setState({ mostraCriarProduto: false });
        this.setState({ mostraMenu: true });
    }

    handleGetProdutos = () => {
        fetch("https://localhost:7287/compradores/getProdutos")
            .then(res => res.json())
            .then(result => {
                console.log(result)
        this.setState({ produtos: result })
            })
            .catch(error => console.log('error', error));
    }

    handleMostraVerAnuncios =async () => {
        this.setState({ mostraMenu: false });
        await this.handleGetProdutos();
        this.handleGetAnuncios();
        this.setState({ mostraVerAnuncios: true });
        this.handleVerSaldo();
    }

    handleGetAnuncios = () => {
        fetch("https://localhost:7287/compradores/getAnuncios")
            .then(res => res.json())
            .then(result => {
                console.log(result)
                this.setState({ anuncios: result })
            })
            .catch(error => console.log('error', error));
    }

    handleVoltaVerAnuncios = () => {
        this.setState({ mostraVerAnuncios: false });
        this.setState({ mostraMenu: true });
        this.setState({ anuncios: [] });       
    }

 

    handleCriarAnuncio = () => {
        let preco = document.getElementById('precoAnuncioInput').value;
        let produto_nome = document.getElementById('produtoAnuncioInput').value;
        let produto = this.state.produtos.find((produto) => produto.nome === produto_nome);

        let produto_id = produto.id.toString();
        console.log(preco);
        console.log(produto_id);
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
                        console.log(message);
                        this.setState({ criarAnuncioResponse: message });

                    });
                } else {
                    return response.text().then(message => {
                        console.log(message);
                        this.setState({ criarAnuncioResponse: message });

                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

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
                            console.log(message);
                            this.setState({ userCriadoResponse: message });

                        });
                    } else {
                        return response.text().then(message => {
                            console.log(message);
                            this.setState({ userCriadoResponse: message });

                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
            
        
       
    }

    handleNomeProduto(produtoFK) {
        let listaProdutos = this.state.produtos;
        let produtoEncontrado = listaProdutos.find(produto => produto.id == produtoFK)
        let produtoNome = produtoEncontrado.nome;
        return produtoNome;
    }


    handleComprar = (id) => {
        let user_val = this.state.userId;
        let anuncio_val = id.toString();
        console.log(anuncio_val);
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
                        console.log(message);
                        this.setState({ saldo: message });

                    });
                } else {
                    return response.text().then(message => {
                        console.log(message);

                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    handleVendedorNome = (id) => {
        let anuncio = this.state.anuncios.find((anuncio) => anuncio.id == id); 
        if (anuncio.vendedorFK != null) {
            this.setState({ vendedorNome: anuncio.vendedorFK });
            return this.state.vendedorNome;
        }
    }


    handleVerSaldo = () => {
        const userId = this.state.userId;
        fetch('https://localhost:7287/compradores/getSaldo?userId=' + userId)
            .then(res => res.json())
            .then(result => {
                console.log(result)
                this.setState({ saldo: result })
            })
            .catch(error => console.log('error', error));
    }


    handleGetReviews = (id) => {
        fetch('https://localhost:7287/compradores/getReviews?anunc=' + id)
            .then(res => res.json())
            .then(result => {
                console.log(result)
                this.setState({ listaReviews: result })
            })
            .catch(error => console.log('error', error));
    }

    handleVerReviews = (id) => {
        this.handleGetReviews(id);
        this.setState({ mostraVerAnuncios: false });
        this.setState({ mostraVerReviews: true });
    }

    handleVoltaVerReviews = () => {
        this.setState({ listaReviews: [] });
        this.setState({ anuncios: [] });
        this.setState({ mostraVerAnuncios: true });
        this.setState({ mostraVerReviews: false });
        this.handleGetAnuncios();
    }


    

    render() {
        let loginErro = "";
        loginErro = this.state.userExisteResponse;
        let registErro = this.state.userCriadoResponse;
        let criarProdutoMessage = this.state.criarProdutoResponse;
        let criarAnuncioMessage = this.state.criarAnuncioResponse;
        let listaAnuncios = [];
        let reviews = [];
        

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
        if (this.state.mostraMenu) {
            return (
                <div className="row" style={{ width: "500px" }}>
                    <div className="col-12">
                        <h4>Bem vindo &agrave; loja Online</h4>
                        <button className="btn btn-primary btn-lg mt-3" onClick={this.handleMostraCriarProduto} type="button">Criar um produto</button>
                        <button className="btn btn-primary btn-lg mt-3" onClick={this.handleMostraCriarAnuncio} type="button">Criar um anuncio</button>
                        <button className="btn btn-primary btn-lg mt-3" onClick={this.handleMostraVerAnuncios} type="button">Ver anuncios</button>

                    </div>
                </div>
                )
        }

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
                        <button className="btn btn-primary btn-lg mt-3 " onClick={this.handleVoltaCriarProduto} type="button">Voltar</button>

                    </div>
                </div>
            )
        }

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
                    >
                    <p style={{ display: 'inline-block', textAlign: 'left' }}        
                    >
                        Nome do produto: {this.handleNomeProduto(element.produtoFK)}<br />
                        pre&ccedil;o: {element.preco} &euro;<br />
                        nome do vendedor: {this.handleVendedorNome(element.id)}
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
                        </div>
                        <ul className="list-group" style={{ marginTop:"15px"}}>
                            {listaAnuncios}
                        </ul>
                    </div>
                </div>
            )
        }

        if (this.state.mostraVerReviews) {
            this.state.listaReviews.forEach(element => {
                reviews.push(<li
                    className="list-group-item"
                    style={{
                        margin: '15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderRight: '4px solid #585c64',
                        borderBottom: '4px solid #585c64'
                    }}
                >
                    {element.conteudo}
                </li>)


            })
            return (
                <div className="row" style={{ width: "500px" }}>
                    <div className="col-12">
                        {reviews}
                        <div className="fixed-bar">
                            <button className="btn btn-primary btn-lg mt-3" onClick={this.handleVoltaVerReviews} type="button">Voltar</button>          
                        </div>

                    </div>
                </div>
                 
        )}

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