import React, { Component } from 'react';
class Comprador extends Component {
    state = {
        login: "",
        password: "",
        userExisteResponse: "",
        mostrarRegistar: false,
        userCriadoResponse: "",
        mostraMenu: false,
        mostraCriarProduto: false,
        criarProdutoResponse: "",
        mostraCriarAnuncio: false
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
                        if (message == "estou login") {
                            this.setState({ mostraMenu: true });
                        }
                        this.setState({ userExisteResponse: message });
                        return true;
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
    }

    handleVoltaCriarProduto = () => {
        this.setState({ mostraCriarProduto: false });
        this.setState({ mostraMenu: true });
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

    

    render() {
        let loginErro = "";
        loginErro = this.state.userExisteResponse;
        let registErro = this.state.userCriadoResponse;
        let criarProdutoMessage = this.state.criarProdutoResponse;


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
            return (
                <div className="row" style={{ width: "500px" }}>
                    <div className="col-12">
                        <h4>Criar um anuncio</h4>
                        <label htmlFor="precoAnuncioInput" className="form-label">pre&ccedil;o</label>
                        <input type="text" className="form-control" id="nomeProdutoInput" placeholder="Escreva o pre&ccedil;o do anuncio" />


                        <button className="btn btn-primary btn-lg mt-3 " onClick={this.handleCriarProduto} type="button">Criar</button>
                        <button className="btn btn-primary btn-lg mt-3 " onClick={this.handleVoltaCriarProduto} type="button">Voltar</button>

                    </div>
                </div>
            )
        }
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