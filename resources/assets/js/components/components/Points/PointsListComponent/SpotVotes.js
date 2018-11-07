import React, { Component } from "react";

const SpotVotes = props => {
  return (
    <div>
      <select
        id="inputState"
        className="form-control addVoteSelect"
        onChange={props.changeCurrentVote}
      >
        <option defaultValue>Wybierz</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <div className="btn btn-default" onClick={props.saveNewSpotVote}>
        Dodaj głos
      </div>
    </div>
  );
};
export default SpotVotes;
