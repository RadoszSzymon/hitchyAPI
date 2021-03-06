import React, { Component } from "react";
import axios from "axios";
import Animate from "react-smooth";

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      city: "",
      country: "",
      about: "",
      age: "",
      email: "",
      nickName: "",
      password: "",
      passwordConfirmation: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (this.state.nickName.indexOf(" ") !== -1) {
      this.props.showAlertWarning(
        "Nie można używać pustych znaków w polu Nick"
      );
    } else {
      let uniqueEmail = true;
      let uniqueNickname = true;

      if (this.state.password === this.state.passwordConfirmation) {
        const allUsers = await axios.get(`${this.props.appPath}/api/users`);

        allUsers.data.map((singleUser, i) => {
          if (
            singleUser.email == this.state.email ||
            singleUser.nickName == this.state.nickName
          ) {
            uniqueEmail = false;
          }
        });

        if (uniqueEmail === false) {
          this.props.showAlertWarning(
            "Użytkownik " + this.state.email + " już istnieję."
          );
        } else if (uniqueNickname === false) {
          this.props.showAlertWarning(
            "Użytkownik " + this.state.nickName + " już istnieję."
          );
        } else {
          const savedUser = await axios.post(`${this.props.appPath}/api/user`, {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            city: this.state.city,
            email: this.state.email,
            country: this.state.country,
            nickName: this.state.nickName,
            about: this.state.about,
            age: this.state.age,
            password: this.state.password,
            passwordConfirmation: this.state.passwordConfirmation
          });

          if (savedUser.status == "200") {
            axios
              .post(
                `${this.props.appPath}/api/login`,
                {
                  emailOrNickname: savedUser.data.userNickName,
                  password: this.state.password
                },
                {
                  headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
                  }
                }
              )
              .then(response => {
                console.log(response.data);

                if (!response.data.error) {
                  this.props.setLoginUserInfo(
                    response.data.userId,
                    response.data.userEmail,
                    response.data.userNickName
                  );

                  this.props.showAlertSuccess(
                    "Poprawnie zalogowano użytkownika."
                  );
                } else {
                  this.props.showAlertWarning("Sprawdź swoje dane");
                }
              });

            this.props.showAlertSuccess("Poprawnie stworzono nowe konto.");
          } else {
            this.props.showAlertWarning("Nie udało się stworzyć konta.");
          }
        }
      } else {
        this.props.showAlertWarning(
          "Hasło i potwierdzenie hasła nie są takie same."
        );
      }
    }
  }

  render() {
    return (
      <div className="register row registerRow">
        <div className="col-sm-6 col-sm-offset-3 registerCol">
          <Animate steps={this.props.animationSteps}>
            <div>
              <h2>Rejestracja</h2>

              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="firstName">Imię:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    onChange={this.handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Nazwisko:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    onChange={this.handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    onChange={this.handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nickName">Nick:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nickName"
                    name="nickName"
                    onChange={this.handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="age">Wiek:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="age"
                    name="age"
                    onChange={this.handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">Miasto:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    onChange={this.handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">Kraj:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="country"
                    name="country"
                    onChange={this.handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="about">O mnie(krótki opis):</label>
                  <input
                    type="text"
                    className="form-control"
                    id="about"
                    name="about"
                    onChange={this.handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Hasło:</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    onChange={this.handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="passwordConfirmation">
                    Potwierdzenie hasło:
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    onChange={this.handleChange}
                    required
                  />
                </div>

                <input
                  type="submit"
                  className="btn btn-default btnBlue btnCircled"
                  id="registerBtn"
                  value="Zatwierdź"
                />
              </form>
            </div>
          </Animate>
        </div>
      </div>
    );
  }
}
export default Register;
