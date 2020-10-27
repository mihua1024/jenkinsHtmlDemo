import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";

//判断输赢
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

//初始化按钮
//受空组件
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
class Board extends React.Component {
  //通过这个方法构建多个,按钮组件
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

//游戏组件调用 页面
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //储存每一步的记录
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      //用来表示当前是那一步
      stepNumber: 0,
    };
  }

  //改变数组状态
  handleClick(i) {
    console.log(this.state.history);
    //点击的时候+1
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    //最后一个数组就是、当前的状态
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  //返回上一步
  goBackFun() {
    if (this.state.stepNumber != 0) {
      let num = this.state.stepNumber - 1;
      this.setState({
        stepNumber: num,
        xIsNext: num % 2 === 0,
      });
    }
  }

  //前进一步：
  goForward() {
    if (this.state.stepNumber < this.state.history.length - 1) {
      let num = this.state.stepNumber + 1;
      this.setState({
        stepNumber: num,
        xIsNext: num % 2 === 0,
      });
    }
  }
  //数一下一共有几个
  totallNum(arr) {
    var map = arr.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map());
    return map;
  }
  //重置一下
  gresetFun() {
    if (this.state.stepNumber != 0) {
      this.setState({
        stepNumber: 0,
      });
    }
  }

  //判断下一个是谁,笨办法，没有有到
  judge_next() {
    const history = this.state.history.slice(0, this.state.stepNumber);
    //最后一个数组就是、当前的状态
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    //获取当前,需要返回的上一步的具体情况，判断下一步是谁
    let list = Array.from(this.totallNum(squares));
    let x;
    let o;
    if (list[1]) {
      x = list[1][1];
    }
    if (list[2]) {
      o = list[2][1];
    }
    //因为是X先下，因此不存在x=null
    let temporary = null;
    if (!x && !o) {
      console.log(1);
      temporary = true;
    } else if (!o) {
      temporary = false;
    } else if (x === o) {
      temporary = true;
    }
    if (temporary != null) {
      this.setState({
        xIsNext: temporary,
      });
      temporary = null;
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = "赢的是: " + winner;
    } else {
      status = "下一步是: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br />
          <div>
            <button onClick={() => this.gresetFun()}>重新开始</button>
          </div>
          <br />
          <div>
            <button onClick={() => this.goBackFun()}>返回上一步</button>
            &nbsp;&nbsp;
            <button onClick={() => this.goForward()}>前进一步</button>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
