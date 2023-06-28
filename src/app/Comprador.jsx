import React, { Component } from 'react';
class Comprador extends Component {
    state = {login : "", password : ""}



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
                    console.log("ok");
                } else {
                    console.log("not ok");
                }
            } catch (error) {
                console.error('Erro inesperado:', error);
            }
        }     

    }
    handleUserExists = (login_val, password_val) => {
        return fetch('https://localhost:7287/compradores/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login: login_val, password: password_val })
        })
            .then(response => {
                if (response.ok) {
                    console.log(response.status);
                    return true;
                    
                } else {
                    console.log(response.status);
                    return false;                
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    handleRegist = () => {
        let codHTML = "";
        codHTML += '<div className="mb-4">';
        codHTML += '<label htmlFor="loginInput" className="form-label">Registar</label>';
        codHTML += '</div>';

        const form = document.getElementById('screen');
        form.innerHTML = codHTML;
         
    }
    

    render() {
        return (
            <div className="row">        
                <div className="col-12">
                    <h4>Bem vindo loja Online</h4>
                    <form id= "screen">
                        <div className="mb-4">
                            <label htmlFor="loginInput" className="form-label">Login</label>
                            <input type="text" className="form-control" id="loginInput" placeholder="Escreva a seu login" />
                            <label htmlFor="PasswordInput" className="form-label">Password</label>
                            <input type="text" className="form-control" id="passwordInput" placeholder="Escreva a sua password" />

                            <button className="btn btn-outline-primary mt-3 " onClick={this.handleLogin} type="button">Login</button>
                            <button className="btn btn-outline-primary mt-3 " onClick={this.handleRegist} type="button">Registar</button>
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