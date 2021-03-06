import React, { Component } from "react";
import axios from "axios";
import MapComponent from "./../Map/MapComponent.js";
import Animate from "react-smooth";
import { BrowserRouter as Router, Link } from "react-router-dom";

class AddNewMeeting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      description: "",
      //userId: "",
      //currentUserId: 0,
      lattitude: "",
      longitude: "",
      stopLat: "",
      stopLng: "",
      limit: "2",
      date: "",
      lat: 40.73061,
      lng: -73.935242,
      secondLat: 40.8,
      secondLng: -73.99,
      centerCoord: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setNewCoords = this.setNewCoords.bind(this);
    this.setNewSecondCoords = this.setNewSecondCoords.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    let savedMeeting;

    if (this.state.limit == "Wybierz") {
      this.props.showAlertWarning("Wybierz limit użytkowników.");
    } else if (
      !this.state.title ||
      !this.state.description ||
      !this.state.date
    ) {
      this.props.showAlertWarning("Wszystkie pola muszą być uzupełnione.");
    } else {
      try {
        savedMeeting = await axios.post(
          `${this.props.appPath}/api/events`,
          {
            title: this.state.title,
            description: this.state.description,
            user_id: this.props.userId,
            startPlaceLattitude: this.state.lat,
            startPlaceLongitude: this.state.lng,
            stopPlaceLattitude: this.state.secondLat,
            stopPlaceLongitude: this.state.secondLng,
            limit: this.state.limit,
            startDate: this.state.date
          },
          {
            headers: {
              "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
            }
          }
        );
      } catch (error) {
        console.log(error);
      }

      if (savedMeeting.status == "201") {
        this.props.showAlertSuccess("Dodałeś nowe spotkanie");
      } else {
        this.props.showAlertWarning("Nie udało się zapisać spotkania.");
      }
    }
  }

  setNewCoords(newLat, newLng) {
    this.setState({
      lat: newLat,
      lng: newLng
    });
  }

  setNewSecondCoords(newLat, newLng) {
    this.setState({
      secondLat: newLat,
      secondLng: newLng
    });
  }

  render() {
    if (this.props.userIsLoggedIn || this.props.guestUser) {
      return (
        <div className="addNewMeeting row addNewMeetingRow">
          <div className="col-sm-6 addNewMeetingCol">
            <Animate steps={this.props.animationSteps}>
              <div>
                <h2>Dodaj nowy wyjazd/wydarzenie</h2>

                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="title">Tytuł:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Opis:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="description"
                      name="description"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lattitude">
                      Szerokość geograficzna punktu startowego:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lattitude"
                      name="lattitude"
                      value={this.state.lat}
                      onChange={this.handleChange}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="longitude">
                      Wysokość geograficzna punktu startowego:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="longitude"
                      name="longitude"
                      value={this.state.lng}
                      onChange={this.handleChange}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lattitude">
                      Szerokość geograficzna punktu końcowego:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="stopLat"
                      name="stopLat"
                      value={this.state.secondLat}
                      onChange={this.handleChange}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="longitude">
                      Wysokość geograficzna punktu startowego:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="stopLng"
                      name="stopLng"
                      value={this.state.secondLng}
                      onChange={this.handleChange}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="limit">Limit uczestników:</label>
                    <div className="form-group">
                      <select
                        className="form-control"
                        name="limit"
                        id="limit"
                        onChange={this.handleChange}
                      >
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="date">Data:</label>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      name="date"
                      onChange={this.handleChange}
                    />
                  </div>
                  {this.props.userId ? (
                    <input
                      type="submit"
                      className="btn btn-default btnBlue btnCircled"
                      id="addNewMeetingBtn"
                      value="Dodaj"
                    />
                  ) : this.props.guestUser ? (
                    <Link
                      to="/login"
                      className="btn btn-default btnBlue btnCircled"
                    >
                      Zaloguj się, aby dodać wydarzenie
                    </Link>
                  ) : null}
                </form>
              </div>
            </Animate>
          </div>

          <div
            className="col-sm-6 mainMeetingsMap"
            style={{ height: "calc(100vh - 60px)" }}
          >
            <div className="mapHint">
              <p>
                Ustaw markery w interesujących Cię lokalizacjach, żeby zmienić
                współrzędne punktu startowego i końcowego.
              </p>
            </div>
            <MapComponent
              latCenter={this.state.lat}
              lngCenter={this.state.lng}
              secondLatCenter={this.state.secondLat}
              secondLngCenter={this.state.secondLng}
              allowDragableMarker={true}
              allowDragableSecondMarker={true}
              setNewCenterCoords={this.setNewCoords}
              setNewSecondCoords={this.setNewSecondCoords}
              displayFirstMarker={true}
              displaySecondMarker={true}
              centerCoord={this.state.centerCoord}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h4 className="emptyHeader">
            Musisz być zalogowany lub mieć status gościa poprzez odnośnik na
            stronie głównej.
          </h4>
        </div>
      );
    }
  }
}

export default AddNewMeeting;
