import React, { useState } from 'react';

//React-router
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

//Debounce - Lodash
import {debounce} from 'lodash';

//Styles
import './App.scss';

//Views
import Home from './Components/Views/Home';
import Play from './Components/Views/Play';

function App() {
  //State for distinguishing signs
  const [sign,setSign] = useState(true);

  //Create state for matrix
  const [values,setValues] = useState([]);

  //Single player or player vs. player
  const [playerVsPlayer,setPlayerVsPlayer] = useState({
    AI:false,
    AImove:false  
  });

  //Debounce computer move
  const debounceComputerMove = debounce(()=>{
    computerMove(values);
  },500);

  //Create state for rows and columns
  const [dimensions,setDimensions] = useState({
    rows:null,
    columns:null
  });

  //Is there a winner?
  const [winner,setWinner] = useState(false);

  //Generate matrix and set to state
  function generateMatrix(rows,columns){
    setValues([...Array(rows)].map(e => Array(columns).fill(" "))); 
  }

  //Get size from input
  function getSize(size){
    let x = size.indexOf('x');
    let columns = Number( size.substr( x + 1 ,size.length) );
    let rows = Number( size.substr( 0 , x ) );
    generateMatrix(rows,columns);
    setDimensions({
      rows:rows,
      columns:columns
    });
  }

  //Pick random empty column
  function getRandomCol(rows) {
    return Math.floor(Math.random() * Math.floor(rows.length));
  }

  //Update matrix
  function updateValues(row,column){
    //Make a copy of matrix
    let newValue = [...values];

    if(playerVsPlayer.AI === false){
      //If clicked field has value then return / Prevent overwriting signs
      //If clicked field has not value then insert X or O component
      if(values[row][column] === " "){
        if(sign === true){
          newValue[row][column] = <p className="xSign">x</p>
        }else{
          newValue[row][column] = <p className="oSign">o</p>
        }
      }else{
        return;
      }

      //Switch sign
      setSign(!sign);

      //Update matrix with new value
      setValues(newValue);

      //Check if there is a winner
      checkWinner();

    }else{    
      //If playervsplayer.AI === true, i.e player vs computer
      if(playerVsPlayer.AImove === false){
        if(values[row][column] === " "){
            newValue[row][column] = <p className="xSign">x</p>
  
            //Switch sign
            setSign(!sign);
  
            //Update matrix with new value
            setValues(newValue);
  
            //Switch state to computer move
            setPlayerVsPlayer(prevState => ({
              ...prevState,
              AImove:true
            }));
            
            //Check if there is a winner
            checkWinner();
            
            //Computer makes a move
            debounceComputerMove(values);
        }else{
          return;
        }
      }
    }
  }

  //Computer moves
  function computerMove(values){
    let newValue = [...values];

    let emptyCols = [];
    let randomCol;

    //Loop thru matrix and find all empty cols
    for(var i=0;i<values.length;i++){
      for(var j=0;j<values[i].length;j++){
        if(values[i][j] === " "){
          emptyCols.push([[i][j] = i,j]);
        }
      }
    }

    //If there are no empty cells then return
    if(emptyCols.length > 0){
      //Get random from emptyCols
      randomCol = getRandomCol(emptyCols);

      let row = emptyCols[randomCol][0];
      let col = emptyCols[randomCol][1];

      newValue[row][col] = <p className="oSign">o</p>

      //Switch sign
      setSign(true);

      //Switch state player move
      setPlayerVsPlayer(prevState => ({
        ...prevState,
        AImove:false
      }));

      //Update matrix with new value;
      setValues(newValue);

      checkWinner();
    }else{
      return;
    } 
  }

  //Play player vs. computer
  function playPlayerVsComputer(){
    setPlayerVsPlayer({
      AI:true,
      AImove:false
    });

    setDimensions({
      rows:"3",
      columns:"3"
    })

    generateMatrix(3,3);
  }

  //Play player vs. player
  function playPlayerVsPlayer(){
    setPlayerVsPlayer({
      AI:false,
      AImove:false
    });

    setDimensions({
      rows:"3",
      columns:"3"
    })

    generateMatrix(3,3);
  }

  //Display who wins
  function displayWinner(){
    return winner;
  }

  //Check for winner
  function checkWinner(){
    var xCount = 0;
    var oCount = 0;

    //Horizontal check
    for(let i=0;i<values.length;i++){
      xCount = 0;
      oCount = 0;
      
      for(let j=0;j<values[i].length;j++){
        if(typeof values[i][j] === 'object' && values[i][j].props.children === 'x'){
          xCount++;

          if(xCount === 3){
            setWinner('X WINS!');
            displayWinner();
            return;
          }
        }else{
          xCount = 0;
        }

        if(typeof values[i][j] === 'object' && values[i][j].props.children === 'o'){
          oCount++;

          if(oCount === 3){
            setWinner('O WINS!');
            displayWinner();
            return;
          }
        }else{
          oCount = 0;
        }
      }
    }
    
    //Vertical check
    for(let i=0;i<values.length;i++){
      xCount = 0;
      oCount = 0;

      for(let j=0;j<values[i].length;j++){
        if(typeof values[j][i] === 'object' && values[j][i].props.children === 'x'){
          xCount++;

          if(xCount === 3){
            setWinner('X WINS!');
            displayWinner();
          }
        }else{
          xCount = 0;
        }

        if(typeof values[j][i] === 'object' && values[j][i].props.children === 'o'){
          oCount++;

          if(oCount === 3){
            setWinner('O WINS!');
            displayWinner();
          }
        }else{
          oCount = 0;
        }
      }
    }
    
    //Diagonal check
    //Left to right
    for (let i = 0; i < values.length; i++){
      if(typeof values[i][i] === 'object' && values[i][i].props.children === 'x'){
        xCount++;

        if(xCount === 3){
          setWinner('X WINS!');
          displayWinner();
        }
      }else{
        xCount = 0;
      }

      if(typeof values[i][i] === 'object' && values[i][i].props.children === 'o'){
        oCount++;

        if(oCount === 3){
          setWinner('O WINS!');
          displayWinner();
        }
      }else{
        oCount = 0;
      }
    }

    //Right to left
    for (let i = values.length - 1; i >= 0; i--){
      if (typeof values[values.length - 1 - i][i] === "object" && values[values.length - 1 - i][i].props.children === "x"){
        xCount++;

        if(xCount === 3) {
          setWinner("X WINS!");
          displayWinner();
        }
      }else{
        xCount = 0;
      }

      if (typeof values[values.length - 1 - i][i] === "object" && values[values.length - 1 - i][i].props.children === "o"){
        oCount++;

        if(oCount === 3) {
          setWinner("O WINS!");
          displayWinner();
        }
      }else{
        oCount = 0;
      }
    }

    //Draw
    const isFull = values.flat().every((cell) => cell !== " ");
    if(isFull === true && winner === false){
      setWinner("DRAW!");
      displayWinner();
    }
  }

  //Restart current game
  function Restart(){
    let newArr = [...values];
    for(let i=0;i<newArr.length;i++){
      for(let j=0;j<newArr[i].length;j++){
        if(newArr[i][j] !== " "){
          newArr[i][j] = " ";
        }
      }
    }

    setValues(newArr);
    setSign(true);
    setWinner(false);
    setPlayerVsPlayer({
      AI:true,
      AImove:false
    });
  }

  //Reset whole game
  function resetGame(){
    setDimensions({
      rows:null,
      columns:null
    });
    setSign(true);
    setValues([]);
    setWinner(false);
    setPlayerVsPlayer({
      AI:false,
      AImove:false
    });
  }

  return (
    <div className="App">
      <div className="container">
        <Router>
          <Switch>
            <Route exact path="/">
 
            <Home 
              getSize={getSize}
              playPlayerVsComputer={playPlayerVsComputer}
              playPlayerVsPlayer={playPlayerVsPlayer}
            />
               
            </Route>

            <Route path="/play">
              <Play 
                updateValues={updateValues}
                values={values}
                sign={sign}
                rows={dimensions.rows}
                columns={dimensions.columns}
                displayWinner={displayWinner}
                winner={winner}
                restartGame={Restart}
                resetGame={resetGame}
                />
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
